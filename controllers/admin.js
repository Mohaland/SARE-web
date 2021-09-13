const request = require('request');
const House = require('../models/house');
const Appointment = require('../models/appointment');
const User = require('../models/user');

/**
 * Web client login route
 * 
 * @param {import('express').Request} req 
 * @param {*} res 
 */
exports.login = (req, res) => {
  const token = req.params.token;

  if (!token)
    return res.status(401).json({ message: "Invalid token provided." });

  request.get(`https://housecm.herokuapp.com/api/auth/check/${token}`, (error, response, body) => {
    if (error) {
      console.error(error);
      req.session.destroy();
      res.clearCookie('access_token');
      return res.status(401).json({ message: "Invalid token provided.", error: error });
    }

    if (response.statusCode == 200) {
      const user = JSON.parse(body).user;

      if (user.role == 'agent') {
        req.session.user = user
        res.cookie('access_token', token);

        req.session.save();
        return res.json({ message: 'success' });
      } else {
        console.log(response);
        req.session.destroy();
        res.clearCookie('access_token');
        return res.status(401).json({ message: "Un compte agent immobilier est nécessaire.", error: error });
      }
    } else {
      console.log(response);
      req.session.destroy();
      res.clearCookie('access_token');
      return res.status(401).json({ message: "Invalid token provided.", error: error });
    }
  });
}

/**
 * Houses management page
 *
 * @param {import('express').Request} req
 * @param {*} res
 */
exports.index = async (req, res) => {
  const error = req.flash("error");
  const info = req.flash("info");
  const success = req.flash("success");
  const _messages = { success: success, info: info, error: error };

  await House.find({ author: req.session.user.id }, (err, houses) => {
    if (err) {
      console.error(err);
      return res.status(500).render('houses', { layout: "main", title: "Propriétés" });
    }

    const populated = houses.length > 0;
    return res.render('houses', { layout: 'main', title: 'Propriétés', houses: houses, populated: populated, messages: _messages });
  });
}

/**
 * Appointments page
 *
 * @param {import('express').Request} req
 * @param {*} res
 */
exports.appointments = async (req, res) => {
  const error = req.flash("error");
  const info = req.flash("info");
  const success = req.flash("success");
  const _messages = { success: success, info: info, error: error };

  await Appointment.find({ agent: req.session.user.id }).populate('user').populate('house').populate('agent').exec((err, appointments) => {
    if (err) {
      console.error(err);
      return res.status(500).render('appointments', { layout: "main", title: "Réservations" });
    }

    console.log(appointments);

    const populated = appointments.length > 0;
    return res.render('appointments', { layout: 'main', title: 'Réservations', appointments: appointments, populated: populated, messages: _messages });
  });
}

/**
 * Login page
 *
 * @param {import('express').Request} req
 * @param {*} res
 */
exports.page = (req, res) => {
  if (req.session.user && req.cookies.access_token) {
    return res.redirect('/');
  } else {
    return res.render('login', { layout: false });
  }
}

/**
 * Registration page
 *
 * @param {import('express').Request} req
 * @param {*} res
 */
exports.register = (req, res) => {
  if (req.session.user && req.cookies.access_token) {
    return res.redirect('/');
  } else {
    return res.render('register', { layout: false });
  }
}

/**
 * Admin logout
 *
 * @param {import('express').Request} req
 * @param {*} res
 */
exports.logout = (req, res) => {
  req.session.destroy();
  res.clearCookie('access_token');
  return res.redirect('/login');
}
