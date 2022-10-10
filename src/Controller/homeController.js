import models from "../models";
import jwt from "../jwt/jwt";

export const mainPage = async (req, res) => {
    let Users;
    const {MyAccess} = req.cookies;
    
    if(MyAccess){
        const user = await jwt.verify(MyAccess);
        req.UID = user.UID;
    }

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

export const getLetter = async (req, res) => {
    console.log(req.files.filenamename.data);
    res.json(req.files.filenamename.data);
}