import mongoose from "mongoose";

export const connectDB = () => {
    mongoose
       .connect(process.env.MONGODB_URI, {
              dbName: "StudentDB",
       })
       .then(() => {
              console.log("MongoDB connected");
       })
       .catch((err) => {
               console.log("Error connecting to database", err);
       });
}