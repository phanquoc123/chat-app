export const authMe = async(req,res) => {
    return res.status(200).json({
        message: "Success",
        user: req.user
    });
};