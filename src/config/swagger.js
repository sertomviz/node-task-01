export default {
    swaggerDefinition: {
      info: {
        title: 'Zombie API',
        description: 'Zombie API specification',
        servers: [`http://localhost:${process.env.API_PORT || 9001}`]
      }
    },
    apis: ['./src/routes/zombies.js']
};
