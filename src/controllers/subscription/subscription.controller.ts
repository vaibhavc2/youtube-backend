import { asyncHandler } from "../../utils/server/handlers/async-handler.util.js";
import { _addSubscription } from "./handlers/add-subscription.handler.js";
import { _removeSubscription } from "./handlers/remove-subscription.handler.js";

export const addSubscription = asyncHandler(_addSubscription);
export const removeSubscription = asyncHandler(_removeSubscription);
