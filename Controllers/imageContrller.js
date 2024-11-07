const Image = require('../Models/Image');
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary")



const uploadImageController = async (req, res) => {
  try {

    //check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:"File is required. Please upload an immage"
      })
    }

    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //store the image url and public id along with the upload user id database
    const newUploadedImage = new Image({
      url,
      publicId,
      uploadedBy:req.userInfo.userId
    })

    await newUploadedImage.save();

    //delete the file from local storage
    fs.unlinkSync(req.file.path);


    res.status(200).json({
      success: true,
      message: "Uploaded image successfully",
      image: newUploadedImage
    })

  } catch (error) {
    console.log(e);
    res.status(500).json({
      success: false,
      message:"Something went wrong"
    });
  }
}

const fetchImageController = async(req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages/limit)

    const sortObj = {}
    sortObj[sortBy] = sortOrder
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit)

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images
      })
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message:"Something went wrong! Please try "
    })
  }
}

const deleteImageController = async (req, res) => {
  try {
    const getCurrentIdImage = req.params.id;
    const userId = req.userInfo.userId

    const image = await Image.findById(getCurrentIdImage)

    if (!image) {
      res.status(404).json({
        success: false,
        message: "Image not found",
      })
    }

    //kiểm tra xem hình ảnh này có được tải lên bởi người dùng hiện tại đang cố xóa hình ảnh này không
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
			success: false,
			message:
				"You are not authorized to delete this image because you haven't uploaded it",
		});
    }
    //delete image  ở cloudinary(xoá ở đây r mới xoá ở database)
    await cloudinary.uploader.destroy(image.publicId);

    //delete in database mongoDB
    await Image.findByIdAndDelete(getCurrentIdImage);

    res.status(200).json({
      success: true,
      message:"Message deleted successfully"
    })


  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}

module.exports = {
	uploadImageController,
	fetchImageController,
	deleteImageController,
};
