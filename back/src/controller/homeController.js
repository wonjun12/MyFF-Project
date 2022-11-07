import models from "../models";
import jwt from "../jwt/jwt";
import fs from "fs";

export const mainPage = async (req, res) => {
    const {MyAccess} = req.cookies;

    const page = parseInt(req.query.page);

    if(MyAccess){
        const user = await jwt.verify(MyAccess);
        req.UID = user.UID;
    }


    try {
        let boardArray = [];

        models.Board.findAll({
            where: {UID: req.UID},
            include: [{
                        model: models.Users,
                        required: true,
                        attributes: ['UID', 'Email', 'NickName']
                    }]
        }).then(board => {
            
            for(let i=page*4; i<4*(page+1); i++){
                if(board.length > i){
                    boardArray.push(board[i]);
                }
            }
            // console.log(boardArray);
            res.json({result:"ok", boardArray}).end();
        }).catch(err => {
            console.log(err);
        });

       

        // fs.readFile("./src/Views/poto.jpg", (error, data) => {
        //     if(error) {
        //         console.log(error);
        //     }
        //     console.log(data);
            
        //     return res.status(201).json({result:"ok", addr:Board, img:data.toString('base64')}).end();
        // })
        
        } catch (error) {
            // res.render("home.html", {UID: Users});
        } 

};

export const locationPage = (req, res) => {
    res.send("location page");
};

export const getLetter = async (req, res) => {
    console.log(req.files);
    return res.json({result: "ok", img : req.files.imgUpload.data});
    // res.json(req.files.filenamename.data);
}

// export const mainPagging = async (req, res) => {

//     const page = parseInt(req.query.page);
    
//     console.log(typeof(page));

//     let boardArray = [];

//     models.Board.findAll({
//         where: {UID: 1}

//     }).then(board => {
//         for(let i=page*4; i<4*(page+1); i++){
//             if(board.length > i){
//                 boardArray.push(board[i]);
//             }
//         }
//         res.json({result: "ok", boardArray}).end(); 
//     });
// }