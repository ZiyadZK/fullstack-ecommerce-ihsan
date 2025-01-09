const { db_config } = require("@/database/config");
const multer = require("multer");

const storage = multer.memoryStorage()
export const upload_image = multer({ storage }).single('foto')
export const runMulterMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if(result instanceof Error) {
                return reject(result)
            }else{
                return resolve(result)
            }
        })
    })
}
