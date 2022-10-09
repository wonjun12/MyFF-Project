import models from "../models";

export const mainPage = async (req, res) => {
    let Users;
    try {
        Users = await models.Users.findOne({
            where: {UID: req.UID}
        });

        res.render("home.html", {UID: Users.UID});
    } catch (error) {
        res.render("home.html", {UID: Users});
    }
    

    
};
export const locationPage = (req, res) => {
    res.send("location page");
};