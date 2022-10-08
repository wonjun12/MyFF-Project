import express from "express";
// import models from "./models"
import homeRouter from "./Router/homeRouter";
import userRouter from "./Router/userRouter";
import boardRouter from "./Router/boardRouter";

const app = express();
const port = 3000;

// models.sequelize.sync().then(() => console.log("연결 성공")).catch(() => console.log("연결 실패"));

app.use(express.urlencoded({extended: true}));

app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/board", boardRouter);


app.listen(port, console.log(`${port} open`));
