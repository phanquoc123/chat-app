import bcrypt from 'bcryptjs'; 
import User from '../models/User';

export const signUp = async(req , res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    if(!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json(
            {
             message: 'Username, Email, Password, First Name, and Last Name are required'
            }
        );
    }

    //check if user exists
    const userExists = await User.findOne({username});
    if(userExists) {
        return res.status(400).json(
            {
             message: 'Username already exists'
            }
        );
    }

    ///hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    
  }
}