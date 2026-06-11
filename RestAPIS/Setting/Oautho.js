const jwt = require('jsonwebtoken');

const genarateAuthoToken = (Userid) => {
    try {
        const seceratjwt = process.env.JsonWebToken;
        if (!seceratjwt) {
            throw new Error('Json web token error.Missing.env!');
        }
        return jwt.sign(
            {id: Userid},
            seceratjwt,
            {expiresIn: '1d'}
        );
    } catch (error) {
        console.log('Json Web token error', error.message);
        throw error;
    }
}; 


const AuthorizationTokenVerify = (req, res, next)=>{
    try {
        const authoHeader = req.headers.authorization;
        if (!authoHeader || !authoHeader.startsWith('Bearer ')) {
            return res.status(401).json({status: 'Failed', message: 'Token missing or invalid'});
        }
        const token     = authoHeader.split(' ')[1];
        const decode    = jwt.verify(token, process.env.JsonWebToken);
        req.user        = decode;
        return next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({status: 'Failed', message: 'Unauthorized: Verification token has expired'});
        }
        return res.status(401).json({status: 'Failed', message: error.message});
    }
}; 


module.exports =  {AuthorizationTokenVerify, genarateAuthoToken};



