require('./bootstrap');

const app = require('./server/app');

const loader = require('./loader/load');
const routes = require('./config/routes');

loader()
  .then(() => {
    routes(app);
    app.listen(parseInt(process.env.APPLICATION_PORT, 10) || 3333, () => {
      console.log('Server Running');
    });
  })
  .catch(error => {
    console.log(error);
  });
