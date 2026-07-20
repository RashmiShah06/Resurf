import express from "express";
import cors from "cors";

const app = express();//create an express app 
app.use(
  cors({
     origin: ["http://localhost:5173", "https://resurf-pi.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());

//import routes
import userRouter from './routes/user.route.js';
import collectionRouter from "./routes/collection.route.js";
import topicRouter from "./routes/topic.route.js";
import resourceRouter from "./routes/resource.route.js";
import trashRouter from "./routes/trash.route.js";
import searchRoutes from "./routes/search.routes.js";



app.use("/api/v1/users", userRouter);
app.use("/api/v1/collections", collectionRouter);
app.use("/api/v1/topics", topicRouter);
app.use("/api/v1/resources", resourceRouter);
app.use("/api/v1/trash", trashRouter);
app.use("/api/v1/search", searchRoutes);


export default app;