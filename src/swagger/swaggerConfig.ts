/* eslint-disable prettier/prettier */
import swaggerJsdoc from 'swagger-jsdoc'; // Correct import
import { BASE_URL } from '../config';

const swaggerOptions = {
  definition: { // Use 'definition' instead of 'swaggerDefinition' for OpenAPI 3.0+
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the backend project',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `${BASE_URL}`, // Set base URL
      },
    ],
  },
  apis: ['./src/**/*.ts'], // Adjust to match your file structure
};

const swaggerSpec = swaggerJsdoc(swaggerOptions); // Ensure correct function call
export default swaggerSpec;
