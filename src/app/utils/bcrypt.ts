import bcrypt from "bcryptjs";

export const BcryptHelper = {
  hashPassword: async (plain: string, saltRounds = 10): Promise<string> => {
    return await bcrypt.hash(plain, saltRounds);
  },

  comparePassword: async (plain: string, hashed: string): Promise<boolean> => {
    return await bcrypt.compare(plain, hashed);
  },
};
