import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import authConfig from '../config/auth';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { email, password } = req.body;

    const checkUserExists = await User.findOne({ where: { email } });

    if (!checkUserExists) {
      return res.status(401).json({ error: 'User does not exist' });
    }

    if (!(await checkUserExists.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = checkUserExists;

    return res.json({
      id,
      name,
      email,
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
