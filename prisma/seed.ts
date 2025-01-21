import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  // Create superadmin user
  const superadminPassword = await argon2.hash("superadminpassword");

  await prisma.user.upsert({
    where: { emailAddress: "superadmin@example.com" },
    update: {},
    create: {
      firstName: "Super",
      lastName: "Admin",
      emailAddress: "superadmin@example.com",
      password: superadminPassword,
      phoneNumber: "",
      gender: "male",
      role: "superadmin",
    },
  });
}

main()
  .then(() => {
    console.log("Seeding completed.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
