import { PrismaClient, Role, CategoryType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // --- Admin User ---
  const passwordHash = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eternidad.com' },
    update: {},
    create: {
      email: 'admin@eternidad.com',
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // --- Categories ---
  const flowerCat = await prisma.category.upsert({
    where: { slug: 'ramos-funebres' },
    update: {},
    create: {
      name: 'Ramos Fúnebres',
      slug: 'ramos-funebres',
      type: CategoryType.PRODUCT,
      description: 'Arreglos florales para ceremonias y homenajes',
    },
  });

  const serviceCat = await prisma.category.upsert({
    where: { slug: 'planes-exequiales' },
    update: {},
    create: {
      name: 'Planes Exequiales',
      slug: 'planes-exequiales',
      type: CategoryType.SERVICE,
      description: 'Planes de previsión exequial familiar e individual',
    },
  });

  const coronaCat = await prisma.category.upsert({
    where: { slug: 'coronas-florales' },
    update: {},
    create: {
      name: 'Coronas Florales',
      slug: 'coronas-florales',
      type: CategoryType.PRODUCT,
      description: 'Coronas para velorios y ceremonias de despedida',
    },
  });
  console.log(`✅ Categories: ${flowerCat.name}, ${serviceCat.name}, ${coronaCat.name}`);

  // --- Products ---
  const products = [
    {
      name: 'Ramo de Rosas Blancas',
      slug: 'ramo-rosas-blancas',
      description: 'Elegante ramo de 24 rosas blancas con follaje verde',
      price: 85000,
      categoryId: flowerCat.id,
      sortOrder: 1,
    },
    {
      name: 'Ramo de Lirios y Claveles',
      slug: 'ramo-lirios-claveles',
      description: 'Combinación de lirios blancos y claveles rojos',
      price: 120000,
      categoryId: flowerCat.id,
      sortOrder: 2,
    },
    {
      name: 'Corona Imperial',
      slug: 'corona-imperial',
      description: 'Corona grande con rosas, lirios y crisantemos',
      price: 250000,
      categoryId: coronaCat.id,
      sortOrder: 1,
    },
    {
      name: 'Plan Exequial Familiar',
      slug: 'plan-exequial-familiar',
      description: 'Cobertura exequial para toda la familia, hasta 6 beneficiarios',
      price: 45000,
      categoryId: serviceCat.id,
      sortOrder: 1,
    },
    {
      name: 'Plan Exequial Individual',
      slug: 'plan-exequial-individual',
      description: 'Plan de previsión exequial individual con servicios completos',
      price: 25000,
      categoryId: serviceCat.id,
      sortOrder: 2,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log(`✅ Products: ${products.length} created`);

  // --- Branches ---
  const branches = [
    {
      name: 'Sede Principal Tunja',
      address: 'Calle 20 #10-45, Centro',
      city: 'Tunja',
      department: 'Boyacá',
      latitude: 5.5353,
      longitude: -73.3678,
      contactPhone: '3001234567',
      contactEmail: 'tunja@eternidad.com',
    },
    {
      name: 'Sede Bucaramanga',
      address: 'Carrera 27 #36-12, Cabecera',
      city: 'Bucaramanga',
      department: 'Santander',
      latitude: 7.1254,
      longitude: -73.1198,
      contactPhone: '3009876543',
      contactEmail: 'bucaramanga@eternidad.com',
    },
  ];

  for (const branch of branches) {
    const existing = await prisma.branch.findFirst({
      where: { name: branch.name },
    });
    if (!existing) {
      await prisma.branch.create({ data: branch });
    }
  }
  console.log(`✅ Branches: ${branches.length} created`);

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
