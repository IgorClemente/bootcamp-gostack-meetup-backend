import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../config/auth';

export default async (req, res, next) => {
  const headerAuth = req.headers.authorization;

  if (!headerAuth) {
    res.status(401).json({ error: 'Token authorization not provided' });
  }

  const [_, token] = headerAuth.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userID = decoded.id;

    return next();
  } catch (err) {
    return res.json({ error: 'Invalid authorization token' });
  }
};
