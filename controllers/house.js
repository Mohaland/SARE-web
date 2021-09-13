const House = require('../models/house')

/**
 * Create house.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.create = async (req, res) => {
  let data = req.body
  data.author = req.session.user.id
  data.gallery = []

  // add uploaded images to gallery
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      data.gallery.push(`/upload/${file.filename}`)
    })
  } else {
    return res.status(500).json({ message: "Vous devez ajouter au moins une image à la propriété." })
  }

  const house = new House(data)

  await house.save((err, saved) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Impossible d'ajouter la propriété.", error: err })
    }

    return res.status(201).json({ message: "Propriété créée avec succès.", house: saved })
  })
}

/**
 * Update house.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.update = async (req, res) => {
  const id = req.params.id
  const data = req.body

  await House.findById(id, async (err, house) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Une erreur est survenue lors de la modification de la propriété.", error: err })
    }

    if (house) {
      // add uploaded images to gallery
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          data.gallery.push(`/upload/${file.filename}`)
        })
      }

      await house.updateOne(data, (err, succ) => {
        if (err) {
          console.error(err)
          return res.status(500).json({ message: "Une erreur est survenue lors de la modification de la propriété.", error: err })
        }

        return res.json({ message: "Propriété mise à jour avec succès.", house: house })
      })
    } else {
      return res.status(404).json({ message: "La propriété spécifiée est introuvable.", error: err })
    }
  })
}

/**
 * Get house.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.single = async (req, res) => {
  const id = req.params.id

  await House.findById(id, (err, house) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Une erreur est survenue.", error: err })
    }

    return res.json(house)
  })
}

/**
 * Get houses.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.index = async (req, res) => {
  await House.find({ status: 'AVAILABLE' }, (err, houses) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Une erreur est survenue.", error: err })
    }

    return res.json(houses)
  })
}

/**
 * Get agent houses.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.agent = async (req, res) => {
  const id = req.params.id

  await House.find({ author: id }, (err, houses) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Une erreur est survenue.", error: err })
    }

    return res.json(houses)
  })
}

/**
 * Search houses by filter.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.search = async (req, res) => {
  const filters = req.body
  let result = []

  console.log(filters);

  await House.find({ status: 'AVAILABLE' }, (err, houses) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Une erreur est survenue.", error: err })
    }

    houses.forEach((house) => {
      let add = false

      for (filter in filters) {
        let value = filters[filter]

        switch (filter) {
          case 'city':
            if (house.city.toLowerCase().includes(value.toLowerCase())) add = true
            break

          case 'street':
            if (house.street.toLowerCase().includes(value.toLowerCase())) add = true
            break

          case 'size':
            if (house.size >= parseInt(value)) add = true
            break

          case 'room':
            if (house.room >= parseInt(value)) add = true
            break

          case 'bathroom':
            if (house.bathroom >= parseInt(value)) add = true
            break

          case 'kitchen':
            if (house.kitchen >= parseInt(value)) add = true
            break

          case 'price_range':
            if (house.price >= parseInt(value[0]) && house.price <= parseInt(value[1])) add = true
            break

          default:
            break
        }
      }

      if (add) result.push(house)
    })

    console.log(result)

    return res.json(result)
  })
}

/**
 * Delete house.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.delete = async (req, res) => {
  const id = req.params.id

  await House.findById(id, async (err, house) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Une erreur est survenue.", error: err })
    }

    if (house) {
      await house.deleteOne()
      return res.json({ message: "Propriété supprimée avec succès." })
    } else {
      return res.status(404).json({ message: "La propriété spécifiée est introuvable." })
    }
  })
}