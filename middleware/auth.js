const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token)
        return res.status(401).json({ message: "Vous n'avez pas les accès requis." })

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err)
            return res.status(401).json({ message: "Vous n'avez pas les accès requis."})

        return next()
    })
}