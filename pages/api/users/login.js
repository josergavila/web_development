import bcrypt from 'bcryptjs/dist/bcrypt';
import db from '../../../utils/db';
import nc from 'next-connect';
import User from '../../../models/User';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  await db.disconnect();
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    console.log(user);
    const token = signToken(user);
    console.log(token);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).send({ message: 'Email e/ou Senha inválidos.' });
  }
});

export default handler;
