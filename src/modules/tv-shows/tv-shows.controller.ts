import {
  CacheTTL,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Season } from 'src/schemas/season.schema';
import { CustomCacheInterceptor } from 'src/config/interceptors/custom-cache-interceptor';
import { TvShow } from 'src/schemas/tv-show.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TvShowsService } from './tv-shows.service';

@ApiBearerAuth()
@ApiTags('tv-shows')
@Controller('tv-shows')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCacheInterceptor)
export class TvShowsController {
  constructor(private readonly tvShowsService: TvShowsService) {}

  @ApiOperation({ summary: 'Get this week trending tv shows;' })
  @ApiResponse({ status: 200, type: [TvShow] })
  @Get('trending')
  @CacheTTL(60 * 30)
  async getTrendingTvShows() {
    return await this.tvShowsService.getTrending();
  }

  @ApiOperation({ summary: 'Get this week trending tv shows;' })
  @ApiResponse({ status: 200, type: [TvShow] })
  @Get('on-the-air')
  @CacheTTL(60 * 30)
  async getTvShowsOnTheAir() {
    return await this.tvShowsService.getOnTheAir();
  }

  @ApiOperation({ summary: 'Get this week trending tv shows;' })
  @ApiResponse({ status: 200, type: [TvShow] })
  @Get('top-rated')
  @CacheTTL(60 * 30)
  async getTopRatedTvShows() {
    return await this.tvShowsService.getTopRated();
  }

  @ApiOperation({ summary: 'Get tv show seasons' })
  @ApiResponse({ status: 200, type: [Season] })
  @Get(':tvShowId/seasons')
  async getTvShowBySeasons(@Param('tvShowId') tvShowId: string) {
    return await this.tvShowsService.getSeasons(tvShowId);
  }

  @ApiOperation({ summary: 'Get tv show details' })
  @ApiResponse({ status: 200, type: TvShow })
  @Get(':tvShowId')
  async getTvShowById(@Param('tvShowId') tvShowId: string) {
    return await this.tvShowsService.getTvShowById(tvShowId);
  }
}
