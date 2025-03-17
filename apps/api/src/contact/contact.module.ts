import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EmailModule, ConfigModule, AuthModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
