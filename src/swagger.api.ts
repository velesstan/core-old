import { DocumentBuilder } from '@nestjs/swagger';

import { APP_VERSION } from './version';

const options = new DocumentBuilder()
  .setTitle('Veles Services Node.js API docs')
  .setVersion(APP_VERSION)
  .addServer('/api')
  .addTag('users')
  .addTag('auth')
  .addTag('products')
  .addTag('categories')
  .addTag('stocks')
  .addBearerAuth()
  .setContact('Evgheni Calcutin', '', 'evgheni.calcutin@gmail.com')
  .build();

export default options;
