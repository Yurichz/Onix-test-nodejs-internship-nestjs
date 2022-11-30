import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { Rate, RateDocument } from './rates.model';
import { CreateRateDto } from './dto/create-rate.dto';
import { GetRateByCurrencyDto } from './dto/get-rate-by-currency.dto';

@Injectable()
export class RatesService {
  constructor(
    @InjectModel(Rate.name) private rateModel: Model<RateDocument>,
    private http: HttpService,
  ) {}

  createRate(dto: CreateRateDto): Promise<RateDocument> {
    return this.rateModel.create(dto);
  }

  getRateByCurrency(dto: GetRateByCurrencyDto): Promise<RateDocument> {
    return this.rateModel.findOne(dto).exec();
  }

  async getResponseFromCurrencyApi(dto: GetRateByCurrencyDto) {
    const response = await this.http
      .get(`https://api.coincap.io/v2/assets/${dto.currency}`)
      .toPromise();
    const {
      data: { data },
    } = await response;

    return data;
  }

  async setNewRate(dto: GetRateByCurrencyDto): Promise<RateDocument> {
    const response = await this.getResponseFromCurrencyApi(dto);

    if (!response) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const dtoParams = {
      currency: dto.currency,
      usd: response.priceUsd,
    };

    return this.createRate(dtoParams);
  }

  async updateDueToTimeout(dto: GetRateByCurrencyDto): Promise<RateDocument> {
    const response = await this.getResponseFromCurrencyApi(dto);

    return this.rateModel.findOneAndUpdate(
      { currency: dto.currency },
      { usd: response.priceUsd },
      { new: true },
    );
  }
}
