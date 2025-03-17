import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { ContactFormDto } from './dto/contact-form.dto';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly adminEmail: string;

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.adminEmail = this.configService.get<string>(
      'ADMIN_EMAIL',
      'admin@kwikdeals.net',
    );
  }

  async sendContactEmail(contactForm: ContactFormDto): Promise<void> {
    try {
      await this.authService.verifyRecaptcha(contactForm.recaptchaToken);

      await this.emailService.sendContactFormEmail(
        this.adminEmail,
        contactForm.name,
        contactForm.email,
        contactForm.subject,
        contactForm.message,
      );

      this.logger.log(
        `Contact form from ${contactForm.email} forwarded to admin`,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Rethrow reCAPTCHA validation errors
      }
      this.logger.error(`Failed to send contact form email: ${error}`);
      throw error;
    }
  }
}
