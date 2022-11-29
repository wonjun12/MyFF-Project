import { Op } from "sequelize";
import models from "../models";

//사진 넣기 함수
async function createPicture(BID, Photo) {
  await models.Picture.create({
    BID: BID,
    Photo: Photo,
  });
}

//사진 업데이트 함수
async function updatePicture(PID, Poto) {
  await models.Picture.update(
    {
      Poto: Poto,
    },
    {
      where: { PID: PID },
    }
  );
}

//사진 삭제 함수
async function deletePicture(PID) {
  await models.Picture.destroy({
    where: { PID: PID },
  });
}


//게시판 만들기
export const boardWritePost = async (req, res) => {
  // const {writeAddrName, writeCommName, writeTagName, writeStarName} = req.body;
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
      }
    ],
  });

  //console.log(req.UID);
  //게시글 유무 확인
  if (Board != null) {
    // 조회 결과 보내줌
    res.json({ result: "ok", Board }).end();

  } else {
    return res.redirect("/");
  }
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
  return res.json({ Board, UID: req.UID }).end();
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
    hashtag,
  } = JSON.parse(req.body.bodys);

  //게시글 수정
  await models.Board.update(
    {
      Location: writeAddrName,
      PlaceName: writePlaceName,
      Content: writeCommName,
      Star: parseInt(writeStarName),
    },
    {
      where: { BID: id },
    }
  );
  //기존 태그데이터 수정
  const prevHashtag = await models.Hashtag.findAll({
    where: { BID: id },
  });

  if (prevHashtag.length !== hashtag.length) {
    await models.Hashtag.destroy({
      where: { BID: id },
    });
    for (let i in hashtag) {
      await models.Hashtag.create(
        {
          title: hashtag[i].title,
          BID: id,
        },
        {
          where: { BID: id },
        }
      );
    }
  }
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
    res.json({ result: "error" }).end();
  }

  //사진 배열 여부 확인 (2개 이상일 경우만 배열로 적용됨)
  // const arrayCheck = Array.isArray(writeImgName);
};

//게시글 삭제
export const boardDelte = async (req, res) => {
  const { id } = req.params;

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
  console.log(req.body);
  if (action === "delete") {
    try {
      await models.Comment.destroy({
        where: { CID: commtID },
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
          where: { CID: commtID },
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