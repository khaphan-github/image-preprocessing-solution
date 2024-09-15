import * as Joi from '@hapi/joi';

export const envMongoDbValidationSchema = Joi.object({
  MONGODB_URI: Joi.string().required(),
});
