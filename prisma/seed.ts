import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin1234", 10);
  
  await prisma.user.upsert({
    where: { mobile: "9999999999" },
    update: {},
    create: {
      mobile: "9999999999",
      password: adminPassword,
      role: "admin",
    },
  });

  console.log("Admin user created: mobile=9999999999, password=admin1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
