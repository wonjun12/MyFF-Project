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

    const arrayCheck = Array.isArray(file);

    if (arrayCheck) {
      for (let i in file) {
        createPicture(BID, file[i].data);
      }
    } else {
      createPicture(BID, file.data);
    }

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

    //사진 넣기 함수 넣으면 됨
    res.json({ result: "ok" }).end();
  } catch (error) {
    console.log(error);
    res.json({ result: "error" }).end();
  }
};

//게시글 보기
export const boardSee = async (req, res) => {
  const { id } = req.params;

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
    where: { BID: id },
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
        const { file } = req.files;
  
        const arrayCheck = Array.isArray(file);
  
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

  const board = models.Board.findOne({
    where : {
      BID : id,
      UID : req.UID
    }
  })

  if(!!board){
    //외래키 때문에 사진 먼저 삭제 해야함.
    await models.Picture.destroy({
      where: { BID: id },
    });
  
    await models.Hashtag.destroy({
      where: { BID: id },
    });
  
    await models.Board.destroy({
      where: { BID: id },
    });
  }

  return res.end();
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

//댓글 수정
export const boardCommtEdit = async (req, res) => {
  const { commtID, action, commtEditText } = req.body;

  if (action === "delete") {
    try {
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
  } else if (action === "edit") {
    try {
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



export const boardLike = async (req, res) => {
  const { id } = req.params;
  try {
    await models.BoardLike.create({
      BID: parseInt(id),
      UID: req.UID
    })
  } catch (error) {
    await models.BoardLike.destroy({
      where: {
        BID: parseInt(id),
        UID: req.UID
      }
    })
  }
  return res.end();
}

//메인페이지 검색 기능
export const mainSearch = async (req, res) => {
  const {value}  = req.body;

  const user = await models.Users.findAll({
      where : {
          [Op.or] : [
              {
                  NickName : {
                      [Op.like] : `%${value}%`
                  }
              },
              {
                  Name : {
                      [Op.like] : `%${value}%`
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

}