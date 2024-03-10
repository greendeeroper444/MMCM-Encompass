const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
const UserModel = require("./models/userModel");
const jwt = require('jsonwebtoken')

const CLIENT_ID = ""
const CLIENT_SECRET = ""

passport.use(new OAuth2Strategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
    scope: ["profile", "email"],
},
    async(accessToken, refreshToken, profile, done) => {
        try {
            let user =  await UserModel.findOne({ googleId: profile.id });
            
            if(!user){
                user = new UserModel({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value
                });

                await user.save();
            }

            return done(null, user)
        } catch (error) {
            return done(error, null)
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = {
    googleAuth: passport.authenticate("google", { scope: ["profile", "email"] }),

    googleCallback: passport.authenticate("google", {
        successRedirect: "http://localhost:5173/home",
        failureRedirect: "http://localhost:5173/"
    }),

    // setTokenCookie: (req, res) => {
    //     try {
    //         const tokenPayload = {
    //             id: req.user._id,
    //             name: req.user.name,
    //             email: req.user.email
    //         };
    //         const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
    //         res.cookie('token', token, { httpOnly: true }).redirect('/home');
    //     } catch (error) {
    //         console.error('Error setting token in cookie:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // }
    

    // setTokenCookie: (req, res) => {
    //     try {
    //         const token = jwt.sign(req.user, process.env.JWT_SECRET);
    //         res.cookie('token', token, { httpOnly: true });
    //         res.redirect('/home');
    //     } catch (error) {
    //         console.error('Error setting token in cookie:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // }
};