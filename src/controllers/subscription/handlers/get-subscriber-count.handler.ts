import { db } from "@/database/models";
import { SuccessResponse } from "@/utils/api-response.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getSubscriberCount = async (req: Request, res: Response) => {
  // get userId
  const { userId } = req.params;

  // get total subs
  const subs = await db.Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(String(userId)),
      },
    },
    {
      $group: {
        _id: null,
        subscriberCount: {
          $sum: 1,
        },
      },
    },
  ]);

  const { subscriberCount } = subs[0];

  // send response
  res.send(200).json(
    new SuccessResponse("Total Subscribers fetched successfully!", {
      subscriptions: { subscriberCount },
    })
  );
};
