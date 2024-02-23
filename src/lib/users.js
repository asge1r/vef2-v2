import bcrypt from 'bcrypt';
import { query } from './db.js';

export async function comparePasswords(password, user) {
  const ok = await bcrypt.compare(password, user.password);

  if (ok) {
    return user;
  }
  return false;
}

export async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';
  try {
    const result = await query(q, [username]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (err) {
    console.error('error finding user from username', err);
  }
  return null;
}

export async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';
  try {
    const result = await query(q, [id]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (err) {
    console.error('error finding user from id', err);
  }
  return null;
}
