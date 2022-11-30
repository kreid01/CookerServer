import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
const app = express();
mongoose.connect("mongodb://localhost:27017/NodeAPI", {}, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("success");
    }
});
app.use(express.json());
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);
app.listen("4000", () => {
    console.log("server started");
});
//# sourceMappingURL=server.js.map