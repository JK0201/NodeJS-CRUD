let router = require('express').Router();

module.exports = function (db, bcrypt, passport) {
  router.get('/sign-up', (req, res) => {
    res.render('signup.ejs');
  });

  router.get('/sign-in', (req, res) => {
    res.render('signin.ejs');
  });

  //Id check
  router.get('/id-chk', (req, res) => {
    db.collection('member').findOne(req.query, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: 'Unexpected error occured' });
      }

      if (data) {
        return res.status(200).send({ idAvailable: false });
      } else {
        return res.status(200).send({ idAvailable: true });
      }
    });
  });

  //Add new member
  router.post('/add-member', (req, res) => {
    if (!req.body.id || !req.body.pw || !req.body.name) {
      return res.send(
        `
        <script>
          alert('Unexpected error occured');
          window.location.href='/';
        </script>
      `
      );
    }

    bcrypt.hash(req.body.pw, 10, (err, encryptedPw) => {
      req.body.pw = encryptedPw;

      db.collection('member').insertOne(req.body, (err, data) => {
        if (err) {
          console.log(err);
          return res.send(
            `
            <script>
              alert('Unexpected error occured');
              window.location.href='/';
            </script>
          `
          );
        }
        res.send(
          `
          <script>
            alert('회원가입을 성공적으로 완료했습니다');
            window.location.href='/';
          </script>
        `
        );
      });
    });
  });

  //Fail
  router.get('/fail', (req, res) => {
    res.send(
      `
      <script>
        alert('아이디와 비밀번호를 확인하세요');
        window.location.replace('/member/sign-in');
      </script>
    `
    );
  });

  //Signin member
  router.post('/sign-in', passport.authenticate('local', { failureRedirect: '/member/fail' }), (req, res) => {
    if (!req.body.id || !req.body.pw) {
      return res.send(
        `
        <script>
          alert('Unexpected error occured');
          window.location.href='/';
        </script>
      `
      );
    }
    res.redirect('/');
  });

  //Signout member
  router.get('/sign-out', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: 'Unexpected error occured' });
      }
      req.session.destroy();
      res.clearCookie('connect.sid');
      res.status(200).send({ message: '성공적으로 로그아웃 했어요' });
    });
  });

  return router;
};
