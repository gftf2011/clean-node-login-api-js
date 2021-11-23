const app = require('./server/app');

const loader = require('./loader/load');

loader()
  .then(() => {
    app.listen(3333, () => {
      console.log('Server Running');
    });
  })
  .catch(error => {
    console.log(error);
  });
