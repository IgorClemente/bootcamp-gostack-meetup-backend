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
      return res.status(401).json({ error: 'Validation failed' });
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
      return res.status(401).json({ error: 'Past date are not permitted' });
    }

    const checkSubscribe = await Subscription.findOne({
      where: { meetup_id, user_id },
    });

    if (checkSubscribe) {
      return res.status(401).json({
        error: 'Only one event registration allowed',
      });
    }

    const { date: meetup_date } = meetup;

    const checkHourSubscription = await Subscription.findOne({
      where: { user_id, date: meetup_date },
    });

    if (checkHourSubscription) {
      return res
        .status(401)
        .json({ error: 'User has an event scheduled at this time' });
    }

    const subscription = await Subscription.create({
      meetup_id,
      user_id,
      date,
    });

    return res.json(subscription);
  }
}

export default new SubscribeController();
