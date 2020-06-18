import { Router } from "express";
import { PublicCommentApiController } from "../controllers/PublicCommentApiController";
import { PublicPageApiController } from "../controllers/PublicPageApiController";

const router = Router();
router.post('/comment', PublicCommentApiController.post);
router.get('/page/:id/comments', PublicPageApiController.getComments);

export default router;