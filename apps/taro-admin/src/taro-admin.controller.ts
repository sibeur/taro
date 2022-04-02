import { AuthService } from '@core/simple-auth/services/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Res,
  Session,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UIReqInterceptor } from './interceptors/ui.interceptor';
import { Session as Sess } from 'fastify-secure-session';
import { AuthSession } from '@core/simple-auth/decorators/auth.decorator';
import { Role } from '@core/simple-auth/typesAndInterface/role';
import { HttpExceptionFilter } from './exceptions/taro-admin.exception';

@UseInterceptors(UIReqInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller()
export class TaroAdminController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @AuthSession([Role.ADMIN], '/login')
  @Render('index')
  index() {
    return { pageTitle: 'Home' };
  }

  @Get('login')
  @Render('login')
  login(@Session() sess: Sess, @Res() res) {
    if (sess.get('taro_sess')) return res.status(302).redirect('/');
    return { pageTitle: 'Login' };
  }

  @Post('login')
  @Render('login')
  async doLogin(
    @Res() res,
    @Body() body: LoginDto,
    @Session() sess: Sess,
  ): Promise<any> {
    const { clientId, secretKey } = body;
    const client = await this.authService.validateCredential(
      clientId,
      secretKey,
    );
    if (client) {
      const token = Buffer.from(`${clientId}:${secretKey}`).toString('base64');
      sess.set('taro_sess', token);
      return res.status(302).redirect('/');
    }
    return { error: 'Invalid Credentials' };
  }

  @Get('logout')
  @AuthSession([Role.ADMIN], '/login')
  logout(@Res() res, @Session() sess: Sess) {
    sess.delete();
    return res.status(302).redirect('/login');
  }
}
