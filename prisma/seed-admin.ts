
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'talama112335@gmail.com'
  const password = 'admin-password-2026' // The user should change this after first login
  const hashedPassword = await bcrypt.hash(password, 12)
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { 
      role: Role.ADMIN,
      password: hashedPassword 
    },
    create: {
      email,
      name: 'Bao Admin',
      role: Role.ADMIN,
      password: hashedPassword,
      image: 'https://ui-avatars.com/api/?name=Bao+Admin&background=0D8ABC&color=fff'
    },
  })

  console.log("Admin user updated/created:", { id: user.id, email: user.email, role: user.role })
  console.log("TEMPORARY PASSWORD:", password)
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
