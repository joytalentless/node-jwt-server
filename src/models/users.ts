import * as fs from 'fs';
import * as path from 'path';

const fsPromises = fs.promises;
const CURRENT_WORKING_DIR = process.cwd();

const read = async () => {
  return JSON.parse(
    fs.readFileSync(path.join(CURRENT_WORKING_DIR, 'src/users.json'), {
      encoding: 'utf-8',
    }),
  );
};

const write = async (data) => {
  return await fsPromises.writeFile(
    path.join(CURRENT_WORKING_DIR, 'src/users.json'),
    JSON.stringify(data),
  );
};

const find = async (email, password) => {
  const userDocs = await userModel.read();
  console.log('userDocs', userDocs);

  if (!userDocs || userDocs.length === 0) return null;
  return userDocs.find(
    (user) => user.email === email && user.password === password,
  );
};

const userModel = {
  read,
  write,
  find,
};

export default userModel;
