const multer = require('multer')
const mime = require('mime-types')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'upload')
    },
    filename: (req, file, callback) => {
        const extension = mime.extension(file.mimetype)
        callback(null, Date.now() + '.' + extension)
    }
})

module.exports = multer({ storage }).any()