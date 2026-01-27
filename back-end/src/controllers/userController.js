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