import { DocumentBuilder } from '@nestjs/swagger';

const options = new DocumentBuilder()
  .setTitle('Veles Services Node.js API docs')
  .setVersion('1.4.1')
  .addServer('/api')
  .addTag('users')
  .addTag('auth')
  .addBearerAuth()
  .setContact('Evgheni Calcutin', '', 'evgheni.calcutin@gmail.com')
  .build();

export default options;
