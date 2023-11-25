import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import morgan from "morgan";
import { FRONTEND_URI, NODE_ENV } from "../config/config.js";
import { __limit } from "../constants/express/index.js";
import { cacheGetter } from "../middlewares/cache/cache-getter.middleware.js";
import { cacheSetter } from "../middlewares/cache/cache-setter.middleware.js";
import { cacheUpdater } from "../middlewares/cache/cache-updater.middleware.js";
import { apiErrorMiddleware } from "../middlewares/error/api-error.middleware.js";
import { errorMiddleware } from "../middlewares/error/error.middleware.js";
import { routeNotFoundMiddleware } from "../middlewares/error/not-found.middleware.js";
import { usersRouter } from "../routes/users.routes.js";

export const app: Application = express();

// using pre-built middlewares
app.use(
  cors({
    origin: [FRONTEND_URI],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  }),
  cookieParser(),
  express.json({
    limit: __limit,
  }),
  express.urlencoded({ extended: true, limit: __limit }),
  express.static("public")
);
// logs requests in development mode
if (NODE_ENV === "development") app.use(morgan("combined"));

// authentication middleware
// app.use(authMiddleware);

// cache getter middleware
app.use(cacheGetter);
// TODO: check caching for routes!

// using routes
app.use("/api/v1/users", usersRouter);

// cache setter and updater middlewares
app.use(cacheSetter, cacheUpdater);

// error handler middlewares
app.use(routeNotFoundMiddleware, apiErrorMiddleware, errorMiddleware);
