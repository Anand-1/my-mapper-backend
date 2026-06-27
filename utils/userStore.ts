import fs from "fs/promises";
import path from "path";

export interface LocalUserStoreItem {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

const usersDataPath = path.join(__dirname, "..", "data", "users.json");

const readUsersFile = async (): Promise<LocalUserStoreItem[]> => {
  try {
    const fileContent = await fs.readFile(usersDataPath, "utf8");
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw err;
  }
};

const writeUsersFile = async (users: LocalUserStoreItem[]): Promise<void> => {
  await fs.writeFile(usersDataPath, `${JSON.stringify(users, null, 2)}\n`);
};

export const findUserByEmail = async (email: string): Promise<LocalUserStoreItem | null> => {
  const users = await readUsersFile();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
};

export const addUser = async (user: LocalUserStoreItem): Promise<LocalUserStoreItem> => {
  const users = await readUsersFile();

  if (users.some((existing) => existing.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error("A user with this email already exists.");
  }

  const nextUsers = [...users, user];
  await writeUsersFile(nextUsers);
  return user;
};
