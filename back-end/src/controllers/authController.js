import bcrypt from 'bcrypt'; 
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';
import crypto from 'crypto';


const ACCESS_TOKEN_TTL = '30m';    
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

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

    //create user
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName
    })

    return res.status(201).json(
        {
         message: 'User created successfully',
         data: newUser
        }
    );
  } catch (error) {
    console.error('Sign Up error:', error);
    return res.status(500).json(
        {
         message: 'Internal Server Error'
        }
    );
  }
}

export const signIn = async(req , res) => {
  try {
    const {username, password} = req.body;
    if(!username || !password) {
        return res.status(400).json(
            {
             message: 'Username and Password are required'
            }
        );
    }

    const user =  await User.findOne({username});
    if(!user) {
        return res.status(400).json(
            {
             message: 'Invalid username or password'
            }
        );
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if(!checkPassword) {
        return res.status(400).json(
            {
             message: 'Invalid username or password'
            }
        );
    }

    const accessToken = jwt.sign({userId: user._id},process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});

    const refreshToken = crypto.randomBytes(40).toString('hex');

    await Session.create({
        userId: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",// none nếu deploy backend và frontend khác domain, strict là cùng domain
        maxAge: REFRESH_TOKEN_TTL // 7 days
    });

    return res.status(200).json(
        {
         message: 'Sign In successful',
         accessToken
        });
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error'});
  }
}

export const signOut = async(req , res) => {
    try {
        const { refreshToken } = req.cookies;
        if(!refreshToken) {
            return res.status(400).json({message: 'Refresh Token is required'});
        }
        await Session.findOneAndDelete({refreshToken});
        res.clearCookie("refreshToken");
        return res.status(200).json({message: 'Sign Out successful'});
    } catch (error) {
        return res.status(500).json({message: 'Internal Server Error'});
    }
}