import { Request, Response } from "express";
import mongoose from "mongoose";
import { Subscription } from "../../../models/subscription.model.js";
import { User } from "../../../models/user.model.js";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

export const _removeSubscription = async (req: Request, res: Response) => {
  // get username of the channel subscribed to from params
  const { channelUserName } = req.params;

  // find the user: the channel subscribed to
  const user = await User.findOne({ channelUserName }, { _id: 1 });

  // check if the channel exists
  if (!user) {
    throw new ApiError(404, "Channel not found");
  }

  // get id of the channel subscribed to
  const channelId = new mongoose.Types.ObjectId(user._id);

  // get id of the user subscribing from the request
  const subscriberId = new mongoose.Types.ObjectId(req.user._id);

  // check if the user is subscribed to the channel or not
  const subscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  // if not subscribed, throw error
  if (!subscription) {
    throw new ApiError(400, "Already Not subscribed");
  }

  // remove subscription
  const removedSubscription = await Subscription.findByIdAndDelete(
    subscription._id
  );

  // confirm if the subscription was removed
  const confirmRemovedSubscription = await Subscription.findById(
    subscription._id
  );

  // if the subscription not removed or an error occurred
  if (!removedSubscription || confirmRemovedSubscription) {
    throw new ApiError(500, "Unexpected Error while removing subscription!");
  }

  // send response
  res
    .status(200)
    .json(new SuccessResponse("Subscription removed successfully"));
};
