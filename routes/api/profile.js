const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport')

/// Loading Models

const Profile = require('../../models/Profile')
const User = require('../../models/User')

/// @route GET api/users/test
/// @desc Test posts routes
/// @access Public
router.get('/test',(req, res) =>
  res.json({msg: "Profile Works"})
);

/// @route GET api/profile
/// @desc get current users profile
/// @access {{{Private}}}

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {}
  Profile.findOne({ user: req.user.id }) /// refs {{user}} from Profile models
  .then(profile => {
    if(!profile){
      errors.noprofile = 'Profile not found'
      return res.status(404).json(errors)
    }
    res.json(profile);
  })
  .catch(err => res.status(404).json(err))
})

module.exports = router;
