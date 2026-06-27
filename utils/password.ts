import crypto from "crypto";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const HASH_ALGORITHM = "sha512";
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 };

export const hashPassword = (password: string, salt = crypto.randomBytes(SALT_LENGTH).toString("hex")): string => {
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  return `${salt}:${derivedKey.toString("hex")}`;
};

export const verifyPassword = (password: string, storedHash: string): boolean => {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  const storedBuffer = Buffer.from(hash, "hex");
  return crypto.timingSafeEqual(storedBuffer, derivedKey);
};
