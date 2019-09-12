import { isAfter, startOfHour, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscribeController {
  async store(req, res) {
    const { userID: user_id } = req;

    const { id } = req.params;

    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exists' });
    }

    if (!(meetup.user_id !== user_id)) {
      return res
        .status(401)
        .json({ error: 'Registration not allowed for organizer' });
    }

    const { date } = req.body;

    const hourStart = startOfHour(parseISO(date));

    if (isAfter(hourStart, new Date())) {
      return res.status(401).json('Past date are not permitted');
    }

    return res.json({});
  }
}

export default new SubscribeController();
