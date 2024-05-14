let router = require('express').Router();

router.get('/', (req, res) => {
  let user;
  if (req.user) {
    user = req.user.id;
  } else {
    user = 'none';
  }
  res.render('index.ejs', { user: user });
});

module.exports = router;
