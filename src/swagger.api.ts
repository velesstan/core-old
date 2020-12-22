import { DocumentBuilder } from '@nestjs/swagger';

const options = new DocumentBuilder()
  .setTitle('Veles Services Node.js API docs')
  .setVersion('4.0.0')
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
