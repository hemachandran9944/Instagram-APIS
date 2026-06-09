const express = require('express');
const router  = express.Router();
const {AuthorizationTokenVerify} = require('../Setting/Oautho');
const UserController = require('../Controller/UserController');

router.post('/resgister', UserController.UserRegister);
router.post('/Otpverify', UserController.OtpVerify);
router.post('/userlogin', UserController.UserLogin);
router.post('/logout', UserController.LogOut);

router.get('/getallusers', UserController.GetALLUsers);
router.get('/getsignleUsers/:id', AuthorizationTokenVerify, UserController.GetSingleUsers);

router.put('/updateUser/:id', AuthorizationTokenVerify, UserController.UpdateUser);

router.delete('/deletesignleUsers/:id', AuthorizationTokenVerify, UserController.DeleteSingleusers);
router.delete('/deleteallusers', UserController.DeleteAllUsers);





module.exports = router;