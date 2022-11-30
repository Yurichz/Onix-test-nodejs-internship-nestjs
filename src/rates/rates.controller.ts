import { Query, Controller, Get } from '@nestjs/common';
import { RatesService } from './rates.service';
import { GetRateByCurrencyDto } from './dto/get-rate-by-currency.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rate, RateDocument } from './rates.model';
import { Model } from 'mongoose';

@Controller('rates')
export class RatesController {
  constructor(
    @InjectModel(Rate.name) private rateModel: Model<RateDocument>,
    private rateService: RatesService,
  ) {}

  @Get()
  async getCurrencyRate(@Query() rateDto: GetRateByCurrencyDto) {
    let rateRecord = await this.rateService.getRateByCurrency(rateDto);
    const currentDate = Date.now();

    if (!rateRecord) {
      rateRecord = await this.rateService.setNewRate(rateDto);
    }

    const timeValid =
      (currentDate - Date.parse(rateRecord.updatedAt.toString())) / 1000 / 60;

    if (timeValid > 5) {
      rateRecord = await this.rateService.updateDueToTimeout(rateDto);
    }

    return rateRecord;
  }
}
