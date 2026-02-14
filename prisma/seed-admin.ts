
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'talama112335@gmail.com'
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: Role.ADMIN },
    create: {
      email,
      name: 'Admin Bao',
      role: Role.ADMIN,
      image: 'https://ui-avatars.com/api/?name=Admin+Bao&background=0D8ABC&color=fff'
    },
  })

  console.log({ user })
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
