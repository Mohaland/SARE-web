const express = require("express")
const handle = require('handlebars')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const mongoose = require("mongoose")
const path = require("path")
const viewHelpers = require('./util/view_helpers')

// database connection
mongoose
  .connect(process.env.DEBUG_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.error(error))

const app = express()

app.use(cookieParser(process.env.SESSION_SECRET))
app.use(session({
  key: 'user_sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { expires: new Date(Date.now() + (3600000 * 2)) }
}))

/*  replacemennt
const app = express();
app.use(session({ secret: 'somevalue' }));
*/

app.use(flash())

app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

// View engine config
app.set('view engine', 'hbs')
app.engine('hbs', handlebars({
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials'),
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(handle),
  helpers: {
    inc: viewHelpers.inc,
    sectr: viewHelpers.parseSection,
    json: function (content) {
      return JSON.stringify(content)
    },
    if_eq: function (a, b, opts) {
      if (a == b)
        return opts.fn(this)
      else
        return opts.inverse(this)
    }
  }
})) 


// Check if user cookie exists while there's no user in session
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user)
    res.clearCookie('user_sid')

  next()
})

// serve static files
app.use(express.static('public'))
app.use(express.static('content'))
app.use('/upload', express.static('upload'))

// load routes
const routes = require('./routes/api')
const webRoutes = require('./routes/web')
app.use(webRoutes)
app.use('/api', routes)


module.exports = app