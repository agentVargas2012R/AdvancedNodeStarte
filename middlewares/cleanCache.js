clearHash = require('../services/cache');

//by default, runs before the handler. 
//we need to await till the next function is called and then clear the cache, we only do this on a succesful post.
module.exports = async (req, res, next) => {
        await next();
        clearHash(req.user.id);
};