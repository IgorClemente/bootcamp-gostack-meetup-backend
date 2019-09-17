import * as Yup from 'yup';
import {
  isBefore,
  parseISO,
  startOfHour,
  startOfDay,
  endOfDay,
} from 'date-fns';

import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const { date, page = 1 } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data parameter not provided' });
    }

    const dateParsed = parseISO(date);

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(dateParsed), endOfDay(dateParsed)],
        },
      },
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'title', 'description', 'location', 'date'],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'url'],
        },
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(meetups);
  }

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

    const { id: meetup_id } = req.params;

    if (!meetup_id) {
      return res.status(401).json({ error: 'Meetup id not provided' });
    }

    const meetup = await Meetup.findByPk(meetup_id);

    if (!meetup) {
      return res.status(401).json({ error: 'Meetup does not exist' });
    }

    const { userID: user_id } = req;

    if (meetup.user_id !== user_id) {
      return res
        .status(401)
        .json({ error: 'You can only edit meetup with organizer' });
    }

    const hourStart = startOfHour(parseISO(req.body.date));

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({ error: 'The event has already happened' });
    }

    meetup.update({
      ...req.body,
      user_id,
    });

    const { title, description, location, date } = meetup;

    return res.json({ title, description, location, date });
  }

  async delete(req, res) {
    const { id } = req.params;

    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res.status(401).json({ error: 'Meetup does not exists' });
    }

    const { userID: user_id } = req;

    if (meetup.user_id !== user_id) {
      return res
        .status(401)
        .json({ error: 'You can only edit meetup with organizer' });
    }

    await meetup.destroy();

    return res.json({ success: 'Meetup deleted' });
  }
}

export default new MeetupController();
