import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: (origin: any, cb: any) => {
      if (!origin) return cb(null, true);

      if (origin === process.env.CLIENT_URL) {
        return cb(null, true);
      }

      cb(new Error('CORS blocked'));
    },
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`API running in http://localhost:${port}/api/v1`);
}
bootstrap();
