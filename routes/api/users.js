const express = require('express');
const router = express.Router();


router.get('/test',(req, res) =>
  res.json({name: "Ralph", email: "ralph534@gmail.com"})
);

module.exports = router;
