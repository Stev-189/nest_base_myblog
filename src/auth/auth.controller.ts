import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
//import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

import { Auth, User } from 'src/common/decorators';
import { User as UserEntity } from 'src/user/entities';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LocalAuthGuard} from './guards';

@ApiTags('Auth Routes') // swagger
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(
        @Body() LoginDto: LoginDto,
        @User() user: UserEntity
        ) {
        const data= this.authService.login(user);
        return {
            result: true,
            message: 'Login Successful',
            data
        }
    }

    /* @UseGuards(JwtAuthGuard)
    @ApiBearerAuth() */
    @Auth()
    @Get('profile')
    async profile(
        @User() user: UserEntity,
    ) {
        return {
            result: true,
            message: 'Profile Successful',
            data: user
        }
    }

    //@UseGuards(JwtAuthGuard)
    @Auth()
    @Get('refresh')
    refresh(@User() user: UserEntity) {
        const data= this.authService.login(user);
        return {
            result: true,
            message: 'Refresh Successful',
            data
        }
    }
}
