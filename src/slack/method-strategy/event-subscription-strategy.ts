import { Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import {
  CLIENT,
  EVENT,
  EVENT_SUBSCRIPTION,
  PAYLOAD,
  SAY,
  SlackMethod,
} from '../decorator';
import { SlackAdapter } from '../slack-adapter';
import { MethodStrategy } from './method-strategy';

@Injectable()
export class EventSubscriptionStrategy implements MethodStrategy {
  private readonly slackAdapter: SlackAdapter;

  constructor(httpAdapterHost: HttpAdapterHost) {
    this.slackAdapter = httpAdapterHost.httpAdapter as SlackAdapter;
  }

  route(slackController: any, methodName: string) {
    const eventName = Reflect.getMetadata(
      EVENT_SUBSCRIPTION,
      slackController,
      methodName,
    );

    if (!eventName) {
      throw new Error(
        `must have eventName in ${slackController?.name}.${methodName}`,
      );
    }

    const metadataKeys = Reflect.getMetadataKeys(slackController, methodName);

    this.slackAdapter.event(
      eventName,
      async ({ payload, client, event, say }) => {
        const args = [];

        metadataKeys.forEach((key) => {
          switch (key) {
            case PAYLOAD: {
              const index = Reflect.getMetadata(
                PAYLOAD,
                slackController,
                methodName,
              );
              args[index] = payload;
              break;
            }

            case SAY: {
              const index = Reflect.getMetadata(
                SAY,
                slackController,
                methodName,
              );
              args[index] = say;
              break;
            }

            case EVENT: {
              const index = Reflect.getMetadata(
                EVENT,
                slackController,
                methodName,
              );
              args[index] = event;
              break;
            }

            case CLIENT: {
              const index = Reflect.getMetadata(
                CLIENT,
                slackController,
                methodName,
              );
              args[index] = client;
              break;
            }
            default:
              break;
          }
        });

        await slackController[methodName](...args);
      },
    );
  }

  support(slackMethod: SlackMethod) {
    return slackMethod === EVENT_SUBSCRIPTION;
  }
}
