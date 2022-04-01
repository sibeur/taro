import { AuthService } from '@core/simple-auth/services/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UIReqInterceptor } from './interceptors/ui.interceptor';

@UseInterceptors(UIReqInterceptor)
@Controller()
export class TaroAdminController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Render('index')
  index() {
    return { pageTitle: 'Home' };
  }

  @Get('login')
  @Render('login')
  login() {
    return { pageTitle: 'Login' };
  }

  @Post('login')
  @Render('login')
  async doLogin(@Res() res, @Body() body: LoginDto) {
    const { clientId, secretKey } = body;
    const client = await this.authService.validateCredential(
      clientId,
      secretKey,
    );
    if (client) return res.status(302).redirect('/');
    return { error: 'Invalid Credentials' };
  }
}
