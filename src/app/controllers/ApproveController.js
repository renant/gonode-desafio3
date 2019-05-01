const Purchase = require('../models/Purchase')

class ApproveController {
  async approve (req, res) {
    const { id } = req.params

    const purchase = await Purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    if (!purchase) {
      return res
        .status(404)
        .json({ error: 'Could not find this purchase intent' })
    }

    const ad = purchase.ad

    if (req.userId !== ad.author.id) {
      return res.status(400).json({ error: 'You do not own this ad' })
    }

    if (ad.purchasedBy) {
      return res.status(400).json({ error: 'This ad was already purchased' })
    }

    ad.purchasedBy = id

    await ad.save()

    return res.json(ad)
  }
}

module.exports = new ApproveController()
