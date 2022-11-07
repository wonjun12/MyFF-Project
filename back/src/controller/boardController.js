import models from "../models";

//사진 넣기 함수
async function createPicture(BID, Photo){
    await models.Picture.create({
        BID: BID,
        Photo: Photo
    })
}

//사진 업데이트 함수
async function updatePicture(PID, Poto){
   await models.Picture.update({
        Poto: Poto
   },{
        where: {PID: PID}
   })
}

//사진 삭제 함수
async function deletePicture(PID) {
    await models.Picture.destroy({
        where: {PID: PID}
    })
}

//게시판 작성 html
export const boardWriteGet = async (req, res) => {
    res.status(201).json({result: 'ok', UID: req.UID});
};

//게시판 만들기
export const boardWritePost = async (req, res) => {
    // const {writeAddrName, writeCommName, writeTagName, writeStarName} = req.body;
    const {writeAddrName, writeCommName} = JSON.parse(req.body.bodys);
    const {files} = req.files;
    console.log(files.data);
    try {
        // DB에 넣으면서 BID를 가져옴
        const {BID} = await models.Board.create({
            UID: req.UID,
            Location: writeAddrName,
            Content: writeCommName,
            // Star: writeStarName,
        });
        
        createPicture(BID, files.data);

        //사진 넣기 함수 넣으면 됨
        res.json({result: "ok"}).end();
        
    } catch (error) {
        console.log(error);
        res.json({result:"error"}).end();
    }
};

//게시글 보기
export const boardSee = async (req, res) => {
    const {id} = req.params;
    
    const Board = await models.Board.findOne({
        where: {BID: id}
    })

    const Picture = await models.Picture.findAll({
        where: {BID: id}
    })
    //게시글 유무 확인
    if(Board != null){
        return res.render("boardSee.html",{Board, Picture});    
    }else {
        return res.redirect("/");
    }
    
};

//게시글 수정 화면 보기
export const boardEditGet = async (req, res) => {
    const {id} = req.params;

    const Board = await models.Board.findOne({
        where: {BID: id}
    })

    //해당 게시글이 자신의 글인지 확인
    if(Board.UID === req.UID){

        const Picture = await models.Picture.findAll({
            where: {BID: id}
        })

        return res.render("boardEdit",{Board, Picture});
    }
    return res.redirect("back");
};

//게시글 수정하기
export const boardEditPost = async (req, res) => {
    const {id} = req.params;
    const {writeAddrName, writeCommName, writeStarName, writeImgName} = req.body;

    //게시글 수정
    await models.Board.update({
        Location: writeAddrName,
        Content: writeCommName,
        Star: writeStarName,
    },{
        where: {BID: id}
    })

    //사진 배열 여부 확인 (2개 이상일 경우만 배열로 적용됨)
    const arrayCheck = Array.isArray(writeImgName);
    //해당 게시글 사진 조회
    await models.Picture.findAll({
        where: {BID: id}
    }).then(data => {
        //사진 수정
        if(arrayCheck){
            const MAX_DATA = data.length;
            const MAX_IMG = writeImgName.length;
            //DB 사진 갯수와 입력한 사진 갯수 비교
            if(MAX_IMG > MAX_DATA){
                for(let i in writeImgName){
                    if(i >= MAX_DATA){
                        //넣은 사진이 많다면 사진을 추가함
                        createPicture(id, writeImgName[i]);
                    }else {
                        //넣은 사진 까지는 사진 수정
                        updatePicture(data[i].PID, writeImgName[i]);
                    }
                }
            }else {
                for(let i in data){
                    if(i >= MAX_IMG){
                        //넣은 사진이 DB의 갯수보다 적다면 삭제
                        deletePicture(data[i].PID);
                    }else {
                        //넣은 사진 만큼 수정
                        //DB갯수와 넣은 사진의 갯수가 동일할 경우 모두 수정됨
                        updatePicture(data[i].PID, writeImgName[i]);
                    }
                }
            }
        }else {
            //넣은 사진이 하나일 경우
            for(let i in data){
                if(i > 0){
                    //DB에 저장된게 2개 이상일경우 전부 삭제
                    deletePicture(data[i].PID);
                }else{
                    //한개의 사진만 수정
                    updatePicture(data[i].PID, writeImgName);
                }
            }
        }
    })

    return res.redirect("../" + id);
};

//게시글 삭제
export const boardDelte = async (req, res) => {
    const {id} = req.params;

    //외래키 때문에 사진 먼저 삭제 해야함.
    await models.Picture.destroy({
        where: {BID: id}
    })

    await models.Board.destroy({
        where: {BID: id}
    })

    return res.redirect("/");
};

export const boardCommt = (req, res) => {
    res.send("board commt");
};

export const boardCommtEdit = (req, res) => {
    res.send("board commt edit");
};