import models from "../models";
export const userLogin  = (req, res) => {
    res.send("login test");
};
export const userJoin = (req, res) => {
    res.send("join test");
};
export const userSee = (req, res) => {
    res.send("see user");
};
export const userEditGet = (req, res) => {
    res.send("edit user");
};
export const userEditPost = (req, res) => {
    res.send("edit user post");
};
export const userDelete = (req, res) => {
    res.send("delete user");
};