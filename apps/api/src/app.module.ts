import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { HealthController } from './health/health.controller';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
