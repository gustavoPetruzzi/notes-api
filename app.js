const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models/user');
const Note = require('./models/note');

const app = express();
const sequelize = require('./utils/database');

// ROUTES
const authRoutes = require('./routes/auth');

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message,
    data
  });
});

User.hasMany(Note, {
  onUpdate: 'CASCADE'
});

sequelize
  .sync()
  .then(() => {
    console.log('connected');
    return app.listen(8080);
  })
  .catch((error) => console.log('An error ocurred : ', error));

module.exports = app;
