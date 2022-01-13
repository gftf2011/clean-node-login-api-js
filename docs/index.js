const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../swagger.json');

const server = express();
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

server.listen(3334);
