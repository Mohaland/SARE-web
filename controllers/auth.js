const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')



/**
 * Check if user with email exists.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.exists = async (req, res) => {
  const email = req.params.email

  await User.findOne({ email: email }, (err, user) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Impossible de trouver le compte." })
    }

    return res.json(user !== null)
  })
}

/**
 * Create user account.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.create = async (req, res) => {
  const data = req.body
  data.password = await bcrypt.hash(data.password, bcrypt.genSaltSync())
  const user = new User(data)

  await user.save((err, saved) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Impossible de créer le compte.", error: err })
    }

    saved.id = saved._id

    return res.status(201).json({ message: "Compte utilisateur créé avec succès.", user: saved })
  })
}

/**
 * Authenticates user account.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.login = async (req, res) => {
  const credentials = req.body

  await User.findOne({ email: credentials.email }, async (err, user) => {
    if (err) {
      console.error(err)
      return res.status(401).json({ message: "Adresse e-mail ou mot de passe invalides.", error: err })
    }

    if (user) {
      if (!user.active)
        return res.status(401).json({ message: "Votre compte est désactivé, contactez un administrateur." })

      await bcrypt.compare(credentials.password, user.password, (err, valid) => {
        if (err) {
          console.error(err)
          return res.status(401).json({ message: "Adresse e-mail ou mot de passe invalides.", error: err })
        }

        if (valid) {
          const payload = { id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role }
          const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '30d' })

          return res.json({ token: token, user: payload })
        } else {
          return res.status(401).json({ message: "Adresse e-mail ou mot de passe invalides.", error: err })
        }
      })
    } else {
      return res.status(401).json({ message: "Adresse e-mail ou mot de passe invalides.", error: err })
    }
  })
}

/**
 * User token verification route.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.check = async (req, res) => {
  const token = req.params.token

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: "Token invalide envoyé." })
    }

    await User.findOne({ email: decoded.email }, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ message: "Impossible de retrouver l'utilisateur." })
      }

      if (!user)
        return res.status(401).json({ message: "Impossible de retrouver l'utilisateur." })

      if (!user.active)
        return res.status(401).json({ message: "Votre compte est désactivé." })

      return res.json({ user: decoded });
    });
  });
}