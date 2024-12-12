
const { constant } = require('../constants');

const customErrorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch (statusCode) {
        case constant.VALIDATION_ERORR:
            res.json({ title: 'Validation Error!', message: err.message });
            break;
        case constant.UNAUTHORIZED:
            res.json({ title: 'Unauthorized User!', message: err.message });
            break;
        case constant.FORBIDDEN:
            res.json({ title: 'User Forbidden!', message: err.message });
            break;
        case constant.NOT_FOUND:
            res.json({ title: 'Not Found!', message: err.message });
            break;
        case constant.SERVER_ERROR:
            res.json({ title: 'Server Error!', message: err.message });
            break;
        default:
            console.log('No Error, All Good!');
            break;    
    }


}

module.exports = customErrorHandler;