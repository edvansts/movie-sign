import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { defaultCache } from 'src/constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TvShowsService } from './tv-shows.service';

@Controller('tv-shows')
@UseGuards(JwtAuthGuard)
export class TvShowsController {
  constructor(private readonly tvShowsService: TvShowsService) {}

  @Get('trending')
  @Header('Cache-Control', defaultCache)
  async getTrendingTvShows() {
    return await this.tvShowsService.getTrending();
  }
}
