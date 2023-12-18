import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaClientKnownRequestError } from '@prisma/client';
import { PrismaClient, Prisma, User } from '@prisma/client';
// import { Prisma, User } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';
import { Response, Request } from 'express';

import * as speakeasy from 'speakeasy';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    private readonly prisma: PrismaClient,
    private userService: UserService,
    private jwtService: JwtService,
  ) { }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findOne(condition: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({
      where: condition,
    });
  }


  async setTwoFactor(id: string, code: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!user || !user.tempSecret) {
        throw new NotFoundException('User or tempSecret not found');
      }

      const verified = authenticator.check(code, user.tempSecret);

      if (!verified) {
        throw new NotFoundException('Invalid 2FA code');
      }
      await this.prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          isTwoFactorEnabled: true,
          twoFactorSecret: user.tempSecret,
        },

      });
      return user;
    } catch (error) {
      throw new NotFoundException('Unable to set two-factor authentication');
    }
  }
  async verifyTwoFactor(dto: AuthDto): Promise<any> {
    // Assuming you use some form of authentication and the user object is attached to the request
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if 2FA is enabled for the user
    if (!user.twoFactorSecret) {
      throw new ForbiddenException('Two-Factor Authentication is not enabled for this user');
    }
    // console.log("dto.foto_user, user.twoFactorSecret", dto.foto_user, user.twoFactorSecret)
    const verified = authenticator.check(dto.twoFactorSecret, user.twoFactorSecret);


    if (!verified) {
      throw new ForbiddenException('Invalid Two-Factor Authentication code');
    }

    // If 2FA code is valid, return the user
    return user;
  }
  async verifyTwoFactor_intra(dto: AuthDto): Promise<any> {
    // Assuming you use some form of authentication and the user object is attached to the request
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(dto.foto_user),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if 2FA is enabled for the user
    if (!user.twoFactorSecret) {
      throw new ForbiddenException('Two-Factor Authentication is not enabled for this user');
    }
    // console.log("dto.foto_user, user.twoFactorSecret", dto.foto_user, user.twoFactorSecret)
    const verified = authenticator.check(dto.twoFactorSecret, user.twoFactorSecret);




    if (!verified) {
      throw new ForbiddenException('Invalid Two-Factor Authentication code');
    }

    // If 2FA code is valid, return the user
    return user;
  }
  async validateUser(payload: JwtPayload): Promise<User | null> {
    // Implement your logic to validate the user based on the JWT payload
    // This could involve querying a database or other authentication checks
    // Return the user if valid, or null if not
    // Replace 'User' with your actual user model
    // 'JwtPayload' should match the structure of your JWT payload
    return await this.userService.findByUserId(payload.id);
  }
  async signup(dto: AuthDto) {
    if (dto.foto_user === 'male')
      dto.foto_user =
        'https://i.pinimg.com/564x/dc/51/61/dc5161dd5e36744d184e0b98e97d31ba.jpg';
    else
      dto.foto_user =
        'https://i.pinimg.com/564x/30/c7/1b/30c71b3c02f31c2f3747c9b7404d6880.jpg';

    //generate the password hash
    try {
      const hash = await argon.hash(dto.password);
      //save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          // createdAt: new Date(),
          username: dto.username, // Replace with the desired username
          lastName: dto.lastName, // Replace with the user's last name
          isOnline: false,
          won: 0,
          lost: 0,
          level: 0,
          // foto_user: dto.foto_user,
          foto_user: dto.foto_user,
          twoFactorSecret: null,
          hash,
        },
      });
      delete user.hash;
      //return the saved user
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw e;
    }
    // return {msg: 'I have signed in'}
  }

  async signin(dto: AuthDto) {
    // return {msg: 'I have signed in'}
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials taken');
    //compare password
    const pwMathes = await argon.verify(user.hash, dto.password);
    //if password incorrect throw expception
    if (!pwMathes) throw new ForbiddenException('Credentials taken');
    delete user.hash;

    return user;
  }
  async login(requser) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: requser.email,
      },
    });
    if (user) return user;
    const user1 = await this.prisma.user.create({
      data: {
        email: requser.email,
        // createdAt: new Date(),
        username: requser.username, // Replace with the desired username
        lastName: requser.lastName, // Replace with the user's last name
        firstName: requser.firstName,
        isOnline: false,
        foto_user: requser.avatar,
        won: 0,
        lost: 0,
        level: 0,
        hash: '', // Replace with the actual password hash
      },
    });
    // delete user.hash;
    //return the saved user
    return user1;
  }
}
