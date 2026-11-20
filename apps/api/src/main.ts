import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule, configureApplication } from './application.js';
import { configuration, loadLocalEnvironment } from './environment.js';

async function bootstrap() {
  loadLocalEnvironment();
  const app = await NestFactory.create(AppModule, {
    logger: false,
    bodyParser: true,
  });
  configureApplication(app);
  await app.listen(configuration().port);
}

void bootstrap();
