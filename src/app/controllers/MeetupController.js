import * as Yup from 'yup';
import { isBefore, parseISO, startOfHour } from 'date-fns';

import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.string().required(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation failed' });
    }

    const { date } = req.body;

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    const { title, description, location, banner_id } = req.body;

    const meetup = await Meetup.create({
      user_id: req.userID,
      title,
      description,
      location,
      date,
      banner_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.string(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { id } = req.params;

    if (!id) return res.status(401).json({ error: 'Meetup id not provided' });

    const meetup = await Meetup.findOne({
      where: { id, user_id: req.userID },
    });

    if (!meetup) {
      return res.status(401).json({ error: 'Meetup does not exist' });
    }

    const { date } = req.body;

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({ error: 'The event has already happened' });
    }

    meetup.update({
      user_id: req.userID,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      banner_id: req.body.banner_id,
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
