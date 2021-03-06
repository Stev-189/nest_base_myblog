import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import { PORT } from './config/constants';
//esta era la importacion de config que no usaremos 
//import setDefaultUser from './config/default-user';
import { generateTypeormConfigFile, setDefaultUser } from './scripts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(`Bootstrap`);
  //condifuracion de puerto en env
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>(PORT), 10) || 3000;

  //iniciamos Swagger para la documentacion de la API
  initSwagger(app);
  setDefaultUser(config);
  generateTypeormConfigFile(config);

  //validador de los envio de datos DTOS
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
