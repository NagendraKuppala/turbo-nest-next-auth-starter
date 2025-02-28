import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  serverStatus(): string {
    return `Server runner in Port: ${process.env.PORT}`;
  }
}
