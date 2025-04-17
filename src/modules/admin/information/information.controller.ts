import { Controller, Get, UseGuards } from '@nestjs/common';
import { InformationService } from './information.service';
import { Roles } from 'src/modules/auth/auth.decorator';
import { AuthGuard } from 'src/modules/auth/guard/auth/auth.guard';
import { RoleGuard } from 'src/modules/auth/guard/role/role.guard';

@Controller('information')
@UseGuards(AuthGuard, RoleGuard)
@Roles('OWNER')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @Get()
  async fetchInformation() {
    return this.informationService.getInformation();
  }
}
