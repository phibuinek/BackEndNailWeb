import { Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // Return a plain object with explicit fields to avoid Mongoose/serialization issues
      return { 
          _id: user._id,
          username: user.username,
          role: user.role || 'customer' // Ensure role fallback
      };
    }
    return null;
  }

  async login(user: any) {
    // Ensure we have the necessary data
    if (!user || !user.username) {
        console.error('Login failed: Invalid user object', user);
        throw new Error('Invalid user data');
    }
    
    const payload = { username: user.username, sub: user._id, role: user.role || 'customer' };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(user._id, tokens.refresh_token);

    return {
      ...tokens,
      role: user.role || 'customer',
      username: user.username
    };
  }

  async register(user: any) {
    // Check if user exists
    const existingUser = await this.usersService.findOne(user.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    
    // Force role to customer for public registration
    const newUser = await this.usersService.create({
      ...user,
      role: 'customer' 
    });

    // Convert to plain object to ensure properties are accessible in login()
    // and consistent with validateUser() return type
    const userObject = newUser.toObject ? newUser.toObject() : newUser;
    // Ensure _id is passed correctly if toObject changes it (usually it keeps _id)
    if (!userObject._id && newUser._id) userObject._id = newUser._id;

    return this.login(userObject);
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET')!,
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.refreshToken) throw new ForbiddenException('Access denied');

      const refreshMatches = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!refreshMatches) throw new ForbiddenException('Access denied');

      const tokens = await this.getTokens({ username: user.username, sub: user._id, role: user.role });
      await this.updateRefreshToken(user._id, tokens.refresh_token);

      return {
        ...tokens,
        role: user.role,
        username: user.username,
      };
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  private async getTokens(payload: { username: string; sub: string; role: string }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET')!,
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET')!,
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(userId, hashedToken);
  }
}
