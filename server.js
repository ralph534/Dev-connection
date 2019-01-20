const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')



const app = express();


// DB config
const db = require('./config/keys').mongoURI;

// Connect to mongodb through mongoose
mongoose.connect(db)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));


app.get('/', (req,res) =>
  res.send('Hey,  to my first node server!')
)

// Use routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

const port = 5000;

app.listen(port, () => console.log(`Server is running on port ${port}....`))
