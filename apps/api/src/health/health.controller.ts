import { Controller, Get, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async checkHealth() {
    const apiStatus = { status: 'ok' };
    let databasebStatus = { status: 'ok' };
    let code = HttpStatus.OK;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      databasebStatus = { status: 'down' };
      code = HttpStatus.SERVICE_UNAVAILABLE;
    }

    return {
      api: apiStatus,
      database: databasebStatus,
      code,
    };
  }
}
