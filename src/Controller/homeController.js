import models from "../models";
export const mainPage = (req, res) => {
    res.render("home.html");
};
export const locationPage = (req, res) => {
    res.send("location page");
};