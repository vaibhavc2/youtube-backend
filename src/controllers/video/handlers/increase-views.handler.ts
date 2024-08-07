import { db } from "@/database/models";
import ApiError from "@/utils/api-error.util";
import { SuccessResponse } from "@/utils/api-response.util.js";
import { Request, Response } from "express";

export const increaseViews = async (req: Request, res: Response) => {
  // get videoId from req.params
  const videoId = req.params.videoId;

  // get video from database
  const video = await db.Video.findOne({ _id: videoId });

  // check if video exists
  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  // increase views
  video.views += 1;

  // save video
  const result = await video.save({ validateBeforeSave: false });

  // check if video was saved successfully
  if (!result) {
    throw new ApiError(500, "Unable to increase video views!");
  }

  // send response
  return res.status(200).json(
    new SuccessResponse("Video views increased successfully!", {
      video,
    })
  );
};
