import userModel from '../models/users';

// Check if the user exists in database
// const foundUser = async ({ email, password }: Partial<User>) => {

// };

export const userMiddleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Missing parameters',
      });
    }

    const userDocs = await userModel.read();

    const found =
      userDocs.findIndex(
        (user) => user.email === email && user.password === password,
      ) !== -1;

    if (found) {
      return res.status(400).json({
        message: 'Email and Password already exist',
      });
    }

    return next();
  } catch (error) {
    return res.status(403).json({
      code: 403,
      message: 'Unauthorized',
    });
  }
};
