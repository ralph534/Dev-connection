const express = require('express');
const router = express.Router();


/// @route GET api/users/test
/// @desc Test posts routes
/// @access Public

router.get('/test',(req, res) =>
  res.json({msg: "Posts Works"})
);

module.exports = router;
