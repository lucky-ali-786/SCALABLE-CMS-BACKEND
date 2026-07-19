import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';
dotenv.config();

// Determine if running in production (Render) or local
const isProduction = process.env.NODE_ENV === 'production';

const doc = {
  info: {
    title: 'NEXUS CMS API',
    description: 'API documentation for NEXUS Asynchronous Content Platform'
  },
  // Exact Render URL without http:// or https://
  host: isProduction ? 'scalable-cms-api.onrender.com' : 'localhost:8000',
  schemes: isProduction ? ['https'] : ['http'],
};

const outputFile = './swagger-output.json';
const routes = ['../app.js']; 

swaggerAutogen()(outputFile, routes, doc);
