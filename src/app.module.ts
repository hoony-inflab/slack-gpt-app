import { Module, OnModuleInit } from '@nestjs/common';
import {
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
} from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import {
  COMMAND,
  CommandStrategy,
  EVENT_SUBSCRIPTION,
  EventSubscriptionStrategy,
  SLACK_CONTROLLER,
  SlackMethod,
} from './slack';
import { SampleModule } from './sample/sample.module';
import { ConfigSchema } from './configuration/config.schema';
import { OpenaiModule } from './libs/openai';

@Module({
  imports: [
    OpenaiModule,
    DiscoveryModule,
    SampleModule,
    ConfigModule.forRoot({
      validationSchema: ConfigSchema,
      isGlobal: true,
    }),
  ],
  providers: [EventSubscriptionStrategy, CommandStrategy],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly eventSubscriptionStrategy: EventSubscriptionStrategy,
    private readonly commandStrategy: CommandStrategy,
  ) {}

  onModuleInit() {
    const slackControllers = this.discoveryService
      .getProviders()
      .filter(
        (wrapper) =>
          wrapper.metatype &&
          Reflect.hasMetadata(SLACK_CONTROLLER, wrapper.metatype),
      );

    slackControllers.forEach((wrapper) => {
      const slackController = wrapper.instance;
      const methods = this.metadataScanner.getAllMethodNames(slackController);

      methods.forEach((method) => {
        const metadataKeys = Reflect.getMetadataKeys(
          slackController,
          method,
        ) as SlackMethod[];

        metadataKeys.forEach((key) => {
          switch (key) {
            case EVENT_SUBSCRIPTION:
              this.eventSubscriptionStrategy.route(slackController, method);
              break;
            case COMMAND:
              this.commandStrategy.route(slackController, method);
              break;
            default:
              break;
          }
        });
      });
    });
  }
}
