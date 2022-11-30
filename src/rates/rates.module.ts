import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';
import { Rate, RateSchema } from './rates.model';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rate.name, schema: RateSchema }]),
    HttpModule,
  ],
  controllers: [RatesController],
  providers: [RatesService],
})
export class RatesModule {}
