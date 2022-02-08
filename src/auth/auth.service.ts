import { Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { User } from '../user/entities';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne({ email });
        //console.log(user);
        if (user && await compare(password, user.password)) {
            const { password, ...rest } = user;//elimina la contraseña del objeto
            return rest;
        }

        return null;
    }
    
    login(user: User) {
        const {id, ...rest} = user;
        const payload= {sub: id}
        return {
            user,
            access_token: this.jwtService.sign(payload),
        }
    }
}
