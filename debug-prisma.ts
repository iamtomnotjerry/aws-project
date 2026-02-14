
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Checking User model fields in Prisma Client...")
  // We can't easily list fields from the type system at runtime, 
  // but we can try to access them and see what happens or use the dmmf if available.
  
  // @ts-ignore
  const dmmf = (prisma as any)._dmmf;
  if (dmmf) {
    const userModel = dmmf.datamodel.models.find((m: any) => m.name === 'User');
    if (userModel) {
      console.log("Fields in User model:", userModel.fields.map((f: any) => f.name));
    } else {
      console.log("User model not found in DMMF!");
    }
  } else {
    console.log("DMMF not available.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
