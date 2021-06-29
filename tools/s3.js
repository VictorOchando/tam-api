const S3 = require("aws-sdk/clients/s3");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});
async function uploadFile(file, id) {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: id,
    };

    let result = await s3.upload(uploadParams).promise();
    await unlinkFile(file.path);

    return result.Location;
}

function removeTemporaryFile(file) {
    fs.unlink(file.path, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}

function deleteFromS3(id) {
    var deleteParams = { Bucket: bucketName, Key: id };

    s3.deleteObject(deleteParams, function (err, data) {
        if (err) console.log(err);
    });
}

module.exports = { uploadFile, removeTemporaryFile, deleteFromS3 };
