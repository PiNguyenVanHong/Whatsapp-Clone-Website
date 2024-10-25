import multer from "multer";
import { Router } from "express";
import { upload as uploadHelper } from "../helpers/multer.helper.js";
import { addMessage, getMessageBySenderIdAndReceiverId, addImageMessage, addAudioMessage, getContactswithMessageByUserId, getMessageBySenderIdAndReceiverIdQuery, uploadFileMessage } from "../controllers/message.controller.js";

const router = Router();

const upload = multer({ dest: "uploads/recordings" });
const uploadImage = multer({ dest: "uploads/images" });

router.post("/add-message", addMessage);
router.post("/uploads", uploadHelper.single("file"), uploadFileMessage);
router.post("/add-image-message", uploadImage.single("file"), addImageMessage);
router.post("/add-audio-message", upload.single("audio"), addAudioMessage);
router.get("/get-messages/:from/:to", getMessageBySenderIdAndReceiverId);
router.get("/get-messages-query/:from/:to", getMessageBySenderIdAndReceiverIdQuery);
router.get("/get-initial-contacts/:from", getContactswithMessageByUserId);

export default router;