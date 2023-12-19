import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SlackAdapter } from './slack/slack-adapter';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new SlackAdapter({
      appToken: process.env.APP_TOKEN,
      signingSecret: process.env.SIGNING_SECRET,
      token: process.env.BOT_OAUTH_TOKEN,
    }),
  );
  await app.listen(3031);
}
bootstrap();
