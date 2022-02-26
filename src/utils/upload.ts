const uFs = require('fs');
const uPath = require('path');
const moment = require('moment');
const uMulter = require('multer');

const uStorage = uMulter.diskStorage({
    destination: function (req: any, file: any, cb: Function) {

        const t = moment().format('YYYY-M-D');
        const distPath = `../uploads/${t}`;

        if (!uFs.existsSync('../uploads')) {
            uFs.mkdirSync('../uploads');
        }

        if (!uFs.existsSync(distPath)) {
            uFs.mkdirSync(distPath);
        }

        cb(null, distPath);
    },

    filename: (req: any, file: any, cb: Function) => {
        const ext = uPath.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const uUpload = uMulter({ storage: uStorage });

module.exports = uUpload;