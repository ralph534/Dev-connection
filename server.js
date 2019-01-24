const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express();

///  Body Parser Middleare
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

// mongodb config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB

mongoose.connect(db)
.then(() => console.log('MongoDB is officially connected...'))
.catch(err => console.log(err))



// PassPort middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport)

/// Route middleware
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


const port = 5000;

app.listen(port, () => console.log(`Server is being recieved on port ${port}`))
