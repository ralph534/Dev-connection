const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

// Loading User model

const User = require('../../models/User');


/// @route GET api/users/test
/// @desc Test posts routes
/// @access Public

router.get('/test',(req, res) =>
  res.json({name: "Ralph", email: "ralph534@gmail.com"})
);



/// @route GET api/users/register
/// @desc Test posts routes
/// @access Public

router.post('/register', (req, res) =>  // route for register
  User.findOne({email: req.body.email})  // Find user that matches email
  .then(user => {
    if(user){  //  If a user matches the database
      return res.status(400).json({email: 'Email already exists'}) //send a 404 status with response of email already exits
    } else {
      const avatar = gravatar.url(req.body.email, {  // Else: Create avatar for user using gravatar open source
        s: '200', // Size of avatar
        r: 'pg',  // rating
        d: 'mm'  // default
      });
      const newUser = new User({  // Else: Also create new User
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {   // Hashing out Password
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err => console.log(err));
          newUser.password = hash;
          newUser.save()
          .then(user => res.json(user))
          .catch(err => console.log(err))
        })
      })
    }
  })
)


router.post('/login', (req, res) =>{
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
  .then(user => {
    if(!user){
      // Check for user
      return res.status(400).json({email: 'User email is incorrect'})
    }

    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if(isMatch){
        res.json({msg: 'Success'})
      }else{
        return res.status(400).json({password: 'User password is incorrect'})
      }
    })
  })
})
module.exports = router;
