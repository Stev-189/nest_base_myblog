import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USERNAME } from './config/constants';
import { AuthModule } from './auth/auth.module';
import { roles } from './app.roles';

@Module({
  imports: [
    //importamos la configuracion del servidor
    //TypeOrmModule.forRoot({
    //  type: 'mysql',
    //  host: 'localhost',
    //  port: 3306,
    //  username: 'root',
    //  password: 'Beherit-189',
    //  database: 'test',
    //  entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //  autoLoadEntities: true,
    //  synchronize: true,
    //}),
    TypeOrmModule.forRootAsync({
      //imports: [ConfigModule], //importamos la configuracion del servidor pero es gloabal
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>(DATABASE_HOST),
        port: parseInt(config.get<string>(DATABASE_PORT)),
        username: config.get<string>(DATABASE_USERNAME),
        password: config.get<string>(DATABASE_PASSWORD),
        database: config.get<string>(DATABASE_NAME),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        logger: 'file',
      }),
    }),

    //para variebles de entorno
    
    ConfigModule.forRoot({
      isGlobal: true,
      //donde esta la configuracion del servidor
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    AccessControlModule.forRoles(roles),
    //importamos el modulo de post
    PostModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
