const AdminModel = require('../models/adminModel');
const { comparePassword } = require('../helpers/password');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const CapstoneModel = require('../models/capstoneModel');


const loginAdmin = async(req, res) => {
    try {
        const {username, password} = req.body;

        const admin = await AdminModel.findOne({username});
        if(!admin){
            return res.status(404).json({
                error: 'No admin exist'
            })
        }


        const correctPassword = await comparePassword(password, admin.password);
        if(correctPassword){
            jwt.sign({
                id: admin._id,
                username: admin.username
            }, process.env.JWT_SECRET, {}, (error, token) => {
                if(error) throw error;
                res.cookie('token', token).json({
                    admin,
                    message: 'Login successfully!'
                })
            })
        }

        if(!correctPassword){
            return res.status(404).json({
                error: 'Password don\'t match'
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'Interval error'
        })
    }
}

const getAdminProfile = (req, res) => {

    const token = req.cookies.token;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, admin) => {
            if(err) throw err;
            res.json(admin)
        })
        
    } else{
        res.json(null)
    }
}


const getAllUsers = async(req, res) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ 
            error: 'Unauthorized - Missing token' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
        if(err) throw err;

        try {
            const users = await UserModel.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ 
                error: 'Internal server error' 
            });
        }
    });
}


const deleteUser = async(req, res) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({ 
                error: 'Unauthorized - Missing token' 
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
            if(err){
                return res.json({ 
                    error: 'Unauthorized - Invalid token' 
                });
            }

            const userId = req.params.userId;

            const deletedUser = await UserModel.deleteOne({
                _id: userId,
            });

            if(deletedUser.deletedCount === 0){
                return res.json({ 
                    error: 'User not found' 
                });
            }

            return res.json({
                message: 'User deleted successfully!',
            });
        });
    } catch (error) {
        console.error(error);
        return res.json({ 
            error: 'Internal Server Error' 
        });
    }
}


const getAllCapstones = async(req, res) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ 
            error: 'Unauthorized - Missing token' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
        if(err) throw err;

        try {
            const capstones = await CapstoneModel.find();
            res.json(capstones);
        } catch (error) {
            res.status(500).json({ 
                error: 'Internal Server Error'
            });
        }
    });

}

const deleteCapstone = async(req, res) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({ 
                error: 'Unauthorized - Missing token' 
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
            if(err){
                return res.json({ 
                    error: 'Unauthorized - Invalid token' 
                });
            }

            const capstoneId = req.params.capstoneId;

            const deletedCapstone = await CapstoneModel.deleteOne({
                _id: capstoneId,
            });

            if(deletedCapstone.deletedCount === 0){
                return res.json({ 
                    error: 'Capstone not found' 
                });
            }

            return res.json({
                message: 'Capstone deleted successfully!',
            });
        });
    } catch (error) {
        console.error(error);
        return res.json({ 
            error: 'Internal Server Error' 
        });
    }
}


const searchUserList = async(req, res) => {
    try {
        const searchUserQuery = req.query.q;
        const results = await UserModel.find({
            $or: [
                { name: { $regex: new RegExp(searchUserQuery, 'i') } },
                { email: { $regex: new RegExp(searchUserQuery, 'i') } },
            ],
            // $or: [
            //     { name: { $regex: ".*" + searchQuery + ".*", $options: 'i' } },
            //     { email: { $regex: ".*" + searchQuery + ".*", $options: 'i' } },
            // ],
        });
        return res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
          error: 'Internal Server Error' 
        });
    }
}


const searchCapstoneList = async(req, res) => {
    try {
        const searchCapstoneQuery = req.query.q;
        const results = await CapstoneModel.find({
            $or: [
                { title: { $regex: new RegExp(searchCapstoneQuery, 'i') } },
                { author: { $regex: new RegExp(searchCapstoneQuery, 'i') } },
            ],
        });
        return res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
          error: 'Internal Server Error' 
        });
    }
}


module.exports = {
    loginAdmin,
    getAdminProfile,
    getAllUsers,
    getAllCapstones,
    deleteUser,
    deleteCapstone,
    searchUserList,
    searchCapstoneList
}