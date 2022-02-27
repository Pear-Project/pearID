const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.authenticate('discord'));

router.get('/redirect',
    passport.authenticate('discord', {
        successRedirect: '/dashboard',
        failureRedirect: '/'
    })
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;