const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport')

/// Loading Models

const Profile = require('../../models/Profile')
const User = require('../../models/User')

const validateProfileInput = require('../../validation/profile')





//  -------------------------------------------------------------------------------
/// @route GET api/profile
/// @desc get current users profile
/// @access {{{Private}}}

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {}
  Profile.findOne({ user: req.user.id }) /// refs {{user}} from Profile models
  .populate()
  .then(profile => {
    if(!profile){  /// if there is not a profile
      errors.noprofile = 'Profile not found'   // send this error
      return res.status(404).json(errors)
    }
    res.json(profile);
  })
  .catch(err => res.status(404).json(err))
})



//   ------------------------------------------------------------------------------
/// @route GET api/handle/:handle
/// @desc get profile by handle
/// @access {{{PUBLIC}}}

router.get('/user/:user_id', (req, res) => {
  const errors = {}
  Profile.findOne({user: req.params.user_id})
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile){
      errors.noprofile = 'Handle is not found'
      return res.status(404).json(errors)
    }
    res.json(profile)
  })
  .catch(err => res.status(404).json({profile: 'There is no profile for this user'}))
})


//   ------------------------------------------------------------------------------
/// @route GET api/profile/all
/// @desc get all profiles
/// @access {{{PUBLIC}}}

router.get('/all', (req, res) => {
  const errors = {}
  Profile.find()  /// no profile specific because I want all
  .populate('user', ['name', 'avatar'])
  .then(profiles => {
    if(!profiles){
      errors.noprofile = 'There are no profiles'
      return res.status(404).json(errors)
    }
    res.json(profiles)
  })
  .catch(err => res.status(404).json({profile: 'There are no profiles'}))
})



/// -----------------------------------------------------------------------------
/// @route GET api/profile/user/:user_id
/// @desc get profile by user_id
/// @access {{{PUBLIC}}}

router.get('/handle/:handle', (req, res) => {
  const errors = {}
  Profile.findOne({handle: req.params.handle})
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile){
      errors.noprofile = 'There is no profile for this user'
      return res.status(404).json(errors)
    }
    res.json(profile)
  })
  .catch(err => res.status(404).json(err))
})




/// -----------------------------------------------------------------------------
/// @route GET api/profile/user/:user_id
/// @desc get profile by user_id
/// @access {{{PUBLIC}}}

router.get('/handle/:handle', (req, res) => {
  const errors = {}
  Profile.findOne({handle: req.params.handle})
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile){
      errors.noprofile = 'There is no profile for this user'
      return res.status(404).json(errors)
    }
    res.json(profile)
  })
  .catch(err => res.status(404).json(err))
})









//   ----------------------------------------------------------------------------
/// @route POST api/profile
/// @desc Create Or Edit users profile
/// @access {{{Private}}}

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body)

  if(!isValid) {
    return res.status(404).json(errors)
  }

  const profileFields = {}
     profileFields.user = req.user.id
     if(req.body.handle) profileFields.handle = req.body.handle;
     if(req.body.company) profileFields.company = req.body.company;
     if(req.body.website) profileFields.website = req.body.website;
     if(req.body.location) profileFields.handle = req.body.handle;
     if(req.body.bio) profileFields.bio = req.body.bio;
     if(req.body.status) profileFields.status = req.body.status;

     /// Split skill field into an array()
     if(typeof req.body.skills !== 'undefined' ){
       profileFields.skills = req.body.skills.split(',');
     }


     /// Social is in its own object in Profile.js
     profileFields.social = {}
     if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
     if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
     if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
     if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
     if(req.body.instgram) profileFields.social.instgram = req.body.instgram;

     Profile.findOne({user: req.user.id})
     .then(profile => {
       if(profile) {    /// This is an Update if profile Exists
         //Update
         Profile.findOneAndUpdate(
           {user: req.user.id},   /// Updating the user found by their ID
            {$set: profileFields}, /// Updating the fields that the user is Updating
             {new: true})
             .then(profile => {
               res.json(profile)  // return profile
             })
       }else {
         /// Create

         /// Check handle
         Profile.findOne({handle: profileFields.handle})
         .then(profile => {
           if(profile){
             errors.handle = 'This handle alreday exists'
             res.status(404).json(errors)
           }

           /// Create and Save New Profile
           new Profile(profileFields)
           .save()
           .then(profile => {
             res.json (profile)
           })
         })
       }
     })
})

module.exports = router;
