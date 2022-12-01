import { Op } from "sequelize";
import models from "../models";

//사진 넣기 함수
async function createPicture(BID, Photo) {
  await models.Picture.create({ 
    BID: BID,
    Photo: Photo,
  });
}

//게시판 만들기
export const boardWritePost = async (req, res) => {

  const {
    writeAddrName,
    writePlaceName,
    writeCommName,
    writeStarName,
    writeHashtag,
  } = JSON.parse(req.body.bodys);

  const { file } = req.files;

  try {
    // DB에 넣으면서 BID를 가져옴
    const { BID } = await models.Board.create({
      UID: req.UID,
      Location: writeAddrName,
      PlaceName: writePlaceName,
      Content: writeCommName,
      Star: parseInt(writeStarName),
    });

    //사진 배열 유무 확인
    const arrayCheck = Array.isArray(file);


    if (arrayCheck) {
      //배열일시 for
      for (let i in file) {
        createPicture(BID, file[i].data);
      }
    } else {
      createPicture(BID, file.data);
    }

    //해시태그는 무조건 배열
    for (let i in writeHashtag) {
      await models.Hashtag.create(
        {
          title: writeHashtag[i],
          BID: BID,
        },
        {
          where: { BID: BID },
        }
      );
    }

    res.json({ result: "ok" }).end();

  } catch (error) {
    console.log(error);
    res.json({ result: "error" }).end();
  }
};

//게시글 보기
export const boardSee = async (req, res) => {
  const { id } = req.params;
  
  //업데이트해줌
  // 특정 값을 일정한 값으로 증가시키고 싶을때
  await models.Board.increment({
    Views: 1
  },{
    where: {BID: id}
  })

  const Board = await models.Board.findOne({
    where: { BID: id },
    include: [
      {
        model: models.Users,
        required: true,
        attributes: ["UID", "Email", "NickName", "Profile"],
        include: [{
          model: models.Users, 
            as: 'Follwings',
            attributes: ["UID"],
          },{
            model: models.Users, 
            as: 'Follwers',
            attributes: ["UID"],
          }]
      },
      {
        model: models.Picture,
        required: true,
      },
      {
        model: models.Comment,
        include: [
          {
            model: models.Users,
            require: true,
          },
        ],
      },
      {
        model: models.BoardLike,
        attributes: ['UID']
      },{
        model: models.Hashtag,
        require: true
      }
    ],
  });


  res.json({ result: "ok", Board }).end();

};


//게시글 수정 화면 보기
export const boardEditGet = async (req, res) => {
  const { id } = req.params;

  const Board = await models.Board.findOne({
    where: { 
      BID: id,
      UID: req.UID
    },
    include: [
      {
        model: models.Users,
        required: true,
        attributes: ["UID"],
        where: {
          UID : req.UID
        }
      },
      {
        model: models.Picture,
        required: true,
      },
      {
        model: models.Hashtag,
        require: true,
      },
    ],
  });

  return res.json({ Board }).end();
};

//게시글 수정하기
export const boardEditPost = async (req, res) => {
  const { id } = req.params;
  const {
    writeAddrName,
    writePlaceName,
    writeCommName,
    writeStarName,
    writeHashtag,
    photos,
    hashtags,
  } = JSON.parse(req.body.bodys);

      //게시글 수정
      const update = await models.Board.update(
        {
          Location: writeAddrName,
          PlaceName: writePlaceName,
          Content: writeCommName,
          Star: parseInt(writeStarName),
        },
        {
          where: { 
            BID : id, 
            UID : req.UID
          },
        }
      );

      if(!!update[0]){

        await models.Picture.destroy({
          where : {
            BID : id,
            PID : {
              //notin
              //해당 값이 아닌것들
              [Op.notIn] : photos
            }
          }
        })
  
        await models.Hashtag.destroy({
          where : {
            BID: id,
            id : {
              [Op.notIn] : hashtags
            }
          }
        })
  
        //태그 추가
        for (let i in writeHashtag) {
          await models.Hashtag.create(
            {
              title: writeHashtag[i],
              BID: id,
            },
            {
              where: { BID: id },
            }
          );
        }
  
  
        try {
        //사진 유무 확인
        const { file } = req.files;
  
        const arrayCheck = Array.isArray(file);
  
        //배열 유무 확인
        if (arrayCheck) {
          for (let i in file) {
            createPicture(id, file[i].data);
          }
        } else {
          createPicture(id, file.data);
        }
  
        
      
        } catch {
          
        } 
  
        res.json({ result: "ok" }).end();

      }else{
        res.json({ result: "filed" }).end();
      }
      

};

//게시글 삭제
export const boardDelte = async (req, res) => {
  const { id } = req.params;

  const board = await models.Board.findOne({
    where : {
      BID : id,
      UID : req.UID
    }
  })

  if(!!board){
    //외래키 때문에 사진 먼저 삭제 해야함.
    try {
      await models.BoardLike.destroy({
        where: { BID: id },
      });
  
      await models.Comment.destroy({
        where: { BID: id },
      });
  
      await models.Picture.destroy({
        where: { BID: id },
      });
    
      await models.Hashtag.destroy({
        where: { BID: id },
      });
    
      await models.Board.destroy({
        where: { BID: id },
      });
    } catch (error) {
      console.log(error);
    }
    

    return res.json({ result: "ok" }).end();
  } else {
    return res.json({ result: "err" }).end();
  }
};

//댓글 작성
export const boardCommt = async (req, res) => {
  const { id } = req.params;

  const { userID, commtName } = req.body;

  try {
    await models.Comment.create({
      BID: id,
      UID: userID,
      comm: commtName,
    });

    res.json({ result: "ok" }).end();
  } catch (error) {
    
    res.json({ result: "error" }).end();
  }
};

//댓글 수정(삭제, 수정)
export const boardCommtEdit = async (req, res) => {
  const { commtID, action, commtEditText } = req.body;

  //댓글 삭제 일때
  if (action === "delete") {
    try {
      //댓글삭제
      await models.Comment.destroy({
        where: { 
          CID: commtID,
          UID: req.UID
        },
      });
      res.json({ result: "ok" }).end();
    } catch (error) {
      console.log(error);
      res.json({ result: "error" }).end();
    }
  // 댓글 수정 일때
  } else if (action === "edit") {
    try {
      //댓글 업데이트
      await models.Comment.update(
        {
          comm: commtEditText,
        },
        {
          where: { 
            CID : commtID ,
            UID : req.UID
          },
        }
      );
      res.json({ result: "ok" }).end();
    } catch (error) {
      console.log(error);
      res.json({ result: "error" }).end();
    }
  } else {
    res.json({ result: "No Action" }).end();
  }
};


//게시물 좋아요
export const boardLike = async (req, res) => {
  const { id } = req.params;
  try {
    //좋아요한게 아니라면 좋아요 생성
    //의도적으로 정책에 의해 오류를 생성시킴
    await models.BoardLike.create({
      BID: parseInt(id),
      UID: req.UID
    })
  } catch (error) {
    //좋아요를 했다면 삭제시킨다
    await models.BoardLike.destroy({
      where: {
        BID: parseInt(id),
        UID: req.UID
      }
    })
  }
  return res.end();
}