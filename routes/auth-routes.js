const express = require ('express')
const router = express.Router()
const User = require('../models/User')

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

router.get("/signup", (req, res, next) => {
    res.render("signup");
  });
  

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("signup", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    User.findOne({ "username": username })
    .then(user => {
    if (user !== null) {
        res.render("signup", {
            errorMessage: "The username already exists"
        });
        return;
        }

        const salt     = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = User({
        username,
        password: hashPass
        });

        newUser.save()
        .then(user => {
        res.redirect("/");
        })
        })
        .catch(error => {
        next(error)
    })
  });


router.get("/login", (req, res, next) => {
    res.render("login");
});


router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
      res.render("login", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }
  
    User.findOne({ "username": username })
    .then(user => {
        if (!user) {
          res.render("login", {
            errorMessage: "The username doesn't exist"
          });
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/main");
        } else {
          res.render("login", {
            errorMessage: "Incorrect password"
          });
        }
    })
    .catch(error => {
      next(error)
    })
  });

  router.get("/main", (req, res, next) => {
    res.render("main");
});

  module.exports = router;