import { Tweet } from "@/models/tweet.model";
import { User } from "@/models/user.model";
import ApiError from "@/utils/api/error/api-error.util";
import { SuccessResponse } from "@/utils/api/res/api-response.util";
import { Request, Response } from "express";

export const _getUserTweets = async (req: Request, res: Response) => {
  // get userId, page, limit, sortBy, sortType, query from req.query
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = -1,
    userId,
  } = req.query;

  // Define the options for pagination and sorting
  const options = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sort: {
      [sortBy as string]: sortType === "desc" ? -1 : 1,
    },
  };

  // Define the match object for the MongoDB query. This will be used to filter tweets.
  const match = {
    content: { $regex: (query as string) || "", $options: "i" },
  };

  // If a userId is provided in the query parameters, add it to the match object.
  // This will filter tweets to only return those owned by the specified user.
  if (userId) {
    const user = await User.findById(userId);
    if (user) (match as any)["owner"] = user._id;
    else throw new ApiError(404, "User not found! Wrong userId!");
  }

  // get tweets from database
  const tweets = await Tweet.aggregatePaginate(
    Tweet.aggregate([{ $match: match }]),
    options
  );

  // send response
  return res.status(200).json(
    new SuccessResponse("User tweets retrieved successfully!", {
      tweets,
    })
  );
};
