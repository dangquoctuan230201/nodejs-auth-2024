const User = require("../Models/User")

const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')



//register
const registerUser = async (req, res) => {
  try {
    //lấy thông tin từ body
    const { username, email, password, role } = req.body;

    const checkUser = await User.findOne({
      $or: [{username}, {email}]
    })

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message:"User or email đã tồn tại, vui lòng nhập user or email khác"
      })
    }

    //hash user password
    const salt =await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newCreateUser =  new User({
      username,
      email,
      password: hashPassword,
      role: role || "user"
    });

    await newCreateUser.save();

    if (newCreateUser) {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data:newCreateUser
      })
    } else {
      res.status(400).json({
        success: false,
        message: "User created error"
      })
    }



  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:"Something went wrong"
    })
  }
}

//login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });


    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }
    //giải mã password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Password mismatch"

      })
    }

    //create user token
    const payload = {
      userId: user._id,
      username: user.username,
      role: user.role,
    };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      {
		    expiresIn: process.env.JWT_EXPIRATION_TIME,
      }
    );

    res.status(200).json({
      success: true,
      message: "Login is successfully",
      accessToken
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:"Something went wrong"
    })
  }
}

const changePassword = async (req, res) => {
  try {
    const userID = req.userInfo.userId

    //lấy mật khẩu cũ và mới trên body
    const { oldPassword, newPassword } = req.body

    //tìm người dùng đã đăng nhập hiện tại
    const user = await User.findById(userID);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }

    //check mật khẩu cũ
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Password mismatch",
      });
    }

    //hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update user password
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Change Password saved successfully"
    })


  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  changePassword
}
