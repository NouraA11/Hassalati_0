
import express from "express";

const router = express.Router();

// controllers
const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  uploadImg,
  editFinInfo,
  requireSignin,
  updatePassword,
} = require("../controllers/auth");

router.get("/", (req, res) => {
  return res.json({
    data: "hello world from kaloraat auth API",
  });
});
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/upload-image", requireSignin, uploadImg);
router.post("/edit-fin-info", requireSignin, editFinInfo);
router.post("/update-password", requireSignin, updatePassword);

export default router;
