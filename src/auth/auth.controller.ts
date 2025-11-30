import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Note: We use a custom method instead of @UseGuards(LocalAuthGuard) directly 
  // on the route to simplify body parsing for the time being, 
  // but standard practice is to use the Guard.
  // However, since LocalStrategy expects 'username' and 'password' in body 
  // and we want to return a JWT, let's do it manually via service for simplicity 
  // or stick to standard patterns. Let's stick to standard.
  
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.pass);
    if (!user) {
      return { statusCode: 401, message: 'Unauthorized' };
    }
    return this.authService.login(user);
  }
}

