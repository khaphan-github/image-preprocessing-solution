import * as Joi from '@hapi/joi';

export const envValidationSchema = Joi.object({
  MINIO_ENDPOINT: Joi.string().required(),
  MINIO_PORT: Joi.number().default(9000),
  MINIO_USE_SSL: Joi.string().valid('true', 'false').default('false'),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
});
