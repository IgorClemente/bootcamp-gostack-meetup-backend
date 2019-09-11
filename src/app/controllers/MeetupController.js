import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.string().required(),
    });

    const { date } = req.body;
    const dateParsed = parseISO(date);
  }
}

export default new MeetupController();
