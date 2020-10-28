const express = require("express");
const db = require("./userDb");

const router = express.Router();

router.post("/", [validateUser], (req, res) => {
  db.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

router.post("/:id/posts", [validateUserId, validatePost], (req, res) => {
  db.insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

router.get("/", (req, res) => {
  db.get()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({
        error: "The users information could not be retrieved.",
      });
    });
});

router.get("/:id", [validateUserId], (req, res) => {
  const { id } = req.parmas;
  db.getById(id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({
        error: "The users information could not be retrieved.",
      });
    });
});

router.get("/:id/posts", [validateUserId], (req, res) => {
  const { id } = req.params;
  db.getUserPosts(id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({
        error: "The comments information could not be retrieved.",
      });
    });
});

router.delete("/:id", [validateUserId], (req, res) => {
  const { id } = req.params;
  db.getById(id).then((removed) => {
    db.remove(id)
      .then((user) => {
        res.status(200).json(removed);
      })
      .catch((error) => {
        res.status(500).json({
          error: "The user could not be removed",
        });
      });
  });
});

router.put("/:id", [validateUserId, validatePost], (req, res) => {
  const changes = req.body;
  const { id } = req.params;
  db.update(id, changes)
    .then((post) => {
      db.findById(id).then((post) => {
        res.status(200).json(post);
      });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.parmas;
  db.findById(id).then((data) => {
    if (data) {
      req.user = data;
      next();
    } else {
      res.status(404).json({
        message: "invalid user id",
      });
    }
  });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      message: "missing user data",
    });
  } else {
    if (!req.body.name) {
      res.status(400).json({
        message: "missing required name field",
      });
    } else {
      next();
    }
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      message: "missing user data",
    });
  } else {
    if (!req.body.text) {
      res.status(400).json({
        message: "missing required text field",
      });
    } else {
      next();
    }
  }
}

module.exports = router;
