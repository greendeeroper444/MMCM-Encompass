const express = require('express');
const { loginAdmin, getAdminProfile, getAllUsers, getAllCapstones, deleteUser, deleteCapstone, searchUserList, searchCapstoneList } = require('../controllers/adminController');
const router = express.Router();

router.post('/login', loginAdmin);
router.get('/profile', getAdminProfile);
router.get('/get-allUsers', getAllUsers)
router.get('/get-allCapstones', getAllCapstones);
router.delete('/delete-user/:userId', deleteUser);
router.delete('/delete-capstone/:capstoneId', deleteCapstone);
router.get('/search-user-list', searchUserList)
router.get('/search-capstone-list', searchCapstoneList)


module.exports = router;