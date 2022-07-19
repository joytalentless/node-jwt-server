import jwt from 'jsonwebtoken';

import { User } from '../types';

const SECRET_KEY = '123456789';

const expiresIn = '1h';

type Payload = {
  id: string;
};

// Create a token from a payload
export const createToken = (payload: Partial<User>) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

export const auth = async (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(' ')[0] !== 'Bearer'
  ) {
    const status = 401;
    const message = 'Error in authorization format';
    res.status(status).json({ status, message });
    return;
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, SECRET_KEY) as Payload;

    if (payload instanceof Error) {
      const status = 401;
      const message = 'Access token not provided';
      res.status(status).json({ status, message });
      return;
    }
    next();
  } catch (err) {
    const status = 401;
    const message = 'Error access_token is revoked';
    res.status(status).json({ status, message });
  }
};
