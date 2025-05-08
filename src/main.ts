import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filter/exception-filter';
import { ResponseInterceptor } from './common/interceptor/response/response.interceptor';
import * as session from 'express-session';
import * as passport from 'passport';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Trust the dev-tunnel or reverse proxy (so that secure cookies can be set)
  app.set('trust proxy', 1);

  // Configure session middleware
  app.use(
    session({
      secret: 'your-secret-here',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true, // ensure cookie is sent over HTTPS
        sameSite: 'none', // allow cookie in cross-site OAuth redirect
        // domain: 'uks1.devtunnels.ms', // (optional) set domain if needed
      },
    }),
  );

  // Initialize Passport (after session middleware)
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders: 'Authorization, Content-Type',
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT);
}
bootstrap();
