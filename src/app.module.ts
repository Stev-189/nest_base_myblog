import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';
import * as Joi from '@hapi/joi'


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
//las constantes se inyectan al database.config.ts
//import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USERNAME } from './config/constants';
import { AuthModule } from './auth/auth.module';
import { roles } from './app.roles';
import { TYPEORM_CONFIG } from './config/constants';
//se importa directoa en el app.module.ts
import databaseConfig from './config/database.config';


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
    //TypeOrmModule.forRootAsync({
    //  //imports: [ConfigModule], //importamos la configuracion del servidor pero es gloabal
    //  inject: [ConfigService],
    //  useFactory: async (config: ConfigService) => ({
    //    type: 'mysql',
    //    host: config.get<string>(DATABASE_HOST),
    //    port: parseInt(config.get<string>(DATABASE_PORT)),
    //    username: config.get<string>(DATABASE_USERNAME),
    //    password: config.get<string>(DATABASE_PASSWORD),
    //    database: config.get<string>(DATABASE_NAME),
    //    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //    autoLoadEntities: true,
    //    synchronize: true,
    //    logging: true,
    //    logger: 'file',
    //  }),
    //}),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>(TYPEORM_CONFIG),
    }),

    //para variebles de entorno
    
    ConfigModule.forRoot({
      isGlobal: true,
      //para configurar configuraciones de base de datos
      load:[databaseConfig],
      //donde esta la configuracion del servidor
      //envFilePath: ['.env.development.local', '.env.development', '.env'],
      envFilePath: `.env.${process.env.NODE_ENV  || 'development'}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
      }),
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
