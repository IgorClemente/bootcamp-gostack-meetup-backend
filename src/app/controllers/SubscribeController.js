import * as Yup from 'yup';

import { isBefore, startOfHour, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscribeController {
  async store(req, res) {
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
      date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(401).json({ error: 'Validation failed' });
    }

    const { userID: user_id } = req;

    const { meetup_id } = req.body;

    const meetup = await Meetup.findByPk(meetup_id);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exists' });
    }

    if (meetup.user_id !== user_id) {
      return res
        .status(401)
        .json({ error: 'Registration not allowed for organizer' });
    }

    const { date } = req.body;

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json('Past date are not permitted');
    }

    const checkSubscribe = await Subscription.findOne({
      where: { meetup_id, user_id },
    });

    if (checkSubscribe) {
      return res.status(401).json({
        error: 'inscrição encontrada, é possível somente uma inscrição',
      });
    }

    return res.json({});
  }
}

export default new SubscribeController();
