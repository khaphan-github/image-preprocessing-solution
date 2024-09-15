import * as Joi from '@hapi/joi';

export const envKafkaValidationSchema = Joi.object({
  KAFFKA_CLIENT_ID: Joi.string().required(),
  KAFFKA_SERVICE: Joi.string().default(''),
});
