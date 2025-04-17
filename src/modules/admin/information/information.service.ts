import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class InformationService {
  constructor(private prisma: PrismaService) {}

  async getInformation() {
    return this.prisma.information.findFirst({
      where: { deletedAt: null },
    });
  }
}
