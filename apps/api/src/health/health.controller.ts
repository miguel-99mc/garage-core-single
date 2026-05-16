import { Controller, Get, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async checkHealth() {
    const result = {
      status: 'ok',
      services: {
        api: 'ok',
        database: 'ok',
      },
    };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      result.status = 'degraded';
      result.services.database = 'down';
    }

    return result;
  }
}
