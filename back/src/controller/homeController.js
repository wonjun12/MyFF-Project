import models from "../models";
import jwt from "../jwt/jwt";
import tesseract from "node-tesseract-ocr";

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
                attributes: ['UID', 'Email', 'NickName', 'Profile'],
                include: [{
                    model: models.Board,
                    order: [['BID', 'DESC']],
                    include: [{
                        model: models.Users,
                        require: true,
                        attributes: ['UID', 'Email', 'NickName', 'Profile']
                    },{
                        model: models.Picture,
                        required: true,
                    },{
                        model: models.BoardLike,
                    }]
                }]
            }, {
                model: models.Board,
                order: [['BID', 'DESC']],
                include: [{
                    model: models.Users,
                    require: true,
                    attributes: ['UID', 'Email', 'NickName', 'Profile']
                },{
                    model: models.Picture,
                    required: true,
                },{
                    model: models.BoardLike,
                }]
            }]
        }).then(board => {
            // console.log(board);
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
            
            const boardArray = boardCount.slice(minPage, maxPage);
        
            res.json({result:"ok", boardArray, follwers: board.Follwers}).end();

        }).catch(err => {
            console.log(err);
        });
        
        } catch (error) {
            // res.render("home.html", {UID: Users});
        } 

};

//베스트 게시물
export const bestPage = async (req, res) => {
    const page = parseInt(req.query.page);
    const board = await models.Board.findAll({
        include: [{
            model: models.Users,
            require: true,
            attributes: ['UID', 'NickName', 'Profile']
        },{
            model: models.Picture,
            require: true
        },{
            model: models.BoardLike,
            require: true
        }]
    })
    
    await board.sort((a, b) => {
        if(a.BoardLikes.length < b.BoardLikes.length) return 1;
        if(a.BoardLikes.length > b.BoardLikes.length) return -1;
    });

    const boards = await board.filter((item) => {

        if(item.BoardLikes?.length !== 0){
            return item;
        }
    });
    
    const minPage = page * 6, 
        maxPage = (board.length < (page + 1) * 6)? board.length : (page + 1) * 6;

    const boardArray = boards.slice(minPage, maxPage);

    
    res.json({result:"ok", boardArray}).end();
}

//베스트 유저
export const bestUserPage = async (req, res) => {

    const page = parseInt(req.query.page);
    console.log(page)
    const user = await models.Users.findAll({
        attributes: ["UID", "NickName", "Profile", "createdAt"],
        include: [{
            model: models.Board,
            require: true,
            order: [['BID', 'DESC']],
            include: [{
                model: models.Picture,
                require: true,
            },{
                model: models.BoardLike,
            }],
            limit: 4,
        },{
            model: models.Users, 
            as: 'Follwings',
            attributes: ["UID"],
        },{
            model: models.Users, 
            as: 'Follwers',
            attributes: ["UID"],
        }]
    });
    
    await user.sort((a, b) => {
        if(a.Follwings.length < b.Follwings.length) return 1;
        if(a.Follwings.length > b.Follwings.length) return -1;
    });

    const users = await user.filter((item) => {

        if(item.Follwings.length !== 0){
            return item;
        }
    });
    
    const minPage = page * 4, 
        maxPage = (user.length < (page + 1) * 4)? user.length : (page + 1) * 4;

    const userArray = users.slice(minPage, maxPage);

    
    res.json({result:"ok", userArray}).end();
}

//지도 상세보기
export const locationPage = async (req, res) => {
    const {name} = req.query;

    if(name === '0'){
        const board = await models.Board.findAll({
            where: {UID: req.UID},
            include: [{
                model: models.Users,
                require: true,
                attributes: ['NickName']
            },{
                model: models.Picture,
                require: true,
                limit: 1
            }]
        })

        res.json({result: 0, board}).end();

    }else if(name === '1'){
        const follwer = await models.Users.findOne({
            where: {UID: req.UID},
            require:true,
            attributes: ['UID'],
            include: [{
                model:models.Users,
                as: 'Follwers',
                attributes: ['UID'],
                include: [{
                    model: models.Board,
                    include: [{
                        model: models.Users,
                        require: true,
                        attributes: ['UID', 'NickName']
                    },{
                        model: models.Picture,
                        required: true,
                        limit: 1
                    }]
                }]
            }]
        });
        
        res.json({result: 1, follwer}).end();
    }
};

export const getLetter = async (req, res) => {
    try {
        //지역 이름 설정
        const region = ['[주','서울', '인천', '부산', '대구', '광주', '대전', 
            '울산', '세종', '경기', '강원', '충청', '경상', '전라', '제주'];
            //이미지 파일을 가져온다.
            const imgFile = req.files.imgFile.data; //filenamename <= 실험용 파일 이름
            //추출할때 설정 역할
            const config = {
                lang: "kor",
                oem: 1,
                psm: 1, //1 or 12 BEST
            }

            //이미지 글 추출
            await tesseract.recognize(imgFile, config).then(reulst => {
                //추출된 글자들을 엔터친 기준으로 나눈다.
                const PhotoText = reulst.split("\r\n");
                for(let imgText of PhotoText){
                    for(let i of region){
                        //지역 이름이 맨 앞에 있는걸을 추출해 주소를 예측하여 보낸다.
                        if(imgText.length > 3 && imgText.indexOf(i) != -1 && imgText.indexOf(i) == 0){
                            return res.json(imgText).end();
                        }
                    }
                }
                
                return res.json("주소를 찾을수 없습니다.").end();
            })  
    } catch (error) {
        return res.json("오류").end();
    }
    
}