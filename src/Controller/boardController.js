import models from "../models";

//사진 넣기 함수
async function addPicture(BID, Poto){
    await models.Picture.create({
        BID: BID,
        Poto: Poto
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

//게시판 작성 html
export const boardWriteGet = async (req, res) => {
    return res.render("board.html");
};

//게시판 만들기
export const boardWritePost = async (req, res) => {
    const {writeAddrName, writeCommName, writeTagName, writeStarName} = req.body;

    try {
        //DB에 넣으면서 BID를 가져옴
        const {BID} = await models.Board.create({
            UID: req.UID,
            Location: writeAddrName,
            Content: writeCommName,
            Star: writeStarName,
        })

        //사진 넣기 함수 넣으면 됨

        return res.redirect("/");
        
    } catch (error) {
        return res.redirect('back');
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

    //해당 게시글 사진 조회
    await models.Picture.findAll({
        where: {BID: id}
    }).then(data => {
        //조회한 값들 중에서 순서대로 사진 값 수정
        if(Array.isArray(writeImgName)){
            //사진 입력이 여러개 일경우 실행
            for(let poto in writeImgName){
                updatePicture(data[poto].PID, writeImgName[poto]);
            }
        }else {
            //사진이 한개일때 실행
            updatePicture(data[0].PID, writeImgName);
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