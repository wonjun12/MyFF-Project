import express from "express";
import homeRouter from "./Router/homeRouter";
import userRouter from "./Router/userRouter";
import boardRouter from "./Router/boardRouter";

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));

app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/board", boardRouter);


app.listen(port, console.log(`${port} open`));
