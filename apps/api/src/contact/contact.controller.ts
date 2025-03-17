import { Body, Controller, Post, Logger } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactFormDto } from './dto/contact-form.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('contact')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  async submitContactForm(@Body() contactFormDto: ContactFormDto) {
    this.logger.log(
      `Contact form submission received from ${contactFormDto.email}`,
    );
    await this.contactService.sendContactEmail(contactFormDto);
    return { message: 'Your message has been sent successfully' };
  }
}
