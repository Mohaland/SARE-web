const Appointment = require('../models/appointment')

/**
 * Book an appointment.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.create = async (req, res) => {
  const data = req.body
  const appointment = new Appointment(data)

  await appointment.save((err, succ) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Une erreur est survenue.", error: err })
    }

    return res.status(201).json({ message: "Le rendez-vous a été créé et est en attente de validation.", appointment: succ })
  })
}

/**
 * Get user appointments.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.index = async (req, res) => {
  const id = req.params.id

  await Appointment.find({ user: id }).populate('user').populate('house').populate('agent').exec((err, appointments) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Une erreur est survenue.", error: err })
    }

    return res.json(appointments)
  });
}

/**
 * Update appointment.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.update = async (req, res) => {
  const id = req.params.id
  const data = req.body

  await Appointment.findById(id, async (err, appointment) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Une erreur est survenue.", error: err })
    }

    if (appointment) {
      await appointment.updateOne(data, (err, succ) => {
        if (err) {
          console.error(err)
          return res.status(500).json({ message: "Une erreur est survenue.", error: err })
        }

        return res.json({ message: "Rendez-vous mis à jour avec succès.", appointment: appointment })
      })
    } else {
      return res.status(404).json({ message: "Rendez-vous introuvable." })
    }
  })
}

/**
 * Delete appointment.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.delete = async (req, res) => {
  const id = req.params.id

  await Appointment.findById(id, async (err, appointment) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Une erreur est survenue.", error: err })
    }

    if (appointment) {
      await appointment.deleteOne()
      return res.json({ message: "Rendez-vous supprimé avec succès." })
    } else {
      return res.status(404).json({ message: "Rendez-vous introuvable." })
    }
  })
}