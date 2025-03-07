import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import * as handlebars from 'handlebars';
import * as fs from 'fs-extra';
import type { Stats } from 'fs-extra';
import * as path from 'path';

/**
 * Type-safe wrapper for fs-extra operations
 * Provides consistent error handling and type safety
 */
class FileSystem {
  /**
   * Check if a path exists
   */
  static async pathExists(filePath: string): Promise<boolean> {
    try {
      // fs-extra's pathExists returns a promise that resolves to a boolean
      return await fs.pathExists(filePath);
    } catch {
      // On any error, return false safely
      return false;
    }
  }

  /**
   * Read directory contents
   */
  static async readdir(dirPath: string): Promise<string[]> {
    try {
      // Use fs-extra's readdir and explicitly cast to string[]
      const result = await fs.readdir(dirPath);
      // Filter to ensure only strings
      return result.filter((item): item is string => typeof item === 'string');
    } catch {
      // On any error, return empty array
      return [];
    }
  }

  /**
   * Read file contents with encoding
   */
  static async readFile(
    filePath: string,
    options: { encoding: BufferEncoding },
  ): Promise<string> {
    try {
      // Explicitly cast the result to string
      const content = await fs.readFile(filePath, options);
      return String(content);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to read file at ${filePath}: ${message}`);
    }
  }

  /**
   * Get file stats
   */
  static async stat(filePath: string): Promise<Stats> {
    try {
      // fs-extra's stat returns Stats object
      return await fs.stat(filePath);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get stats for ${filePath}: ${message}`);
    }
  }

  /**
   * Check if path is a directory
   */
  static async isDirectory(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }
}

interface EmailTemplateData {
  [key: string]: unknown;
}

interface DealDetails {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discountPercentage: number;
  postedBy: string;
  expiresAt?: Date;
}

interface TipData {
  dealTitle: string;
  dealId: string;
  tipAmount: number;
  tipper: string;
  message?: string;
}

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly ses: SESClient;
  private readonly logger = new Logger(EmailService.name);
  private readonly sender: string;
  private readonly templates: Map<string, handlebars.TemplateDelegate> =
    new Map();

  constructor(private readonly configService: ConfigService) {
    this.ses = new SESClient({
      region: this.configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.sender = this.configService.getOrThrow('SES_SENDER_EMAIL');
  }

  async onModuleInit(): Promise<void> {
    await this.loadTemplates();
  }

  private async loadTemplates(): Promise<void> {
    try {
      // In production, templates will be in the dist directory
      const templatesDir = path.join(__dirname, '..', 'templates', 'emails');

      // Register handlebars helpers
      handlebars.registerHelper('formatDate', (date: Date) => {
        return date ? new Date(date).toLocaleDateString() : '';
      });

      // Register partials
      await this.registerPartials(templatesDir);

      // Load all template files
      await this.loadTemplateFiles(templatesDir);

      this.logger.log('Email templates loaded successfully');
    } catch (error) {
      this.logger.error(
        'Error loading email templates',
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(
        'Failed to load email templates. Please ensure all template files exist in the templates directory.',
      );
    }
  }

  private async registerPartials(templatesDir: string): Promise<void> {
    const partialsDir = path.join(templatesDir, 'partials');

    try {
      const exists = await FileSystem.pathExists(partialsDir);
      if (!exists) return;

      const files = await FileSystem.readdir(partialsDir);

      for (const file of files) {
        if (!file.endsWith('.hbs')) continue;

        try {
          const partialName = path.basename(file, '.hbs');
          const partialPath = path.join(partialsDir, file);
          const content = await FileSystem.readFile(partialPath, {
            encoding: 'utf8',
          });
          handlebars.registerPartial(partialName, content);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : String(error);
          this.logger.warn(`Failed to load partial ${file}: ${message}`);
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Error registering partials: ${message}`);
    }
  }

  private async loadTemplateFiles(templatesDir: string): Promise<void> {
    try {
      const files = await FileSystem.readdir(templatesDir);

      for (const file of files) {
        if (!file.endsWith('.hbs')) continue;

        try {
          const filePath = path.join(templatesDir, file);
          // Use the safer isDirectory helper
          const isDir = await FileSystem.isDirectory(filePath);

          if (isDir) {
            continue;
          }

          const templateName = path.basename(file, '.hbs');
          const content = await FileSystem.readFile(filePath, {
            encoding: 'utf8',
          });
          const template = handlebars.compile(content);
          this.templates.set(templateName, template);
          this.logger.debug(`Loaded template: ${templateName}`);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : String(error);
          this.logger.error(`Failed to load template ${file}: ${message}`);
        }
      }

      if (this.templates.size === 0) {
        throw new Error('No email templates were loaded');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error loading template files: ${message}`);
      throw new Error('Failed to load email templates');
    }
  }

  private getRenderedTemplate(
    templateName: string,
    context: EmailTemplateData,
  ): string {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    // Add common template variables with proper type safety
    const templateContext: EmailTemplateData = {
      ...context,
      frontendUrl: this.configService.get<string>(
        'FRONTEND_URL',
        'https://kwikdeals.com',
      ),
      currentYear: new Date().getFullYear(),
    };

    return template(templateContext);
  }

  private async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    context: EmailTemplateData,
  ): Promise<void> {
    try {
      const htmlContent = this.getRenderedTemplate(templateName, context);

      // Generate a simpler plain text version
      const textContent = htmlContent
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const params = {
        Source: this.sender,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
          },
          Body: {
            Html: {
              Data: htmlContent,
            },
            Text: {
              Data: textContent,
            },
          },
        },
      };

      await this.ses.send(new SendEmailCommand(params));
      this.logger.log(`Email "${subject}" sent to ${to}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to send email "${subject}" to ${to}`,
        errorMessage,
      );
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationToken: string,
    username: string,
  ): Promise<void> {
    const verificationLink = `${this.configService.get(
      'FRONTEND_URL',
    )}/auth/verify-email?token=${verificationToken}`;

    await this.sendEmail(
      email,
      'Verify your KwikDeals account',
      'verification',
      {
        username: username || 'there',
        verificationLink,
      },
    );
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
    username: string,
  ): Promise<void> {
    const resetUrl = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/auth/reset-password?token=${token}`;

    await this.sendEmail(
      email,
      'Reset Your Password - KwikDeals',
      'password-reset',
      {
        username: username || 'there',
        resetUrl,
      },
    );
  }

  async sendDealAlertEmail(
    email: string,
    username: string,
    deal: DealDetails,
  ): Promise<void> {
    const dealLink = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/deals/${deal.id}`;

    await this.sendEmail(email, `New Deal Alert: ${deal.title}`, 'deal-alert', {
      username: username || 'there',
      deal,
      dealLink,
    });
  }

  async sendTipNotificationEmail(
    email: string,
    username: string,
    tipData: TipData,
  ): Promise<void> {
    const dealLink = `${this.configService.get<string>('FRONTEND_URL')}/deals/${tipData.dealId}`;

    await this.sendEmail(
      email,
      `You received a $${tipData.tipAmount} tip for your deal!`,
      'tip-notification',
      {
        username: username || 'there',
        tipData,
        dealLink,
      },
    );
  }
}
