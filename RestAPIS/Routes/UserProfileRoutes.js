const express = require('express');
const router  = express.Router();
const {AuthorizationTokenVerify} = require('../Setting/Oautho');
const UserProfile = require('../Controller/UserProfileController');
const User = require('../Modules/UserProfile');
const {upload} = require('../Config/MulterFile');

router.post('/DP-set', AuthorizationTokenVerify, upload.single('DPImgage'), UserProfile.UserDP);



module.exports = router;