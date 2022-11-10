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

    if(req.UID == undefined || req.UID == null){
        return res.json({result:"filed"}).end();
    }

    try {
        models.Users.findOne({
            where: {UID: req.UID},
            attributes: ['UID', 'Email', 'NickName'],
            include: [{
                model:models.Users,
                as: 'Follwers',
                attributes: ['UID', 'Email', 'NickName'],
                include: [{
                    model: models.Board,
                    order: [['BID', 'DESC']],
                    include: [{
                        model: models.Users,
                        require: true,
                        attributes: ['UID', 'Email', 'NickName']
                    },{
                        model: models.Picture,
                        required: true,
                    }]
                }]
            }, {
                model: models.Board,
                order: [['BID', 'DESC']],
                include: [{
                    model: models.Users,
                    require: true,
                    attributes: ['UID', 'Email', 'NickName']
                },{
                    model: models.Picture,
                    required: true,
                }]
            }]
        }).then(board => {
            let boardCount = [];
        
            boardCount = board.Boards;
           
            for(let i in board.Follwers){
                for(let j in board.Follwers[i].Boards){
                    boardCount.push(board.Follwers[i].Boards[j]);
                }
            }
        
            boardCount.sort((a, b) => {
                if(a.BID < b.BID) return 1;
                if(a.BID > b.BID) return -1;
            });
        
            const minPage = page * 4, 
                maxPage = (boardCount.length < (page + 1) * 4)? boardCount.length : (page + 1) * 4;

            console.log(page, minPage, maxPage);
            
            const boardArray = boardCount.slice(minPage, maxPage);
        
            res.json({result:"ok", boardArray, follwers: board.Follwers}).end();
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