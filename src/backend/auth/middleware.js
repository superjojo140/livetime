jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization) {
            //get token from auth header and split from "bearer " postfix
            token = req.headers.authorization.split(" ")[1];
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        if (req.xhr) {
            //return 401 and message for failed AJAX requests
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        else {
            //redirect to login page for browser requests
            return res.redirect(`/loginPage.html?triggerUrl=${req.url}`);
        }
    }
};