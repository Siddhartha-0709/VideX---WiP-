import { Router } from "express";

import { createVideo, getAllVideos, increaseViewCount } from "../controller/video.controller.js";

const router = Router();

router.route('/getAll').get(getAllVideos);
router.route('/increaseView').get(increaseViewCount);
router.route('/create').post(createVideo);

export default router;