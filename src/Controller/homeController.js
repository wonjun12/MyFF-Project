import {Users, Board} from "../models";

export const mainPage = async (req, res) => {

    const Uers = await Users.findOne({
        where: {UID: 1}
    });

    res.render("home.html", {UID: Uers.UID});
};
export const locationPage = (req, res) => {
    res.send("location page");
};