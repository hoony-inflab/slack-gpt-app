import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class OpenaiService {
  private GPT_MODEL = 'gpt-3.5-turbo';
  constructor(private readonly openai: OpenAI) {}

  async askGPT(
    messages: ChatCompletionMessageParam[],
  ): Promise<OpenAI.Chat.Completions.ChatCompletion.Choice> {
    const chatCompletion = await this.openai.chat.completions.create({
      model: this.GPT_MODEL,
      messages,
    });

    return chatCompletion.choices[0];
  }
}
