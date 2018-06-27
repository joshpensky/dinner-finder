const path = require('path');
const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// MARK: - initialize express app
const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb', parameterLimit: 1000000 }));
app.use(logger('dev'));
app.disable('x-powered-by');

// MARK: - enable CORS header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, DELETE'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// MARK: - add routes
require('./routes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/200.html'));
  });
}

// MARK: - start server
const server = app.listen(process.env.PORT
  || (process.env.NODE_ENV === 'production' ? 3000 : 3001), () => {
  console.log(`Server started on port ${server.address().port}`)
});