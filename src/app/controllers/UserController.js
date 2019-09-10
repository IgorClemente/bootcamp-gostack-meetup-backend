import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
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

    const { name, email, password } = req.body;

    const checkUserExists = await User.findOne({ where: { email } });

    if (checkUserExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    const { id } = user;

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => {
          return oldPassword ? field.required() : field;
        }),
      confirmPassword: Yup.string().when('password', (password, field) => {
        return password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error' });
    }

    const { userID } = req;

    if (!userID) {
      return res.status(401).status({ error: '' });
    }

    const user = User.findByPk(userID);

    if (!user) {
      return res.status(401).json({ error: '' });
    }

    const { email } = req.body;

    if (user.email !== email) {
      const checkUserExists = User.findOne({ where: email });

      if (checkUserExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    res.json({});
  }
}

export default new UserController();
