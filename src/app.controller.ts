import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthsService } from './auth/auths.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authsService: AuthsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
