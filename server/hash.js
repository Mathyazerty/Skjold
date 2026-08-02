import bcrypt from "bcrypt";

const run = async () => {
  const hash = await bcrypt.hash("PavaAdmin2026!", 10);
  console.log("HASH :", hash);
};

run();
