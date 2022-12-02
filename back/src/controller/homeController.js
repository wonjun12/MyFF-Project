import models from "../models";
import tesseract from "node-tesseract-ocr";
import { Op } from "sequelize";
import SendMail from '../mailer/mailer';

//메인 페이지
export const mainPage = async (req, res) => {

    //로그인 유저 및 팔로워 게시글 찾기
    const board = await models.Users.findOne({
            where: {
                UID: req.UID
            },
            attributes: ['UID', 'Email', 'NickName'],
            //연결된 외래키 검색
            include: [{
                //해당 유저의 MyUID를 기준으로 fowller테이블 검색
                model:models.Users,
                as: 'Follwers',
                attributes: ['UID', 'Email', 'NickName', 'Profile'],
                include: [{
                    //검색된 팔로우에서 FUID에 맞는 게시물들 검색
                    model: models.Board,
                    include: [{
                        model: models.Users,
                        require: true,
                        attributes: ['UID', 'Email', 'NickName', 'Profile']
                    },{
                        model: models.Picture,
                        required: true,
                        limit: 1
                    },{
                        model: models.BoardLike,
                    },{
                        model: models.Hashtag,
                    },{
                        model: models.Comment,
                        attributes: ['CID']
                        // attributes: ['CID', [models.sequelize.fn('COUNT', models.sequelize.col('Boards.comments.CID')), 'counts']]
                    }]
                }]
            }, {
                //접속한 유저의 게시물 검색
                model: models.Board,
                include: [{
                    model: models.Users,
                    require: true,
                    attributes: ['UID', 'Email', 'NickName', 'Profile']
                },{
                    model: models.Picture,
                    required: true,
                    limit: 1
                },{
                    model: models.BoardLike,
                },{
                    model: models.Hashtag,
                },{
                    model: models.Comment,
                    attributes: ['CID']
                    // attributes: ['CID', [models.sequelize.fn('COUNT', models.sequelize.col('Boards.comments.CID')), 'counts']]
                }]
            }]
        });

    //보여줄 페이지 설정
    const page = parseInt(req.query.page);

    let boardCount = [];
        
    
    //자신의 게시물을 배열에 넣는다.
    boardCount = board.Boards;

    //팔로우 게시물을 배열에 넣는다
    board.Follwers.forEach(({Boards}) => {
        if(!!Boards.length){
            for(let i in Boards){
                boardCount.push(Boards[i]);
            } 
        }
    });
    
    //BID를 기준으로 최신 글을 앞으로 보낸다.
    boardCount.sort((a, b) => {
        if(a.BID < b.BID) return 1;
        if(a.BID > b.BID) return -1;
    });
    
    //보여줄 페이즈를 4개씩 설정
    const minPage = page * 4, 
            maxPage = (boardCount.length < (page + 1) * 4)? boardCount.length : (page + 1) * 4;
    //설정된 페이지를 자른다.
    const boardArray = boardCount.slice(minPage, maxPage);


    res.json({result:"ok", boardArray, follwers: board.Follwers}).end();

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
            require: true,
            limit: 1
        },{
            model: models.BoardLike,
            require: true
        },{
            model: models.Hashtag,
            require: true
        },{
            model: models.Comment,
            attributes: ['CID']
            // attributes: ['CID', [models.sequelize.fn('COUNT', models.sequelize.col('Boards.comments.CID')), 'counts']]
        }]
    })
    
    //좋아요수가 많은 순서대로 설정
    await board.sort((a, b) => {
        if(a.BoardLikes.length < b.BoardLikes.length) return 1;
        if(a.BoardLikes.length > b.BoardLikes.length) return -1;
    });

    
    //좋아요가 없다면 안넣는다.
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
    
    //팔로잉수 많은수 설정
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

