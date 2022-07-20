import bodyParser from 'body-parser';
import jsonServer from 'json-server';

import short from 'short-uuid';

import userModel from './models/users';
import { auth, createToken } from './middleware/auth';

const PORT = process.env.PORT || 3000;

const server = jsonServer.create();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

// Register New User
server.post('/auth/register', async (req, res) => {
  console.log('auth/register payload', req.body);

  const { email, password } = req.body;
  const found = await userModel.find(email, password);

  if (found) {
    res.status(200).json({
      success: false,
      message: 'User found with same email.',
    });
    return;
  }

  const userDocs = await userModel.read();
  const user = { id: short.generate(), email, password };
  userDocs.push(user);
  const newUserDocs = await userModel.write(userDocs);

  console.log('newUserDocs', newUserDocs);

  const access_token = createToken({ email, password });
  res.status(200).json({
    success: true,
    access_token,
    user,
  });
});

server.post('/auth/login', async (req, res) => {
  console.log('auth/login payload', req.body);
  const { email, password } = req.body;
  const found = await userModel.find(email, password);
  console.log('found /auth/login', found);

  if (!found) {
    res.status(200).json({
      success: false,
      message: 'Incorrect email or password.',
    });
    return;
  }
  const access_token = createToken({ email, password });
  res.status(200).json({
    success: true,
    access_token,
    user: found,
  });
});

server.use(/^(?!\/auth).*$/, auth);

server.listen(PORT, () => {
  console.log(`JWT Auth API Server listening on port ${PORT}`);
});
