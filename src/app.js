const express = require('express');
const User = require('./models/User');
const connect = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = 'estudo-tdd';

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
connect();

app.get('/', (req, res) => {
   return res.status(200).json({});
});

app.post('/user', async  (req, res) => {
  const { name, email, password } = req.body;

  if(name === '' || email === '' || password === ''){
    return res.status(400).send();
  }

  const exists = await User.findOne({
    email
  });

  if(exists){
    return res.status(400).send();
  }

  const hashPassword = await bcrypt.hash(password, 8);
  
  const user = new User({
    name,
    email,
    password: hashPassword,
  });

  await user.save();

  res.status(200).json(user);
});

app.delete('/user/:email', async (req, res) => {
  const { email } = req.params;

  await User.deleteOne({
    email
  });

  return res.status(200).send();
});

app.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if(!user){
    return res.status(400).json({
      msg: 'Usuario nao existe'
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if(!passwordMatch){
    return res.status(400).json({
      msg: 'Senha incorreta'
    })
  }

  const token = jwt.sign({email, password}, secret, {
    expiresIn: '7d'
  });

  return res.status(200).json({token});
})

module.exports = app;
