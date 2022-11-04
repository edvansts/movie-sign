import { Controller, Get, Header, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { defaultCache } from 'src/constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AllService } from './all.service';
import { SearchAllQueryParams } from './all.validator';

@ApiTags('all')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('all')
export class AllController {
  constructor(private readonly allService: AllService) {}

  @ApiOperation({ summary: 'Search by query for tv shows, movies and people' })
  @Get('search')
  @Header('Cache-Control', defaultCache)
  async searchAll(@Query() params: SearchAllQueryParams) {
    return await this.allService.searchAll(params);
  }
}
