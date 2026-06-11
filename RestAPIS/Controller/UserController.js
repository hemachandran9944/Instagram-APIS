const User = require('../Modules/User');
const {InstagramRegister, ForgetPasswordOtp} = require('../Setting/OTPSender');
const bcryptHash = require('bcrypt');
const {genarateAuthoToken} = require('../Setting/Oautho');





// Resgister 

exports. UserRegister = async (req, res) => {
    try {
        const {Name, Password, Age, Gmail} = req.body;
        const UserEmail = await User.findOne({where: {Gmail: Gmail}});

        if (UserEmail) {
            return res.status(400).json({status: 'Failed', message: 'User already register!'});
        }

        const OtpGanerate = Math.floor(100000 + Math.random() * 900000).toString();
        const OtpexpiredTimeset = new Date(Date.now() + 10 * 60 * 1000);
        await InstagramRegister(Gmail, Name, OtpGanerate);

        const RegisterNewUser = await User.create({
            Name, Gmail, Password, Age, Otp:OtpGanerate, OTPExpiration: OtpexpiredTimeset
        });
    
        return res.status(201).json({
            status: 'Success', 
            message: 'OTP send your email!. Please check and verify',
            Data: {
                Name: RegisterNewUser.Name,
                Email: RegisterNewUser.Email,
                Otp: RegisterNewUser.Otp,
                Age: RegisterNewUser.Age,
                Password:RegisterNewUser.Password
            },
        })
        console.log(OtpexpiredTimeset);
    } catch (error) {
        return res.status(500).json({status: 'Failed', error: error.message});
    }
};




// Otp Verify

exports.OtpVerify = async (req, res) => {
    try {
        const {Gmail, Otp} = req.body;
        const user = await User.findOne({where: {Gmail: Gmail}});
        
        if (!user) {
            return res.status(404).json({status: 'Faliled', message: 'User not found'});
        }

        if (user.isVerified) {
            return res.status(400).json({status: 'Falied', message: 'already verifaid'});
        }

        if (user.Otp !== Otp) {
            return res.status(400).json({status: 'falied', message: 'Worng Otp'});
        }

        if (new Date () >user.OTPExpiration) {
            return res.status(400).josn({status: 'failed', message: 'Otp Expired'});
        }

        const Verification = await user.update({
            isVerified: true,
            Otp: null,
            OTPExpiration: null
        });

        return res.status(201).json({status: 'success', message: 'Opt verifaid. Now you can login'});
    } catch (error) {
        return res.status(500).json({status: 'failed', message: error.message});
    }
};


// Login

exports.UserLogin = async (req, res) => {
    try {
        const {Gmail, Password}=req.body;
        const UserLogin = await User.findOne({where: {Gmail: Gmail}});

        if (!UserLogin) {
            return res.status(404).json({status: 'Failed', message: 'User not found'});
        }

        if (!UserLogin.isVerified) {
            return res.status(401).json({status: 'Failed', message: 'Please verify OTP frist'});
        }
        const isMatchPassword = await bcryptHash.compare(Password, UserLogin.Password);

        if (!isMatchPassword) {
            return res.status(401).json({status: 'failed', message: 'worng Password'});
        }
        const Oauth = genarateAuthoToken(UserLogin.id || UserLogin.dataValues.id || UserLogin.Userid );

        return res.status(200).json({status: 'success', message: 'Login successful!', authotoken: Oauth});
    } catch (error) {
        return res.status(500).json({status: 'failed', message: error.message});
    }
};



// GetALLUses

exports.GetALLUsers = async (req, res) => {
    try {
        const users = await User.findAll({attributes:{exclude:['Password', 'isVerified', 'OTPExpiration', 'Otp']}, order: [['id', 'DESC']],});
        return res.status(200).json({status: 'Success', message: 'Get user profile successfulley', data: users, count:users.length});
    } catch (error) {
        return res. status(500).json({status: 'Failed', message: error.message});
    }
};


// GetALLUsers

exports.GetSingleUsers = async (req, res) => {
    try {
        const users = await User.findOne({where: {id: req.params.id}, attributes: {exclude:['Password', 'isVerified', 'OTPExpiration', 'Otp']}});
        if (!users) {
            return res.status(404).json({status: 'Failed', message: 'User not found'});
        }
        return res.status(200).json({status: 'Success', message: 'get user profile successfulley!', date: users});
    } catch (error) {
        return res.status(500).json({status: 'Failed', message: error.message});
    }
};

 //UpdateUserDetailes
