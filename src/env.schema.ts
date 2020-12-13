import Joi from 'joi';

export const ENV_SCHEMA = Joi.object({
  APP_ENV: Joi.string().required(),
  APP_JWT_TOKEN_SECRET: Joi.string().required(),
  APP_JWT_TOKEN_EXPIRY: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});

export default () => {
  const DB_USER = process.env.DB_USER;
  const DB_PASS = process.env.DB_PASS;
  const DB_HOST = process.env.DB_HOST;
  const DB_NAME = process.env.DB_NAME;
  return {
    DB_CONNECTION: `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority&authSource=admin`,
  };
};
