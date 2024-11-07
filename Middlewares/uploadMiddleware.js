const multer = require('multer');
const path = require('path');

//set multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");//đặt thư mục
    
  },
  filename: function (req, file, cb) {
    cb(null,file.filename+ "-" + Date.now() + path.extname(file.originalname) )
  }
})

//file filter Function
const chechFileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null,true) //chấP nhận file nếu file đó là image
  } else {
    cb(new Error("Not an image! Please upload only images"));
  }
}

//multer middleware
module.exports = multer({
  storage: storage,
  fileFilter: chechFileFilter,
  limits: {
    fileSize: 5*1024*1024 // 5MB max
  }
})
