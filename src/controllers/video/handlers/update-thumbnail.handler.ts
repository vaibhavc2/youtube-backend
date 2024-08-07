import { db } from "@/database/models";
import { SuccessResponse } from "@/utils/api-response.util.js";
import { Request, Response } from "express";

export const updateThumbnail = async (req: Request, res: Response) => {
  // get thumbnail from request body
  const { imageUrl: thumbnail } = req.body as { imageUrl: string };

  // get videoId from request params
  const videoId = req.params.videoId;

  // save thumbnail url to database
  const video = await db.Video.findOneAndUpdate(
    {
      _id: videoId,
      owner: req.user?._id,
    },
    {
      $set: {
        thumbnail,
      },
    },
    { new: true }
  );

  // send response
  return res.status(200).json(
    new SuccessResponse("Thumbnail uploaded successfully!", {
      video,
    })
  );
};
