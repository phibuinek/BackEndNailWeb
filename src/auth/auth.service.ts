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
    
    const userId = user._id?.toString ? user._id.toString() : user._id;
    const payload = { username: user.username, sub: userId, role: user.role || 'customer' };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(userId, tokens.refresh_token);

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
      const jwtSecret = this.configService.get<string>('JWT_SECRET')!;
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || jwtSecret;
      
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new ForbiddenException('User not found');
      }
      
      if (!user.refreshToken) {
        throw new ForbiddenException('No refresh token stored for user');
      }

      const refreshMatches = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!refreshMatches) {
        throw new ForbiddenException('Refresh token mismatch');
      }

      const userId = user._id?.toString ? user._id.toString() : (user._id as any);
      const tokens = await this.getTokens({ username: user.username, sub: userId, role: user.role });
      await this.updateRefreshToken(userId, tokens.refresh_token);

      return {
        ...tokens,
        role: user.role,
        username: user.username,
      };
    } catch (error) {
      // Log error for debugging but don't expose details to client
      if (error instanceof ForbiddenException) {
        throw error;
      }
      // JWT verification errors (expired, invalid, etc.)
      throw new ForbiddenException('Invalid or expired refresh token');
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

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new ForbiddenException('Current password is incorrect');
    }

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(userId, hashedNewPassword);

    return { message: 'Password changed successfully' };
  }
}
