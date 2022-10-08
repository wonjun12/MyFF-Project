import models from "../models";
export const mainPage = (req, res) => {
    models.Users.findAll(

    ).then(result => {res.send(result)});
};
export const locationPage = (req, res) => {
    res.send("location page");
};