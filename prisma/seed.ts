import { PrismaClient } from '@prisma/client'
import { initialData } from '../src/lib/data'

const db = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)
  
  // Use a transaction to ensure all or nothing is written
  await db.$transaction(async (prisma) => {
    // Clean up existing data to make seeding idempotent
    // The cascade delete is not set up, so we delete from child to parent
    await prisma.skill.deleteMany({ where: { portfolioId: 1 } });
    await prisma.project.deleteMany({ where: { portfolioId: 1 } });
    await prisma.experience.deleteMany({ where: { portfolioId: 1 } });
    await prisma.education.deleteMany({ where: { portfolioId: 1 } });
    await prisma.portfolio.deleteMany({ where: { id: 1 } });

    // Create the portfolio
    const portfolio = await prisma.portfolio.create({
      data: {
        id: 1,
        name: initialData.name,
        photoUrl: initialData.photoUrl,
        title: initialData.title,
        aboutMe: initialData.aboutMe,
        summary: initialData.summary,
      },
    });

    // Create skills
    if (initialData.skills.length) {
      await prisma.skill.createMany({
        data: initialData.skills.map((skill) => ({
          name: skill,
          portfolioId: portfolio.id,
        })),
      });
    }

    // Create projects
    if (initialData.projects.length) {
      await prisma.project.createMany({
        data: initialData.projects.map((p) => ({
          title: p.title,
          description: p.description,
          imageUrl: p.imageUrl,
          link: p.link,
          tags: p.tags,
          portfolioId: portfolio.id,
        })),
      });
    }
    
    // Create experiences
    if (initialData.experiences.length) {
      await prisma.experience.createMany({
        data: initialData.experiences.map((e) => ({
          role: e.role,
          company: e.company,
          period: e.period,
          responsibilities: e.responsibilities,
          portfolioId: portfolio.id,
        })),
      });
    }

    // Create educations
    if (initialData.educations.length) {
        await prisma.education.createMany({
            data: initialData.educations.map((e) => ({
                institution: e.institution,
                degree: e.degree,
                period: e.period,
                portfolioId: portfolio.id,
            }))
        });
    }
  });

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
