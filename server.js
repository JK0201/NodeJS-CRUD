const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');

require('dotenv').config();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/public', express.static('public'));
app.use('/images', express.static(process.env.FILE_PATH));

app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Connecting
let db;
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log(error);
  }
  db = client.db('todoapp');

  //Router
  app.use('/', require('./routes/index.js'));
  app.use('/member', require('./routes/member.js')(db, bcrypt, passport));
  app.use('/posting', require('./routes/posting.js')(sessionChk, db, upload, fs, path));
  app.use('/chat', sessionChk, require('./routes/chat.js')(db));

  app.listen(process.env.PORT, function () {
    console.log('listening on ' + process.env.PORT);
  });
});

//Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'id',
      passwordField: 'pw',
      session: true,
      passReqToCallback: false,
    },
    (id, pw, done) => {
      db.collection('member').findOne({ id: id }, (err, data) => {
        if (err) {
          return done(err);
        }

        if (!data) {
          return done(null, false, { message: '아이디를 확인해주세요' });
        }

        bcrypt.compare(pw, data.pw, (err, result) => {
          if (err) {
            return console.log(err);
          }

          if (result) {
            return done(null, data);
          } else {
            return done(null, false, { message: '비밀번호를 확인해주세요' });
          }
        });
      });
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, data.id);
});

passport.deserializeUser((id, done) => {
  db.collection('member').findOne({ id: id }, (err, data) => {
    if (err) {
      return done(err);
    }
    done(null, data);
  });
});

function sessionChk(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send(
      `
        <script>
          alert('로그인 하세요');
          window.location.href='/member/sign-in';
        </script>
      `
    );
  }
}

//Multer
let multer = require('multer');
let path = require('path');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FILE_PATH);
  },
  filename: (req, file, cb) => {
    let date = new Date();

    let twoDigit = (num) => {
      return (num < 10 ? '0' : '') + num;
    };

    let timestamp =
      date.getFullYear() +
      twoDigit(date.getMonth() + 1) +
      twoDigit(date.getDate()) +
      twoDigit(date.getHours()) +
      twoDigit(date.getMinutes()) +
      twoDigit(date.getSeconds());

    cb(null, timestamp + '_' + file.originalname);
  },
});

let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new Error('jpg, jpeg, png만 업로드하세요'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
