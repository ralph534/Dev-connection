const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../../config/keys')


const validateRegisterInput = require('../../validation/register')

const validateLoginInput = require('../../validation/login')




// Loading User model
const User = require('../../models/User');


/// @route GET api/users/test
/// @desc Test posts routes
/// @access Public

router.get('/test',(req, res) =>
  res.json({name: "Ralph", email: "ralph534@gmail.com"})
);





/// @route POST api/users/test
/// @desc Register users
/// @access Public

router.post('/register', (req, res) => {

///  Validator for input fields
   const {errors, isValid} = validateRegisterInput(req.body);
    if(!isValid) {
     return res.status(400).json(errors)
   }

  User.findOne({email: req.body.email})
  .then(user => {
    if(user){
      errors.email = 'Email already exists'
      return res.status(400).json(errors)
    }else {

      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      const newUser = new User ({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      })

      bcrypt.genSalt(10,(err, salt) => {    ///  Hashing OUT password by using Bcrypt
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err){
            console.log(err)
          }
          newUser.password = hash;   //Save new User with the hash
          newUser.save()
          .then(user => console.log(user))
          .catch(err => console.log(err))
        })
      })
    }
  })
})






/// @route POST api/users/login
/// @desc Logging In Users
/// @access Public

router.post('/login', (req,res) => {

  const {errors, isValid} = validateLoginInput(req.body);
   if(!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
  .then(user => {
    if(!user) {
      errors.email = 'Email doesnt match our records'
      res.status(400).json(errors)
    }

    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if(isMatch){

        const payload = ({id: user.id, name: user.name, avatar: user.avatar})

        jwt.sign(
          payload,
          keys.secretOrKey,
          {expiresIn: '2h'},
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            })
          })
      }else {
        errors.password = 'Password is invaild'
        res.status(400).json(errors)
      }
    })
  })
})

/// @route Post api/users/current     Once users is verified, path will be public to user
/// @desc Return current user

/// @access {{{{{PRIVATE}}}}}

router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
  res.json(req.user)
})


module.exports = router;
