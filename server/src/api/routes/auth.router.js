import multer from "multer";
import { Router } from "express";
import { checkUser, generateToken, login, onBoardUser, register } from "../controllers/auth.controller.js";
import { getAllUsersAndGroupByLetter, updateAvatarUserById, updatePasswordUserById, updateUserById } from "../controllers/user.controller.js";

const router = Router();

const upload = multer({ dest: "uploads/avatars" });

router.post("/check-user", checkUser);
router.post("/register", register);
router.post("/login", login);
router.post("/onboard-user", onBoardUser);
router.post("/update-image-user", upload.single("file"), updateAvatarUserById);
router.put("/update-user", updateUserById);
router.put("/update-password-user", updatePasswordUserById);
router.get("/get-contacts", getAllUsersAndGroupByLetter);
router.get("/generate-token/:userId", generateToken);

export default router;