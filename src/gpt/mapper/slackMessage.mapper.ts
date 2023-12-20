import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { MessageElement } from '@slack/web-api/dist/response/ConversationsRepliesResponse';
import * as process from 'process';

export class SlackMessageMapper {
  private static isGPTSaid(messagePayload: MessageElement): boolean {
    if (messagePayload.app_id === undefined) {
      return false;
    }

    return messagePayload.app_id === process.env.APP_ID;
  }

  static toGPTPrompt(chats: MessageElement[]): ChatCompletionMessageParam[] {
    return chats
      .map((messagePayload: MessageElement) => {
        if (this.isGPTSaid(messagePayload)) {
          return { role: 'assistant', content: messagePayload.text } as const;
        }
        return { role: 'user', content: messagePayload.text } as const;
      })
      .filter((m) => m.content);
  }
}
