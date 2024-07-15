import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
   const userExist = await User.findOne({ email });
   if (userExist) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    username:username,
    email:email,
    password: hashedPassword,
    google:false,
    verified:true,
  });
  await newUser.save();
  newUser.password = "";

  return res
  .status(201)
  .json({ message: "User saved successfully", user: newUser });

  } catch(error) {
    if(error.code === 11000){
        return res.status(400).json({ message: "User already exists!!"});
    }
    return res
    .status(500)
    .json({ message: "Internal Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email: email });
    if (!userExists) {
      return res.status(404).json({ message: "Invalid Email" });
    }
    const validPassword = await bcrypt.compare(password, userExists.password);

    if(!validPassword) {
      return res.status(404).json({ message: "Invalid Password" });
    }
   
  const token = JWT.sign(
        { userId: userExists._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      userExists.password = "";

      return res
        .status(200)
        .json({
          user: userExists,
          token,
          expiresIn: Date.now() + 1000 * 60 * 60 * 24,
        });
    }catch(error){
      return res.status(500).json({message: "Internal Server Error", error: error.message});
    } 
  };


export const googleAuth = async (req, res) => {
  const credential = req.body.credential;
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.CLIENT_URL
  );

  let userData;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
   
    const payload = ticket.getPayload();
  

    if (
      payload.iss !== "https://accounts.google.com" ||
      payload.aud !== process.env.GOOGLE_CLIENT_ID
    ) {
      throw new Error("Invalid Google ID token");
    }

    userData = payload;
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error verifying google ID", error: err.message });
  }
  if (!userData) {
    return res.status(500).json({ message: "Something Went Wrong!!!" });
  }
  const { name, email } = userData;

  try {
    const user = await User.findOne({
      email: email,
      password: process.env.GOOGLE_USER_PASSWORD,
      google: true,
    });

    
    if (user) {
      const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      
      user.password = "";

      return res.json({
        user,
        token,
        expiresIn: Date.now() + 1000 * 60 * 60 * 24,
      });
    }
    
    const userExists = await User.findOne({email:email,
       google:false})
    
      if(userExists) {
        return res.status(500).json({message: "User already exists"})
      }    
      const newUser = new User({
      username: name,
      email: email,
      password: process.env.GOOGLE_USER_PASSWORD,
      google: true,
      verified: true,
    });

    await newUser.save();
    newUser.password = "";
    const token = JWT.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      message: "User saved successfully",
      token,
      user: newUser,
      expiresIn: Date.now() + 1000 * 60 * 60 * 24,
    });
  } catch (err) {
    if(err.code === 11000){
      return res.json(400).json({message:"User already exists"});
    }
    return res.status(500).json({ message: "Internal Server Error" , error:err.message});
  }
};
