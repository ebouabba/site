// src/auth/42.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
  

      super({
        clientID: 'u-s4t2ud-4dbd9c7e3c0febef50e798297398f8060095fd1fd970f736b468268cf238faed',
        clientSecret: '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',
        callbackURL: 'http://localhost:3333/auth/42/callback',
        
      });
    
    }
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    // Implement user creation or retrieval logic here
    // Return the user or null if the user is not found
    
    // const  {name, emails}= profile;
    try {

      // Implement user creation or retrieval logic here
      // Return the user or null if the user is not found
    
      const user = {
        firstName: profile.name.givenName,
        email: profile.emails[0].value,
        lastName: profile.name.familyName,
        avatar: profile._json.image.link,
        username: profile.username,
      };

      // You can also handle additional validation logic here
      // For example, check if the user exists in your database
      // console.log('Received profile:', profile);
      if (user) {
        done(null, user);
      } else {
        // If the user is not found, pass an error
        done(new Error('User not found'), null);
      }
    } catch (error) {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN); //Handle and pass the error to the done function
    }
  }
}
function accessTokenIsInvalid(accessToken: string) {
  throw new Error('Function not implemented.');
}

