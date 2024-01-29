import {
  getChannelStats,
  getChannelVideos,
} from "@/controllers/dashboard/dashboard.controller";
import { Router } from "express";

const router = Router();

router.route("/:userId/channel-stats").get(getChannelStats);

router.route("/videos").get(getChannelVideos);

export default router;