exports.UpdateUser = async (req, res) => {
    try {
        const {Name, Age, Gmail}=req.body; 
        const Updateuser = await User.findOne({where: {id: req.params.id}});
        if (!Updateuser) {
            return res.status(404).json({status: 'Failed', message: 'User not found'});
        } 

        await Updateuser.update({
            Name: Name || Updateuser.Name,
            Age: Age || Updateuser.Age,
            Gmail: Gmail || Updateuser.Gmail
        }); 

        
        return res.status(200).json({
            status: 'Success', 
            message: 'Update user date successfulley!', 
            data: {
                Name:Updateuser.Name,
                Gmail:Updateuser.Gmail,
                Age:Updateuser.Age
            },
        }); 

    } catch (error) {
        return res.status(500).json({status: 'failed', message: error.message});
    }
};



// DeleteSingleusers

exports.DeleteSingleusers = async (req, res) => {
    try {
        const userDelete = await User.findOne({where: {id: req.params.id}});
        if (!userDelete) {
            return res.status(404).json({status: 'success', message: 'user not found!'});
        }
        await userDelete.destroy();
        return res.status(200).json({status: 'success', message: 'User delete sucessfulley!'});
    } catch (error) {
        return res.status(500).json({status: 'failed', message: error.message});
    }
};


// DeleteAllUser

exports.DeleteAllUsers = async (req, res) => {
    try {
        const deletedRowsCount = await User.destroy({ where: {}});
        return res.status(200).json({status:'success', message: 'All user delete successfulley!', deletedCount: deletedRowsCount});
    } catch (error) {
        return res.status(500).json({status: 'Failed', message: error.message});   
    }
};




// LogOut 

exports.LogOut = async (req, res) => {
    try {
        return res.status(200).json({status: 'success', message: 'Logout successfulley!'});
    } catch (error) {
        return res.status(500).json({status: 'failed', message: error.message});
    }
};



// Forget Passowrd Otp

exports.ForgetpassowrodOtpEmailMSg = async (req, res) => {
    try {
        const {Gmail} = req.body;
        const userGmail = await User.findOne({where: {Gmail}}); 
        if (!userGmail) {
            return res.status(404).json({status: 'Failed', message: 'User not'});
        }
        const OtpGenerate = Math.floor(100000 + Math.random() * 900000).toString();
        const OtpExpiedTimeOut = new Date (Date.now() + 10 * 60 * 1000);

        const EmailSender = await ForgetPasswordOtp(Gmail, userGmail.Name, OtpGenerate);

        const savedUser = await userGmail.update({
            Otp: OtpGenerate,
            OTPExpiration: OtpExpiedTimeOut 
        });

        return res.status(200).json({
            status: 'success',
            message: 'OTP sent to your email! Please check and verify.!',
            data: {
                Gmail: savedUser.Gmail,
                Name: savedUser.Name,
                Otp: savedUser.Otp,
                OTPExpiration: savedUser.OTPExpiration
            }
        });
   
    } catch (error) {
        return res.status(500).json({status: 'Failed', message: error.message});
    }
};



// Reset Password Otp

exports.ResetPassowrd = async (req, res) => {
    try {
        const {Gmail, Otp, NewPassword, ConfirmPassword} = req.body;
        const UserPassowrdUpdate = await User.findOne({where: {Gmail}});

        if (!UserPassowrdUpdate) {
            return res.status(404).json({status: 'Failed', message: 'user not found'});
        }

        if (!UserPassowrdUpdate.isVerified) {
            return res.status(400).json({status: 'Failed', message: 'Already verified'});
        }

        if (UserPassowrdUpdate.Otp !== Otp) {
            return res.status(400).json({status: 'Failed', message: 'Invalid OTP!'});
        }

        if (NewPassword !== ConfirmPassword) {
            return res.status(400).json({status: 'Failed', message: 'Passwords do not match!'});
        }

        if (new Date () >UserPassowrdUpdate.OTPExpiration) {
            return res.status(400).json({status: 'failed', message: 'Otp Expired'});
        }

        const NewPassowrdWitHash = await bcryptHash.hash(NewPassword, 12);
        await UserPassowrdUpdate.update({
            Password: NewPassowrdWitHash,
            Otp: null,
            isVerified: true,
            OTPExpiration: null
        });

        return res.status(200).json({
            status: 'Success',
            message: 'User passowrd update successfulley!',
        });
    } catch (error) {
        return res.status(500).json({status: 'Failed', message: error.message});
    }
};