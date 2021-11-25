require('./bootstrap');

const app = require('./server/app');

const loader = require('./loader/load');

const routes = require('./config/routes');

loader()
  .then(() => {
    app.listen(3333, () => {
      console.log('Server Running');
      routes(app);
    });
  })
  .catch(error => {
    console.log(error);
  });
