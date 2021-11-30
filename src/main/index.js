require('./bootstrap');

const app = require('./server/app');

const loader = require('./loader/load');

const routes = require('./config/routes');

loader()
  .then(() => {
    routes(app);
    app.listen(process.env.APPLICATION_PORT || 3333, () => {
      console.log('Server Running');
    });
  })
  .catch(error => {
    console.log(error);
  });