//태그 검색 베스트 게시물
export const tagPage = async (req, res) => {
    const {page, tag} = req.query;

    //검색한 태그에 관련해서 id전부 검색
    const tags = await models.Hashtag.findAll({
        where : {
            title : tag
        },
    });

    //태그가 잇다면
    if(!!tags){

        let tagName = [];

        //BID를 추출
        tags.forEach(({BID}) => {
            tagName.push(BID);
        })


        //추출한 BID를 기준으로 검색
        const board = await models.Board.findAll({
            where : {
                BID : {
                    [Op.in] : tagName
                }
            },
            include: [{
                model: models.Users,
                require: true,
                attributes: ['UID', 'NickName', 'Profile']
            },{
                model: models.Picture,
                require: true,
                limit: 1
            },{
                model: models.BoardLike,
                require: true
            },{
                model: models.Hashtag,
                require: true
            },{
                model: models.Comment,
                attributes: ['CID']
                // attributes: ['CID', [models.sequelize.fn('COUNT', models.sequelize.col('Boards.comments.CID')), 'counts']]
            }]
        })

        //좋아요 수에따라 정렬
        await board.sort((a, b) => {
            if(a.BoardLikes.length < b.BoardLikes.length) return 1;
            if(a.BoardLikes.length > b.BoardLikes.length) return -1;
        });
    
        
        //이건 6개씩
        const minPage = page * 6, 
            maxPage = (board.length < (page + 1) * 6)? board.length : (page + 1) * 6;
    
        const boardArray = board.slice(minPage, maxPage);
    
        
        res.json({result:"ok", boardArray}).end();

    }else{

        res.json({result:"filed"}).end();

    }
}

//지도 상세보기
export const locationPage = async (req, res) => {
    const {name} = req.query;

    //name=0은 자신의 게시물
    if(name === '0'){
        const board = await models.Board.findAll({
            where: {UID: req.UID},
            include: [{
                model: models.Users,
                require: true,
                attributes: ['NickName', 'UID', 'ProFile']
            },{
                model: models.Picture,
                require: true,
                limit: 1
            }]
        })

        res.json({result: 0, board}).end();

    //name=1 은 팔로우 게시물
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
                        attributes: ['UID', 'NickName', 'ProFile']
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

//영수증 주소 추출
export const getLetter = async (req, res) => {
    try {
        //지역 이름 설정
        const region = ['[주','서울', '인천', '부산', '대구', '광주', '대전', 
            '울산', '세종', '경기', '강원', '충청', '경상', '전라', '제주'];
            //이미지 파일을 가져온다.
            const imgFile = req.files.imgFile.data;
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
                            return res.json({result: true, imgText}).end();
                        }
                    }
                }
                
                return res.json({result:false}).end();
            })  
    } catch (error) {
        return res.json({result:false}).end();
    }
    
}

//메인페이지 검색 기능
export const mainSearch = async (req, res) => {
    const {value, select}  = req.body;
    
    //닉네임 및 이름으로 검색할시
    if(select === '0'){
        const user = await models.Users.findAll({
            where : {
                [Op.or] : [
                    {
                        NickName : {
                            //'%value%'
                            [Op.substring] : value
                        }
                    },
                    {
                        Name : {
                            [Op.substring] : value
                        }
                    }
                ]
            },
            attributes : ['UID', 'NickName', 'Name', 'ProFile'],
            include : [{
                model: models.Users,
                as: 'Follwings',
                attributes: ['UID']
            },{
                model: models.Board,
                attributes: ['BID', 'createdAt'],
                order: [['BID', 'DESC']],
                limit: 1
            }]
        });
  
        res.json({result: 'ok', user}).end();
    //게시물 이름으로 검색할시
    }else if(select === '1'){
  
      const board = await models.Board.findAll({
        where: {
          PlaceName : {
            [Op.substring] : value
          }
        },
        order: [['BID', 'DESC']],
        include: [{
          model: models.Picture,
          require: true,
          limit: 1
        },{
          model: models.BoardLike,
          require: true
        }]
      })
  
      res.json({result: 'ok', board}).end();
    }
}


//비밀번호 찾기 메일
export const pwdMail = async (req, res) => {
    const {email} = req.body;

    const user = await models.Users.findOne({
        where: {Email : email},
        attributes: ['Pwd']
    });

    if(!!user){
        SendMail(user.Pwd, email);
    }

    res.end();
}
