import { Module } from '@nestjs/common';
import { GptController } from './gpt.controller';
import { OpenaiModule } from '../libs/openai';

@Module({
  imports: [OpenaiModule],
  providers: [GptController],
})
export class GPTModule {}
