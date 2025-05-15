import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as pgSession from 'connect-pg-simple';
import { Pool } from 'pg';
import { AllExceptionsFilter } from './common/filter/exception-filter';
import { ResponseInterceptor } from './common/interceptor/response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const PgSession = pgSession(session);

  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  app.set('trust proxy', 1); // needed for secure cookies in devtunnels

  app.use(
    session({
      store: new PgSession({
        pool: pgPool,
        tableName: 'session',
      }),
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true, // true = only over HTTPS
        sameSite: 'none', // necessary for cross-origin
        maxAge: 1000 * 60 * 60, // 1 hour
      },
    }),
  );

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
    origin: true,
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
