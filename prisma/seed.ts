import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.Service.createMany({
    data: [
      { name: 'Gasha WAF', status: 'running' },
      { name: 'Gasha VPN', status: 'running' },
      { name: 'Nisir SIEM', status: 'degraded' },
      { name: 'Enyuma IAM', status: 'running' },
      { name: 'Biometric Protection', status: 'down' },
      { name: 'Gasha Antivirus', status: 'running' },
    ],
  })
}

main()
  .then(() => {
    console.log('Seed completed ✅')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
