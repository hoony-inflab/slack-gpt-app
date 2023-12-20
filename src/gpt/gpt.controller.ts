import { Client, Event, EventSubscription, SlackController } from '../slack';
import { AppMentionEvent } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { OpenaiService } from '../libs/openai';
import { SlackMessageMapper } from './mapper/slackMessage.mapper';

@SlackController()
export class GptController {
  constructor(private readonly openaiService: OpenaiService) {}

  @EventSubscription('app_mention')
  async gptHandler(
    @Event() event: AppMentionEvent,
    @Client() client: WebClient,
  ) {
    const threadId = event.thread_ts || event.ts;

    const threads = await client.conversations.replies({
      channel: event.channel,
      ts: threadId,
    });

    if (threads.messages === undefined) {
      return;
    }
    const prompt = SlackMessageMapper.toGPTPrompt(threads.messages);

    const response = await this.openaiService.askGPT(prompt);

    await client.chat.postMessage({
      channel: event.channel,
      text: response.message.content || undefined,
      thread_ts: event.ts,
    });
  }
}
