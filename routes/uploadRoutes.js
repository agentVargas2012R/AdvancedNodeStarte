const AWS = require('aws-sdk');
const keys = require('../config/keys');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey
});

module.exports = app => {
    app.get('/api/uploads', requireLogin, (req, res) => {

        const key = `${req.user.id}/${uuid()}.jpeg`;
        //getSignedUrl(operation, params, callback) => String
        //content-type: image
        //key: 
        //bucket: my-blog-buc-05042020

            //my-user-id/2384198341234.jpeg
            s3.getSignedUrl('putObject', {
                'Bucket' : 'my-blog-buck-05042020',
                'ContentType' : 'image/jpeg',
                'Key'  : key   
            }, 
            (err, url)=> res.send({key, url}));
    });
};