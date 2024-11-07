const express = require("express");
const authMiddleware = require("../Middlewares/authMiddleware");
const adminMiddleware = require("../Middlewares/adminMiddleware");
const uploadMiddleware = require("../Middlewares/uploadMiddleware");
const {
	uploadImageController,
  fetchImageController,
  deleteImageController
} = require("../Controllers/imageContrller");

const router = express.Router();

//upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single('image'),
  uploadImageController);

//to get all the image
router.get('/', fetchImageController)

//delete image by id
router.delete('/delete/:id',authMiddleware,adminMiddleware, deleteImageController)

module.exports =router
