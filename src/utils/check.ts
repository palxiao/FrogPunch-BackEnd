const jwt = require('jwt-simple')

module.exports = {
    user(req: any) {

        let token = typeof req === 'string' ? req : req.headers.authorization

        try {
            const decoded = jwt.decode(token, 'jwtTokenSecret');
            if (decoded.exp <= Date.now()) {
                return false
            } else {
                return decoded.iss
            }
        } catch (e) {
            return false
        }
    }
}
export { }