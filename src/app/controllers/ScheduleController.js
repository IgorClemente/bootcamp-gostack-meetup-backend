import Meetup from '../models/Meetup';

class ScheduleController {
  async index(req, res) {
    const { userID: user_id } = req;

    const meetups = await Meetup.findAll({
      where: { user_id },
      order: ['date'],
      attributes: ['id', 'title', 'description', 'location', 'date'],
    });

    return res.json(meetups);
  }
}

export default new ScheduleController();
