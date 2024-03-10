const express = require('express');
const { uploadCapstone, searchCapstones, getCapstoneDetails, searchCapstoneSuggests, updateCapstone, getCapstoneUpdate, deleteCapstone } = require('../controllers/capstoneController');

const router = express.Router();

router.post('/upload-capstone', uploadCapstone);
router.get('/search-capstone', searchCapstones);
router.get('/search-suggests', searchCapstoneSuggests);
router.get('/capstone-details/:capstoneId', getCapstoneDetails);
router.put('/update-capstone/:capstoneId', updateCapstone);
router.get('/get-update-capstone/:capstoneId', getCapstoneUpdate);

module.exports = router;