const multer = require('multer');
const path = require('path');
const createHttpError = require('http-errors');
const { UPLODE_USER_IMAGE_DIR, MAX_FILE_SIZE, FILE_EXTRANTION } = require('../Config/config');


//save image type string on server
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, UPLODE_USER_IMAGE_DIR)
//     },
//     filename: function (req, file, cb) {
//         const extName = path.extname(file.originalname);
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + uniqueSuffix + '-' + file.originalname.replace(extName, "") + extName)
//     }
//   })

//   const fileFilter = (req, file, cb)=>{
//     const extName = path.extname(file.originalname);
//     if(!UPLODE_USER_IMAGE_DIR.includes(extName.substring(1))){
//       return cb(createHttpError(400,"This types of file is not allowed"));
//     }
//     cb(null, true);
//   }


const storage = multer.memoryStorage()

  const fileFilter = (req, file, cb)=>{
    const extName = path.extname(file.originalname);
    if(!file.mimetype.startsWith("image/")){
      return cb( new Error("only image file is allowed"), false);
    }
    if(!file.size > MAX_FILE_SIZE){
      return cb( new Error("file too larger"), false);
    }
    if(!FILE_EXTRANTION.includes(file.mimetype)){
      return cb( new Error("this file is not allowed"), false);
    }
    cb(null, true);
  }


  
  const upload = multer({ storage: storage,
    fileFilter: fileFilter
   })
  module.exports = upload;