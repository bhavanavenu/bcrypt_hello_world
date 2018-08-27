const express = require("express");
const router = express.Router();

router.use( (req, res, next) => {
    if ( req.session.currentUser ) {
        next()
    } else {
        res.render("login", {
            errorMessage: "Login before going to private"
        })
    }
} )

router.get("/private", (req, res, next) => {
    res.render("private");
});

module.exports = router;