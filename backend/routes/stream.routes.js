import { Router } from "express";
import { addRtmpHost, createStream, getAllStreams, getStreamByKey } from "../controller/stream.controller.js";

const router = Router();


router.route('/getAllStreams').get(getAllStreams);
router.route('/createStream').post(createStream);
router.route('/getStreamByKey').get(getStreamByKey);
router.route('/addRtmpHost').post(addRtmpHost);

export default router;