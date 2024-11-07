const jwt = require('jsonwebtoken')



const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader)

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			success: false,
			message: "Authorization token missing or incorrect",
		});
  }

  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message:"truy cập bị từ chối huhu"
    })
  }


  //decode this token
  try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
		console.log(decodedToken);

		//lưu thông tin vào
		//Giả sử decodedToken chứa thông tin người dùng
    req.userInfo = decodedToken;
    console.log(req.userInfo.role);
		next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Access denied. No token provided. Please login to continue",
	  });
  }


}

module.exports = authMiddleware
