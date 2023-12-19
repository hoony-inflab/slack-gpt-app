import * as Joi from 'joi';
import { AppConfigType } from './appConfig.type';

export const ConfigSchema = Joi.object<AppConfigType>({
  APP_TOKEN: Joi.string().required(),
  SIGNING_SECRET: Joi.string().required(),
  // CLIENT_SECRET: Joi.string().required(),
  // CLIENT_ID: Joi.string().required(),
  BOT_OAUTH_TOKEN: Joi.string().required(),
  OPENAI_API_KEY: Joi.string().required(),
});
