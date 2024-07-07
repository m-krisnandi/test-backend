import { Request } from 'express';
import db from '../../db';
import { BadRequestError, UnauthorizedError } from '../../errors';
import { createJWT, createTokenUser } from '../../utils';
import { User, SigninResponse } from '../../api/v1/users/model';
import argon2 from 'argon2';

const signin = async (req: Request): Promise<SigninResponse> => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

  const users = rows as User[];
  if (users.length === 0) {
    throw new UnauthorizedError('Incorrect email or password');
  }

  const user = users[0];
  const isMatch = await argon2.verify(user.password, password);
  if (!isMatch) {
    throw new UnauthorizedError('Incorrect email or password');
  }

  const token = createJWT(createTokenUser(user));

  return { token };
};

export { signin };
