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
  const { email, password } = req.body;
  const found = await userModel.find(email, password);

  if (found) {
    res.status(200).json({ user: found });
    return;
  }

  const userDocs = await userModel.read();

  userDocs.push({
    id: short.generate(),
    email: email,
    password: password,
  });

  await userModel.write(userDocs);

  const access_token = createToken({ email, password });
  res.status(200).json({ access_token });
});

server.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const found = await userModel.find(email, password);
  if (!found) {
    res.status(200).json({ message: 'Incorrect email or password' });
    return;
  }

  const access_token = createToken({ email, password });
  res.status(200).json({ access_token });
});

server.use(/^(?!\/auth).*$/, auth);

server.listen(PORT, () => {
  console.log('JWT Auth API Server');
});
