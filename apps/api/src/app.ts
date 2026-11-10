import 'reflect-metadata';
import {
  ArgumentsHost,
  Catch,
  Controller,
  ExceptionFilter,
  Get,
  HttpException,
  Inject,
  Module,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiServiceUnavailableResponse,
  ApiTags,
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import type { Response } from 'express';
import helmet from 'helmet';
import { Catalogue } from './catalogue.js';
import { Database } from './database.js';
import {
  Animation,
  AnimationPage,
  AnimationQuery,
  AnimationSlug,
  ApiError,
  Category,
  Health,
} from './dto.js';
import { configuration } from './environment.js';
const validation = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
});
@Catch()
class SafeErrors implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const status = error instanceof HttpException ? error.getStatus() : 503;
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(status)
      .json({
        statusCode: status,
        message:
          status === 400
            ? 'Parameter permintaan tidak valid'
            : status === 404
              ? 'Tidak ditemukan'
              : 'Layanan sementara tidak tersedia',
      });
  }
}
@ApiTags('Public catalogue')
@ApiServiceUnavailableResponse({ type: ApiError })
@Controller('api')
class CatalogueController {
  constructor(@Inject(Catalogue) private readonly catalogue: Catalogue) {}
  @Get('animations')
  @ApiOkResponse({ type: AnimationPage })
  @ApiBadRequestResponse({ type: ApiError })
  @ApiQuery({ name: 'q', required: false, type: String, maxLength: 200 })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({
    name: 'difficulty',
    required: false,
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    minimum: 1,
    maximum: 10000,
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    minimum: 1,
    maximum: 100,
    default: 12,
  })
  async list(@Query() raw: AnimationQuery) {
    const query = await validation.transform(raw, {
      type: 'query',
      metatype: AnimationQuery,
    });
    return this.catalogue.list(query as AnimationQuery);
  }
  @Get('animations/:slug')
  @ApiOkResponse({ type: Animation })
  @ApiNotFoundResponse({ type: ApiError })
  @ApiBadRequestResponse({ type: ApiError })
  @ApiParam({ name: 'slug', type: String })
  async detail(@Param() raw: AnimationSlug) {
    const params = (await validation.transform(raw, {
      type: 'param',
      metatype: AnimationSlug,
    })) as AnimationSlug;
    return this.catalogue.detail(params.slug);
  }
  @Get('categories') @ApiOkResponse({ type: [Category] }) categories() {
    return this.catalogue.categories();
  }
}
@Controller()
class HealthController {
  constructor(@Inject(Database) private readonly db: Database) {}
  @Get('health')
  @ApiOkResponse({ type: Health })
  @ApiServiceUnavailableResponse({ type: ApiError })
  async health() {
    await this.db.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }
}
@Module({
  controllers: [CatalogueController, HealthController],
  providers: [Catalogue, Database],
})
class AppModule {}
export async function createApplication() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    bodyParser: true,
  });
  app.use(helmet());
  app.enableCors({
    origin: configuration().origins,
    methods: ['GET'],
    credentials: false,
  });
  app.useGlobalPipes(validation);
  app.useGlobalFilters(new SafeErrors());
  app.enableShutdownHooks();
  SwaggerModule.setup('api/docs', app, () => document(app));
  return app;
}
export function document(app: Awaited<ReturnType<typeof createApplication>>) {
  return SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Belajar Animasi API')
      .setDescription(
        'Public read-only catalogue; authentication is not required. No write endpoints.',
      )
      .setVersion('1.0.0')
      .build(),
  );
}
