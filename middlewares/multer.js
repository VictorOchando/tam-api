const authorizedMimeTypes = ["image/jpg", "image/jpeg", "image/png"];
const multer = require("multer");
const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 500000,
    },
    fileFilter: (req, file, cb) => {
        if (!authorizedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Wrong format"));
        }
        cb(null, true);
    },
}).single("photo");

module.exports = { upload };
