const path = require('path');
const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const bodyParser = require('body-parser');

// MARK: - initialize express app
const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.disable('x-powered-by');

// MARK: - enable CORS header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// MARK: - add routes
require('./routes')(app);

// MARK: - start server
const server = app.listen(process.env.PORT
  || (process.env.NODE_ENV === 'production' ? 3000 : 3001),
  () => {
    console.log(`Server started on port ${server.address().port}`)
});