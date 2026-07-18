import swaggerAutogen from 'swagger-autogen';
const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:8000'
};
const outputFile = './swagger-output.json';
const routes = ['../app.js'];
swaggerAutogen()(outputFile, routes, doc);