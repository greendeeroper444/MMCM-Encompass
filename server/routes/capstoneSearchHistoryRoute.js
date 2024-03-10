const express = require('express');
const { addSearchHistoryAdmin, addSearchHistoryUser, getSearchHistoryAdmin, getSearchHistoryUser, deleteSearchHistoryItemAdmin, deleteSearchHistoryItemUser } = require('../controllers/capstoneSearchHistoryController');
const router = express.Router();

router.post('/searchHistoryAdmin/add', addSearchHistoryAdmin);
router.post('/searchHistoryUser/add', addSearchHistoryUser);
router.get('/searchHistoryAdmin', getSearchHistoryAdmin);
router.get('/searchHistoryUser', getSearchHistoryUser);
router.delete('/delete-searchHistoryAdmin/:adminId/:searchHistoryId', deleteSearchHistoryItemAdmin);
router.delete('/delete-searchHistoryUser/:userId/:searchHistoryId', deleteSearchHistoryItemUser);

module.exports = router;