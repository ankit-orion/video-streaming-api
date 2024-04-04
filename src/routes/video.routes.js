import {Router} from 'express'
import {
    publishAVideo
} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router(); // appling verify jwt to all the routes in this file
router.route("/publish")
    .post(
        verifyJWT,
        upload.fields([
            {
                name:"videoFile",
                maxCount:1,
            },
            {
                name:"thumbnail",
                maxCount:1,
            },
        ]),
        publishAVideo
    );
// router.route("/:videoId")
// .get(getAllVideoById)
// .delete(deleteVideo)
// .patch(upload.single("thumbnail"), updateVideo)
// router.route("/toggle/publish/:videoId").patch(togglePublishStatus)

export default router