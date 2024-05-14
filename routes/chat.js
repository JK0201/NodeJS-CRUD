let router = require('express').Router();
const { ObjectId } = require('mongodb');

module.exports = function (db, sessionChk) {
  //Chat list
  router.get('/', async function (req, res) {
    let roomData = await db.collection('chatroom').find({ user: req.user._id }).toArray();
    for (let item of roomData) {
      let postData = await db.collection('posting').findOne({ posting_id: item.posting_id });
      item.image = postData.image;
    }
    res.render('chatlist.ejs', { chatroom: roomData });
  });

  //Chat room
  router.get('/create/:id/:writer/:title', async function (req, res) {
    let roomData = {
      posting_id: parseInt(req.params.id),
      title: req.params.title,
      user: [ObjectId(req.params.writer), req.user._id],
    };

    try {
      let roomInfo = await db.collection('chatroom').findOne(roomData);

      if (!roomInfo && req.params.writer !== req.user._id.toString()) {
        await db.collection('chatroom').insertOne(roomData);
      }
      let data = await db
        .collection('chatroom')
        .findOne({ posting_id: parseInt(req.params.id), title: req.params.title, user: req.user._id });
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Unexpected error occurred' });
    }
  });

  router.get('/roomid/:id', async function (req, res) {
    try {
      let data = await db.collection('chatroom').findOne({ _id: ObjectId(req.params.id) });
      res.render('chatroom.ejs', {
        posting_id: data._id,
        title: data.title,
        writer: data.user[0],
      });
    } catch (err) {
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
  });

  //Event Source
  router.get('/msg/:id', (req, res) => {
    res.writeHead(200, {
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    });

    let msgData = {
      posting_id: req.params.id,
    };
    db.collection('msg')
      .find(msgData)
      .toArray((err, data) => {
        res.write('event:user\n');
        res.write(`data:${req.user._id}\n\n`);
        res.write('event:msg\n');
        res.write(`data:${JSON.stringify(data)}\n\n`);
      });

    const pipeline = [
      {
        $match: { 'fullDocument.posting_id': req.params.id },
      },
    ];

    const changeStream = db.collection('msg').watch(pipeline);
    changeStream.on('change', (data) => {
      res.write('event:msg\n');
      res.write(`data:${JSON.stringify([data.fullDocument])}\n\n`);
    });
  });

  //msg
  router.post('/msg', async function (req, res) {
    let msgData = {
      posting_id: req.body._id,
      sender: req.user._id,
      msg: req.body.msg,
    };

    try {
      await db.collection('msg').insertOne(msgData);
      res.status(200).send({ message: '메세지 전송 완료' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Unexpected error occurred' });
    }
  });

  return router;
};
