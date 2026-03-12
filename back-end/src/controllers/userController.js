import User from "../models/User.js";
export const authMe = async(req,res) => {
   try {
     const user = req.user;
    return res.status(200).json({
        message: "Success",
        user
    });
   } catch (error) {
    console.error('Auth Me error:', error);
    return res.status(500).json(
        {
         message: 'Internal Server Error'
        }
    );
   }
};

export const searchUserByUsername = async(req,res) => {
    try {
        const { username } = req.query;
        if(!username || username.trim() === '') {
            return res.status(400).json({
                message: "Username query parameter is required"
            });
        }

        const user = await User.findOne({username}).select("_id displayName username avatarUrl");
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Search User error:', error);
        return res.status(500).json(
            {
             message: 'Internal Server Error'
            }
        );
    }
}