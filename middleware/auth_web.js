const request = require('request');
 

module.exports = (req, res, next) => {
  if (req.session.user && req.cookies.access_token) {
    const token = req.cookies.access_token;

    request.get(`http://localhost:3000/api/auth/check/${token}`, (error, response, body) => {
      if (error) {
        console.error(error);
        req.session.destroy();
        res.clearCookie('access_token');
        return res.status(401).redirect('/login');
      }

      if (response.statusCode == 200) {
        req.session.user = JSON.parse(body).user;
        next();
      } else {
        req.session.destroy();
        res.clearCookie('access_token');
        return res.status(401).redirect('/login');
      }
    });
  } else {
    req.session.destroy();
    res.clearCookie('access_token');
    return res.status(401).redirect('/login');
  }
}