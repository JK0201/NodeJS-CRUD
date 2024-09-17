let router = require('express').Router();

module.exports = function (sessionChk, db, upload, fs, path) {
  //Board list
  router.get('/list', (req, res) => {
    db.collection('posting')
      .find()
      .sort({ posting_id: -1 })
      .toArray((err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ message: 'Unexpected error occurred' });
        }
        res.render('list.ejs', { posting: data });
      });
  });

  //Posting
  router.get('/add-item', sessionChk, (req, res) => {
    res.render('posting.ejs');
  });

  router.post('/add-item', sessionChk, upload.array('upload', 3), async function (req, res) {
    let upload = req.files;
    let image;

    if (upload.length > 0) {
      image = [];
      upload.forEach((item, idx) => {
        image.push(item.filename);
      });
    } else {
      image = null;
    }

    try {
      let counter = await db.collection('counter').findOne({ name: 'posting' });

      let postingData = {
        posting_id: counter.count + 1,
        writer: req.user.id,
        writer_id: req.user._id,
        title: req.body.title,
        content: req.body.content,
        image: image,
      };

      await db.collection('posting').insertOne(postingData);
      await db.collection('counter').updateOne({ name: 'posting' }, { $inc: { count: 1 } });

      console.log('Posting has been completed');
      res.status(200).send({ message: '게시글을 등록했어요' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Unexpected error occurred' });
    }
  });

  //Detail
  router.get('/detail', (req, res) => {
    let user;
    if (req.user) {
      user = {
        _id: req.user._id,
      };
    } else {
      user = {
        _id: 'guest',
      };
    }

    req.query._id = parseInt(req.query._id);
    db.collection('posting').findOne({ posting_id: req.query._id }, (err, data) => {
      if (data == null) {
        return res.status(302).redirect("/posting/list");
      }
      res.render('detail.ejs', { posting: data, user: user });
    });
  });

  //Delete
  router.delete('/delete', sessionChk, async function (req, res) {
    req.body._id = parseInt(req.body._id);
    try {
      let posting = await db.collection('posting').findOne({ posting_id: req.body._id });

      if (posting.image) {
        posting.image.forEach((item, idx) => {
          let imagePath = path.join(process.env.FILE_PATH, item);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log(err);
              return res.status(500).send({ message: 'Unexpected error occurred' });
            }
          });
        });
      }
      await db.collection('posting').deleteOne({ posting_id: req.body._id });
      console.log('Posting has been deleted');
      res.status(200).send({ message: '게시글을 삭제했어요' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Unexpected error occurred' });
    }
  });

  //Update
  router.get('/update', sessionChk, (req, res) => {
    req.query._id = parseInt(req.query._id);
    db.collection('posting').findOne({ posting_id: req.query._id }, (err, data) => {
      if (data == null) {
        return res.status(302).redirect("/posting/list");
      }
      res.render('update.ejs', { posting: data, path: process.env.FILE_PATH });
    });
  });

  // Send file
  router.get('/loadimage', sessionChk, async function (req, res) {
    req.query._id = parseInt(req.query._id);
    try {
      let data = await db.collection('posting').findOne({ posting_id: req.query._id });

      if (data.image) {
        let image = [];
        let totalSize = 0;
        data.image.forEach((item, idx) => {
          let filePath = path.join(process.env.FILE_PATH, item);
          let stats = fs.statSync(filePath);
          totalSize += stats.size;
          image.push({ image: item, size: totalSize });
        });
        res.status(200).send(JSON.stringify(image));
      }
    } catch (err) {
      return res.status(500).send({ message: 'Unexpected error occurred' });
    }
  });

  //Update post
  router.put('/update-item', sessionChk, upload.array('upload', 3), async function (req, res) {
    let postingNum = parseInt(req.body._id);
    let uploadImg = req.files;
    let deletedImg = [];
    let savedImg = [];
    let dbFileName = [];

    try {
      let isExistId = await db.collection('posting').findOne({ posting_id: postingNum });
      if (!isExistId) {
        return res.status(400).send({ message: 'Bad Request' });
      }

      if (req.body.delete) {
        deletedImg = JSON.parse(req.body.delete);
        await deletedImg.forEach((item, idx) => {
          let imagePath = path.join(process.env.FILE_PATH, item.image);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log(err);
              return res.status(500).send({ message: 'Unexpected error occurred' });
            }
          });
        });
      }

      if (req.body.image) {
        if (req.body.image.length > 0) {
          savedImg = JSON.parse(req.body.image);
          await savedImg.forEach((item, idx) => {
            dbFileName.push(item.image);
          });

          if (uploadImg.length > 0) {
            await uploadImg.forEach((item, idx) => {
              dbFileName.push(item.filename);
            });
          }
        }
      } else {
        if (uploadImg.length > 0) {
          await uploadImg.forEach((item, idx) => {
            dbFileName.push(item.filename);
          });
        } else {
          dbFileName = null;
        }
      }

      await db
        .collection('posting')
        .updateOne(
          { posting_id: postingNum },
          { $set: { title: req.body.title, content: req.body.content, image: dbFileName } }
        );
      console.log('Updating has been completed');
      res.status(200).send({ message: '게시물을 수정했어요' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: 'Unexpected error occurred' });
    }
  });

  //Searching
  router.get('/list/search', async function (req, res) {
    let keywordType = req.query.type;
    let keyword = req.query.keyword;

    let search = [
      {
        $search: {
          index: 'nodeSearch',
          text: {
            query: keyword,
            path: `${keywordType}`,
          },
        },
      },
    ];

    try {
      db = null;
      let data = await db.collection('posting').aggregate(search).toArray();
      if (data.length == 0) {
        res.render('list.ejs', { posting: data });
      } else {
        res.render('list.ejs', { posting: data });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Unexpected error occurred" });
    }
  });
  return router;
};
