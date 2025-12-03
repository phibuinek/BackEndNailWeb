import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.pass);
    if (!user) {
      return { statusCode: 401, message: 'Unauthorized' };
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: LoginDto) {
    return this.authService.register({ 
        username: registerDto.username, 
        password: registerDto.pass 
    });
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshTokens(body.refreshToken);
  }
}
