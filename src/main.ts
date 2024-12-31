/* eslint-disable prettier/prettier */
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BASE_URL } from './config'; // Import BASE_URL from config
import rateLimiter from './rateLimiter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:3000', // React
    'http://localhost:8080', // Vue
    'http://localhost:4200', // Angular
    'http://localhost:5173', // Vite
    'http://localhost:5174',
    'http://localhost:8500',
    'https://order-chat.onrender.com', // Backend 
    'https://order-chat.netlify.app', // Deployed Frontend
  ];

  // Enable CORS for localhost:3000
  app.enableCors({
    origin: allowedOrigins, // Allow requests only from localhost:3000
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Apply rate limiting
  app.use(rateLimiter);


  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.1.0')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format **Bearer <token>**'
      }
    )
    .addServer(BASE_URL) // Dynamically add server URL
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Server is running on ${BASE_URL}`);
  });
}

bootstrap();
