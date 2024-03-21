const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, "public/assets/blog-uploads");
    },
    filename: (req, file, cb) => {
        return cb(null, Date.now() + file.originalname);
    },
})

const upload = multer({ storage: storage });
module.exports = upload;