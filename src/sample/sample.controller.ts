import {
  AckFn,
  ReactionAddedEvent,
  RespondArguments,
  RespondFn,
  SayFn,
  SlashCommand,
} from '@slack/bolt';

import {
  Command,
  EventSubscription,
  Payload,
  Respond,
  Say,
  SlackController,
} from '../slack';

@SlackController()
export class SampleController {
  @EventSubscription('reaction_added')
  async eventSample(@Payload() payload: ReactionAddedEvent, @Say() say: SayFn) {
    console.dir(payload, { depth: null });

    await say('Hello Slack NestJS! - EVENT');
  }

  @Command('/커맨드', false)
  async commandSample(
    @Payload() payload: SlashCommand,
    @Say() say: SayFn,
    @Respond() respond: RespondFn,
  ) {
    console.dir(payload, { depth: null });

    await say('Hello Slack NestJS! - COMMAND');

    await respond('respond');
  }

  @Command('/ping', false)
  async ping(
    @Payload() payload: SlashCommand,
    @Respond() ack: AckFn<string | RespondArguments>,
  ) {
    console.dir(payload, { depth: null });
    await ack({ text: 'pong' });
  }
}
