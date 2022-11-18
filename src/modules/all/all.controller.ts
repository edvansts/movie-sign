import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AllService } from './all.service';
import { SearchAllQueryParams } from './all.validator';

@ApiTags('all')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('all')
@UseInterceptors(CacheInterceptor)
export class AllController {
  constructor(private readonly allService: AllService) {}

  @ApiOperation({ summary: 'Search by query for tv shows, movies and people' })
  @Get('search')
  async searchAll(@Query() params: SearchAllQueryParams) {
    return await this.allService.searchAll(params);
  }
}
