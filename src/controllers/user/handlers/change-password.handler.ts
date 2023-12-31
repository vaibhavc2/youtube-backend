import { Request, Response } from "express";
import ApiError from "../../../utils/api/error/api-error.util.js";
import { SuccessResponse } from "../../../utils/api/res/api-response.util.js";

/**
 * @desc    STEPS: Change password
 *
 * try-catch is not needed since we use asyncHandler in the main controllers file
 * request body -> old password, new password, confirm password
 * if new password and confirm password are not the same, throw error
 * if old password and new password are the same, throw error
 * user authentication is already checked using a middleware: get it from req.user
 * if old password is correct, change the password else throw error
 * send response
 *
 */

export const _changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // check if new password and confirm password are not same
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password must match the confirm password!");
  }

  // check if old password and new password are same
  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password cannot be same as old password!");
  }

  // retrive user from req object
  const user = req.user;

  // check if old password is correct
  const isCorrect = await user.comparePassword(oldPassword);

  // if old password is not correct, throw error
  if (!isCorrect) {
    throw new ApiError(400, "Old password is incorrect!");
  }

  // change the password
  user.password = newPassword;

  // save the user
  await user.save({ validateBeforeSave: false });

  // send response
  res
    .status(200)
    .json(new SuccessResponse("Password changed successfully!", {}));
};
