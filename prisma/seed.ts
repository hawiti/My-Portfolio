import { PrismaClient } from '@prisma/client'
import { initialData } from '../src/lib/data'

const db = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)
  
  // We are creating a single portfolio record with a fixed ID of 1.
  // This makes it easy to query for later.
  await db.portfolio.upsert({
      where: { id: 1 },
      update: { data: initialData },
      create: { id: 1, data: initialData },
  })

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
