import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class ScheduleController {
  async index(req, res) {
    const { userID: user_id } = req;

    const meetups = await Subscription.findAll({
      where: { user_id },
      attributes: ['user_id', 'date'],
      include: {
        model: Meetup,
        as: 'meetup',
        attributes: ['id', 'title', 'description', 'location', 'date'],
        order: ['date'],
        where: {
          date: {
            [Op.gte]: new Date(),
          },
        },
      },
    });

    return res.json(meetups);
  }
}

export default new ScheduleController();
