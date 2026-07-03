import path from "path";
import { query } from "../utils/db";
export interface LocalUserStoreItem {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

const usersDataPath = path.join(__dirname, "..", "data", "users.json");

export const findUserByEmail = async (email: string): Promise<LocalUserStoreItem | null> => {
  // const users = await readUsersFile();
  // return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  return null; // Placeholder for database query
};

export const addUser = async (user: LocalUserStoreItem): Promise<LocalUserStoreItem> => {
  const users = await addUsersFile(user); 
  return user;
};

// Query to insert a new user into the database and return the inserted user

const addUsersFile = async (user: LocalUserStoreItem): Promise<LocalUserStoreItem[]> => {
  const { name, email, passwordHash } = user;
  // 2. Insert user into 'users' table
  try {
    const userResult = await query(
      `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email`,
      [name, email, passwordHash]
    );

    console.log(userResult.rows[0]);
  } catch (err) {
    console.error(err);
  }
  return []; // Placeholder for database query
};
