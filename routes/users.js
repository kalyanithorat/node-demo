const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const checkToken=require('../middleware');


router.post('/register', userController.create);
//router.post('/authenticate', userController.authenticate);
router.post('/login',userController.login);
router.put('/updateUser',userController.update);
router.delete('/delete',userController.delete);
router.get('/getUser',userController.get);
router.get('/loggedInUser',checkToken,userController.loggedInUser);
module.exports = router;


