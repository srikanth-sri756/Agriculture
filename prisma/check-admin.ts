import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Total users:", users.length);

  users.forEach((user) => {
    console.log(`  - ${user.mobile} (${user.role})`);
  });

  const admin = await prisma.user.findFirst({ where: { role: "admin" } });
  if (admin) {
    console.log("\n✓ Admin user found:");
    console.log("  Mobile:", admin.mobile);
    console.log("  Role:", admin.role);
  } else {
    console.log("\n✗ No admin user found");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
