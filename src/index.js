import express from "express";
import models from "./models/index.js";
import homeRouter from "./Router/homeRouter";
import userRouter from "./Router/userRouter";
import boardRouter from "./Router/boardRouter";

const app = express();
const port = 3000;

models.sequelize.sync().then(() => {
    console.log("DB 연결");
}).catch(error => {
    console.log(error);
})

app.set("view engine", "ejs");
app.set('views', process.cwd() +"/src/Views/");
app.engine("html", require("ejs").renderFile);


app.use(express.urlencoded({extended: true}));

app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/board", boardRouter);


app.listen(port, console.log(`${port} open`));
