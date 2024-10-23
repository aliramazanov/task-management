import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  stage: Joi.string().required(),
  db_port: Joi.number().default(5432).required(),
  db_host: Joi.string().required(),
  db_username: Joi.string().required(),
  db_password: Joi.string().required(),
  jwt_secret: Joi.string().required(),
});
