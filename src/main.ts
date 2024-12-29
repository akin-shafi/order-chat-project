/* eslint-disable prettier/prettier */
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BASE_URL } from './config'; // Import BASE_URL from config

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.1.0')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format **Bearer &lt;token>**'
      }
    )
    .addServer(BASE_URL) // Dynamically add server URL
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000; // Ensure your app uses the PORT env variable
  await app.listen(port, () => {
    console.log(`Server is running on ${BASE_URL}`);
  });
}
bootstrap();






