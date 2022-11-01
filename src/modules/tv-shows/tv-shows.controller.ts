import { Controller, Get, Header, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { defaultCache } from 'src/constants';
import { TvShow } from 'src/schemas/tv-show.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TvShowsService } from './tv-shows.service';

@ApiBearerAuth()
@ApiTags('tv-shows')
@Controller('tv-shows')
@UseGuards(JwtAuthGuard)
export class TvShowsController {
  constructor(private readonly tvShowsService: TvShowsService) {}

  @ApiOperation({ summary: 'Get this week trending tv shows;' })
  @ApiResponse({ status: 200, type: [TvShow] })
  @Get('trending')
  @Header('Cache-Control', defaultCache)
  async getTrendingTvShows() {
    return await this.tvShowsService.getTrending();
  }

  @ApiOperation({ summary: 'Get tv show details' })
  @ApiResponse({ status: 200, type: TvShow })
  @Get(':tvShowId')
  @Header('Cache-Control', defaultCache)
  async getTvShowById(@Param('tvShowId') tvShowId: string) {
    return await this.tvShowsService.getTvShowById(tvShowId);
  }
}
