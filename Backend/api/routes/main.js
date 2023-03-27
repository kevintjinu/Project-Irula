const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Word = require("./models/word");
const User = require("./models/user");

const router = express.Router();

const hashPassword = (password) => {
  bcrypt.genSalt(10, (saltError, salt) => {
    if (saltError) {
      throw saltError;
    } else {
      bcrypt.hash(password, salt, function (hashError, hash) {
        if (hashError) {
          throw hashError;
        } else {
          return hash;
        }
      });
    }
  });
};

router.get("/", (req, res, next) => {
  Word.find()
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/user/:userId", (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/search/:wordName", (req, res, next) => {
  const searchTerm = req.params.wordName;

  Word.find({
    $or: [
      {
        enWord: {
          $regex: searchTerm,
          $options: "xi",
        },
      },
      {
        taWord: {
          $regex: searchTerm,
          $options: "xi",
        },
      },
    ],
  })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/teapot", (req, res, next) => {
  res.status(418).json({
    message: "You tried brewing coffee in a teapot. Try some other route.",
  });
});

router.post("/newWord", (req, res, next) => {
  const word = new Word({
    _id: new mongoose.Types.ObjectId(),
    lexicalUnit: req.body.lexicalUnit,
    audioPath: req.body.audioPath,
    picturePath: req.body.picturePath,
    grammaticalInfo: req.body.grammaticalInfo,
    enWord: req.body.enWord,
    irulaWord: req.body.irulaWord,
    taWord: req.body.taWord,
    enMeaning: req.body.enMeaning,
    taMeaning: req.body.taMeaning,
  });

  word
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "object created successfully.",
        createdObj: word,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/newUser", (req, res, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    password: hashPassword(req.body.password),
    email: req.body.email,
    darkMode: false,
    adminRole: false,
  });

  user
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Object created.",
        obj: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/update/:wordName", (req, res, next) => {
  const wordName = req.params.wordName;

  Word.updateOne(
    {
      enWord: wordName,
    },
    {
      $set: req.body,
    }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:wordId", (req, res, next) => {
  const id = req.params.wordId;

  Word.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Object removed.",
        obj: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
