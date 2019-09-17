import * as Yup from 'yup';

import { isBefore, startOfHour, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';

import Queue from '../../lib/Queue';

import SubscriptionMail from '../jobs/SubscriptionMail';

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

    const meetup = await Meetup.findByPk(meetup_id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exists' });
    }

    if (meetup.user_id === user_id) {
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

    const { id } = await Subscription.create({
      meetup_id,
      user_id,
      date,
    });

    const user = await User.findByPk(user_id, {
      attributes: ['name', 'email'],
    });

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json({ id, meetup_id, user_id, date });
  }
}

export default new SubscribeController();
