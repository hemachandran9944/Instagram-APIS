const UserProfile = require('../Modules/UserProfile');
const {uploadImages} = require('../Config/MulterFile');


// Instagram DB set
exports. UserDP = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({status: 'Failed', message: 'Image not found'});
        }

        const targetUserId = req.user.id || req.user.UserID || req.user.Userid;
        if (!targetUserId) {
            return res.status(401).json({status: 'failed', message: 'User id missing token paylod'});
        }
        const { Bio } = req.body;

        const imageURL = await uploadImages(req.file.path);
        const PostUrl = imageURL.secure_url;
        
        let userDP = await UserProfile.findOne({where: {UserID: targetUserId}});
        console.log('req.user.id:', targetUserId);

        if (userDP) {
            await userDP.update({DPImage: PostUrl, Bio: Bio || userDP.Bio});
        } else {
            userDP = await UserProfile.create({UserID: targetUserId, DPImage: PostUrl, Bio: Bio || null}); 
        }
        return res.status(200).json({status: 'success', message: 'DP Update successfulley', data: userDP});
    } catch (error) {
        console.log('error', error.message);
        return res.status(500).json({status: 'failed', message: error.message});
    }
};