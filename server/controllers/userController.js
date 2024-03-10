const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// const getProfile = (req, res) => {

//     const token = req.cookies.token;

//     if(token){
//         jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
//             if(err) throw err;
//             res.json(user)
//         })
        
//     } else{
//         res.json(null)
//     }
// };

// const getProfile = (req, res) => {
//     const token = req.cookies.token;

//     if (token) {
//         jwt.verify(token, process.env.JWT_SECRET, {}, (err, decodedToken) => {
//             if (err) {
//                 res.status(401).json({ error: 'Unauthorized' });
//             } else {
//                 const userId = decodedToken.id;
//                 // Fetch user profile from the database
//                 UserModel.findById(userId)
//                     .then(user => {
//                         if (!user) {
//                             res.status(404).json({ error: 'User not found' });
//                         } else {
//                             // If user found, return the user profile
//                             res.json(user);
//                         }
//                     })
//                     .catch(error => {
//                         console.error('Error fetching user profile:', error);
//                         res.status(500).json({ error: 'Internal server error' });
//                     });
//             }
//         });
//     } else {
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// };


const getProfile = (req, res) => {
    const token = req.cookies.token;

    if(req.isAuthenticated()){
        const { id, name, email, image } = req.user;
        const tokenPayload = { id, name, email, image };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
        return res.json({ token, ...tokenPayload });
    } else if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, decodedToken) => {
            if(err){
                console.error(err);
                return res.status(401).json({ 
                    error: 'Unauthorized - Invalid token' 
                });
            }
            return res.json(decodedToken);
        });
    } else{
        return res.status(401).json({ 
            error: 'Unauthorized - Missing token' 
        });
    }
};

// const getProfile = (req, res) => {
//     try {
//         const token = req.cookies.token; 
//         if(!token){
//             return res.status(401).json({ error: 'Unauthorized - Missing token' });
//         }

//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         return res.status(200).json(decodedToken);
//     } catch (error) {
//         console.error('Error fetching user profile:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if(err){
          console.error(err);
          res.status(500).json({ 
            message: 'Internal Server Error' 
        });
        } else{
          res.clearCookie('token').json({ 
            message: 'Logout successfully!' 
        });
        }
    });
};



module.exports = {
    getProfile,
    logoutUser
}