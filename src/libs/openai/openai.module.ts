import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

import { OpenaiService } from './openai.service';
import { AppConfigType } from '../../configuration/appConfig.type';

@Module({
  providers: [
    OpenaiService,
    {
      provide: OpenAI.name,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfigType>) => {
        return new OpenAI({ apiKey: configService.get('OPENAI_API_KEY') });
      },
    },
  ],
  exports: [OpenaiService],
})
export class OpenaiModule {}
