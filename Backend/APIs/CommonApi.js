import exp from "express";
import { UserModel } from "../models/UserModel.js";
import { hash, compare } from "bcryptjs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/VerifyToken.js";
import rateLimit from "express-rate-limit";
const { sign, verify } = jwt;
export const commonApp = exp.Router();
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
config();

const isProduction = process.env.NODE_ENV === "production";
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 60 * 60 * 1000,
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

//Route for register
commonApp.post("/users", authLimiter, upload.single("profileImageUrl"), async (req, res) => {
  let cloudinaryResult;
  try {
    let allowedRoles = ["USER", "AUTHOR"];
    //get user from req
    const newUser = req.body;

    //check role
    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    //Upload image to cloudinary from memoryStorage
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // console.log("cloudinaryResult", cloudinaryResult);
    //add CDN link(secure_url) of image to newUserObj
    newUser.profileImageUrl = cloudinaryResult?.secure_url;

    //run validators manually
    //hash password and replace plain with hashed one
    newUser.password = await hash(newUser.password, 12);

    //create New user document
    const newUserDoc = new UserModel(newUser);

    //save document
    await newUserDoc.save();
    //send res
    res.status(201).json({ message: "User created" });
  } catch (err) {
    //delete image from cloudinary
    if (cloudinaryResult.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }
    return res.status(500).json({ message: "error occurred", error: err.message });
  }
});

//Route for Login(USER, AUTHOR and ADMIN)
commonApp.post("/login", authLimiter, async (req, res) => {
  //console.log(req.body)
  //get user cred obj
  const { email, password } = req.body;
  //find user by email
  const user = await UserModel.findOne({ email: email });
  //if use not found
  if (!user) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (!user.isUserActive) {
    return res.status(403).json({ message: "Account is inactive" });
  }
  //compare password
  const isMatched = await compare(password, user.password);
  //if passwords not matched
  if (!isMatched) {
    return res.status(400).json({ message: "Invalid password" });
  }
  //create jwt
  const signedToken = sign(
    {
      id: user._id,
      email: email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );

  //set token to res header as httpOnly cookie
  res.cookie("token", signedToken, authCookieOptions);
  //remove password from user document
  let userObj = user.toObject();
  delete userObj.password;

  //send res
  res.status(200).json({ message: "login success", payload: userObj });
});

//Route for Logout
commonApp.get("/logout", (req, res) => {
  //delete token from cookie storage
  res.clearCookie("token", authCookieOptions);
  //send res
  res.status(200).json({ message: "Logout success" });
});

//Page refresh
commonApp.get("/check-auth", async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(200).json({
      message: "not authenticated",
      authenticated: false,
      payload: null,
    });
  }

  try {
    const decodedToken = verify(token, process.env.SECRET_KEY);
    const user = await UserModel.findById(decodedToken.id);

    if (!user || !user.isUserActive) {
      res.clearCookie("token", authCookieOptions);
      return res.status(200).json({
        message: "not authenticated",
        authenticated: false,
        payload: null,
      });
    }

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "authenticated",
      authenticated: true,
      payload: userObj,
    });
  } catch (err) {
    res.clearCookie("token", authCookieOptions);
    return res.status(200).json({
      message: "not authenticated",
      authenticated: false,
      payload: null,
    });
  }
});

commonApp.put("/profile", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const { firstName, lastName, bio, website, profileImageUrl } = req.body;
  const updates = {};

  if (typeof firstName === "string") updates.firstName = firstName;
  if (typeof lastName === "string") updates.lastName = lastName;
  if (typeof bio === "string") updates.bio = bio;
  if (typeof website === "string") updates.website = website;
  if (typeof profileImageUrl === "string") updates.profileImageUrl = profileImageUrl;

  const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select("-password");

  return res.status(200).json({ message: "Profile updated", payload: updatedUser });
});

//Change password
commonApp.put("/password", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  //check current password and new password are same
  //get current password of user/admin/author
  //check the current password of req and user are not same
  // hash new password
  //replace current password of user with hashed new password
  //save
  //send res
});