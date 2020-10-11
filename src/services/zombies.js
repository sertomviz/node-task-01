import Zombie from '../models/zombie';

export default {

  getAllZombies (filters, offset, per_page, sort_by) {
    return Zombie.find(filters)
        .skip(offset || 0)
        .limit(per_page || 10)
        .sort(sort_by || 'created_at desc');
  },

  getZombieCount (filters) {
    return Zombie.countDocuments(filters);
  },

  createZombie (data) {
    return Zombie.create(data);
  },

  getOneZombie (zombieId) {
    return Zombie.findById(zombieId).exec();
  },

  updateZombie (zombieId, data) {
    return Zombie.findByIdAndUpdate(zombieId, data, { new: true }).exec();
  },

  deleteZombie (zombieId) {
    return Zombie.findByIdAndDelete(zombieId).exec();
  },

}
