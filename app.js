const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb')
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - ',err));

const {usersRouter} = require('./routes/users.js')
const {cardsRouter} = require('./routes/cards.js')

const logger = (req, res, next) => {
  console.log('Запрос залогирован!');
  next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);
app.use((req, res, next) => {
  req.user = {
    _id: '62a253b29824529d333737ee'
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
