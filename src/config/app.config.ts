export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  dbPassword: process.env.DB_PASSWORD,
  port: process.env.PORT || 30001,
});
