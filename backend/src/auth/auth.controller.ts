import { Body, Controller, Get, Post, Req, UseGuards, Res, UnauthorizedException, Param } from '@nestjs/common';
import { AuthService } from './auth.service'
import { AuthDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { FortyTwoStrategy } from './42.strategy';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtMiddleware } from './jwt/jwt.middleware';



@Controller('auth')

export class AuthController {
    constructor(private authService: AuthService, private jwtService: JwtService) {
    }
    private async setJwtCookie(response: Response, userId: number): Promise<void> {
        const jwt = await this.jwtService.signAsync({ id: userId }, { expiresIn: '5h' });
        response.cookie('jwt', jwt, { httpOnly: true });
    }
    private async checkJwtCookie(@Req() request: Request, userId: number): Promise<void> {
        try {
            const cookie = request.cookies['jwt'];

            const condition = await this.jwtService.verifyAsync(cookie);
            if (!condition) {

                throw new UnauthorizedException();
            }
            // const user = await this.authService.findOne({ id: condition['id'] });
            //     console.log('JWT Cookie:', 
        } catch (e) {
            throw new UnauthorizedException()
        };
    }
    @Post('signup')
    // @UseGuards(JwtAuthGuard)
    
    signup(@Body() dto: AuthDto) {
        console.log({
            dto,
        });
        return this.authService.signup(dto);
    }
    @Post('signin')
    // @UseGuards(JwtAuthGuard)
   
    async signin(@Body() dto: AuthDto,
        @Res({ passthrough: true }) response: Response) {

        let user;
        // console.log("ddddddddddddddddd");
        if (!dto.twoFactorSecret) {

            user = await this.authService.signin(dto);
            if (user.twoFactorSecret) {
                // If 2FA is enabled, send a response indicating that 2FA is required
                // await this.setJwtCookie(response, user.id);
                return {
                    message: 'Two-Factor Authentication is enabled. Please provide the 2FA code.',
                    status: 201, // You can choose an appropriate status code
                    //   requireTwoFactor: true,
                };
            }
        }
        else {
            user = await this.authService.verifyTwoFactor(dto);
        }
        // else {
        console.log(response.status);

        await this.setJwtCookie(response, user.id);

        return {
            message: 'Authentication success',
            status: 200,
        };
        // }

    }


    @Post('verify-2fa')
    async verifyTwoFactor(@Body() dto: AuthDto, @Res({ passthrough: true }) response: Response) {
        console.log("dto", dto)
        const user = await this.authService.verifyTwoFactor_intra(dto);

        // If 2FA code is valid, generate JWT and set it in the response cookie
        console.log(user.id);
        await this.setJwtCookie(response, user.id);

        return {
            message: 'Authentication success',
            status: 200,
        };
    }
    @Get('42')
    @UseGuards(AuthGuard('42'))
    async fortyTwoAuth(
        @Req() req: Request,
        @Res() res: Response,
    ) {

    }

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async fortyTwoAuthCallback(@Req() req, @Res({ passthrough: true }) response: Response) {


        const user = await this.authService.login(req.user);
        if (user.twoFactorSecret) {
            // Two-Factor Authentication is enabled for this user
            // Redirect to a page where the user can enter their 2FA code
            response.redirect(`http://localhost:3000/enter-2fa/${user.id}`);
        }
        else {

            //  console.log("ssssss");
            const jwt = await this.jwtService.signAsync({ id: user.id })
            response.cookie('jwt', jwt, { httpOnly: true });
            response.redirect('http://localhost:3000/');
        }
    }
    @Post('set-2fa/:id/:code')
    async setTwoFactor(
        @Param('id') id: string,
        @Param('code') code: string,
    ) {

        const result = await this.authService.setTwoFactor(id, code);

        return {
            result
        };
    }
    @Get('user')
    async user(@Req() request: Request) {
        try {
            const cookie = request.cookies['jwt'];

            const condition = await this.jwtService.verifyAsync(cookie);
            if (!condition) {

                throw new UnauthorizedException();
            }
            const user = await this.authService.findOne({ id: condition['id'] });
            //     console.log('JWT Cookie:', user);
            const { hash, ...result } = user;
            return result;
        } catch (e) {
            throw new UnauthorizedException()
        }
    }
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('jwt');
        return {
            message: 'success',
            status: 201
        }

    }



}
