import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
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
    return {
      access_token: this.jwtService.sign(payload),
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
}
