import 'reflect-metadata';
import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  ArgumentsHost,
  Catch,
  Controller,
  ExceptionFilter,
  Get,
  Header,
  HttpException,
  INestApplication,
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
import helmetImport, { type HelmetOptions } from 'helmet';
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
const PUBLIC_CACHE_CONTROL =
  'public, max-age=0, s-maxage=60, stale-while-revalidate=300';
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
      .setHeader('Cache-Control', 'no-store')
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
  @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
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
  @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
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
  @Get('categories')
  @Header('Cache-Control', PUBLIC_CACHE_CONTROL)
  @ApiOkResponse({ type: [Category] })
  categories() {
    return this.catalogue.categories();
  }
}
@Controller()
class HealthController {
  constructor(@Inject(Database) private readonly db: Database) {}
  @Get('health')
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: Health })
  @ApiServiceUnavailableResponse({ type: ApiError })
  async health() {
    await this.db.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }
}
type HelmetMiddleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: unknown) => void,
) => void;
type HelmetFactory = (options?: Readonly<HelmetOptions>) => HelmetMiddleware;
function resolveHelmet(imported: unknown): HelmetFactory {
  if (typeof imported === 'function') {
    return imported as HelmetFactory;
  }
  if (
    typeof imported === 'object' &&
    imported !== null &&
    'default' in imported &&
    typeof (imported as { default: unknown }).default === 'function'
  ) {
    return (imported as { default: HelmetFactory }).default;
  }
  throw new Error('Unable to resolve helmet middleware');
}
@Module({
  controllers: [CatalogueController, HealthController],
  providers: [Catalogue, Database],
})
export class AppModule {}
export function configureApplication(app: INestApplication) {
  const helmet = resolveHelmet(helmetImport);
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
export async function createApplication() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    bodyParser: true,
  });
  return configureApplication(app);
}
export function document(app: INestApplication) {
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
