import { Client, Event, EventSubscription, SlackController } from '../slack';
import { AppMentionEvent } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { OpenaiService } from '../libs/openai';

@SlackController()
export class GptController {
  constructor(private readonly openaiService: OpenaiService) {}

  @EventSubscription('app_mention')
  async gptHandler(
    @Event() event: AppMentionEvent,
    @Client() client: WebClient,
  ) {
    const threadTs = event.thread_ts || event.ts;

    const result = await client.conversations.replies({
      channel: event.channel,
      ts: threadTs,
    });

    if (result.messages === undefined) {
      return;
    }
    const messages: ChatCompletionMessageParam[] = result.messages
      .map((messagePayload) => {
        if (messagePayload.display_as_bot) {
          return { role: 'assistant', content: messagePayload.text };
        }
        return { role: 'user', content: messagePayload.text };
      })
      .filter((m) => m.content) as ChatCompletionMessageParam[];

    const response = await this.openaiService.askGPT(messages);

    await client.chat.postMessage({
      channel: event.channel,
      text: response.message.content || undefined,
      thread_ts: event.ts,
    });
  }
}
