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
            console.log(board);
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

export const locationPage = (req, res) => {
    res.send("location page");
};

export const getLetter = async (req, res) => {
    try {
        //지역 이름 설정
        const region = ['서울', '인천', '부산', '대구', '광주', '대전', 
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
                            return res.json(imgText);
                        }
                    }
                }
                
                return res.json("주소를 찾을수 없습니다.");
            })  
    } catch (error) {
        return res.json("오류");
    }
    
}