import { Role } from "../src/generated/prisma/enums.js";
import { prisma } from "../src/helper/prisma.js";

const providers = [
  {
    email: "ada.cleaner@example.com",
    first_name: "Ada",
    last_name: "Okafor",
    category: "Cleaning",
    city: "Lagos",
    bio: "Home and office cleaning in Lagos.",
    hourly_rate_minor: 500000,
    services: [
      { title: "Standard Home Cleaning", description: "A thorough clean for a small home.", price_minor: 750000, duration_minutes: 120 },
      { title: "Deep Cleaning", description: "Detailed cleaning for kitchens and bathrooms.", price_minor: 1500000, duration_minutes: 240 },
      { title: "Office Cleaning", description: "Routine cleaning for a small office.", price_minor: 950000, duration_minutes: 180 },
    ],
  },
  {
    email: "bisi.cleaner@example.com",
    first_name: "Bisi",
    last_name: "Adeleke",
    category: "Cleaning",
    city: "Abuja",
    bio: "Reliable residential cleaner serving Abuja.",
    hourly_rate_minor: 450000,
    services: [
      { title: "Apartment Cleaning", description: "Cleaning for a one or two bedroom apartment.", price_minor: 800000, duration_minutes: 150 },
      { title: "Move Out Cleaning", description: "A full clean before handing over a property.", price_minor: 1800000, duration_minutes: 300 },
    ],
  },
  {
    email: "chidi.mechanic@example.com",
    first_name: "Chidi",
    last_name: "Eze",
    category: "Mechanics",
    city: "Lagos",
    bio: "Mobile mechanic for routine servicing and repairs.",
    hourly_rate_minor: 700000,
    services: [
      { title: "Oil Change", description: "Engine oil and oil filter replacement.", price_minor: 900000, duration_minutes: 60 },
      { title: "Brake Inspection", description: "Inspection of brake pads, discs, and fluid.", price_minor: 600000, duration_minutes: 45 },
      { title: "Battery Replacement", description: "Battery test and replacement service.", price_minor: 1200000, duration_minutes: 45 },
      { title: "Vehicle Diagnostics", description: "Computer diagnostics and fault report.", price_minor: 1000000, duration_minutes: 60 },
    ],
  },
  {
    email: "damilola.mechanic@example.com",
    first_name: "Damilola",
    last_name: "Bello",
    category: "Mechanics",
    city: "Ibadan",
    bio: "Car maintenance and roadside support in Ibadan.",
    hourly_rate_minor: 650000,
    services: [
      { title: "Routine Car Service", description: "Basic inspection, fluids, and filter checks.", price_minor: 1400000, duration_minutes: 120 },
      { title: "Roadside Assessment", description: "On-site assessment when a vehicle breaks down.", price_minor: 850000, duration_minutes: 60 },
      { title: "Tyre Change", description: "Safe replacement of a damaged tyre.", price_minor: 500000, duration_minutes: 30 },
    ],
  },
  {
    email: "efe.tutor@example.com",
    first_name: "Efe",
    last_name: "Ighodaro",
    category: "Tutoring",
    city: "Abuja",
    bio: "Mathematics tutor for secondary school students.",
    hourly_rate_minor: 400000,
    services: [
      { title: "Junior Mathematics", description: "One hour lesson for junior secondary students.", price_minor: 400000, duration_minutes: 60 },
      { title: "WAEC Mathematics", description: "Exam preparation with worked past questions.", price_minor: 600000, duration_minutes: 90 },
      { title: "Homework Support", description: "Guided help with weekly mathematics homework.", price_minor: 350000, duration_minutes: 60 },
    ],
  },
  {
    email: "fatima.tutor@example.com",
    first_name: "Fatima",
    last_name: "Musa",
    category: "Tutoring",
    city: "Lagos",
    bio: "English language tutor for children and adults.",
    hourly_rate_minor: 450000,
    services: [
      { title: "English Grammar", description: "Practical grammar lesson with exercises.", price_minor: 450000, duration_minutes: 60 },
      { title: "Reading Practice", description: "Reading and comprehension support for children.", price_minor: 400000, duration_minutes: 60 },
    ],
  },
  {
    email: "grace.cleaner@example.com",
    first_name: "Grace",
    last_name: "Nwosu",
    category: "Cleaning",
    city: "Ibadan",
    bio: "Flexible cleaning appointments for busy households.",
    hourly_rate_minor: 420000,
    services: [
      { title: "Kitchen Cleaning", description: "Cleaning for kitchen surfaces and appliances.", price_minor: 650000, duration_minutes: 90 },
      { title: "Bathroom Cleaning", description: "Deep cleaning and sanitising for bathrooms.", price_minor: 550000, duration_minutes: 75 },
      { title: "Weekly Home Cleaning", description: "Scheduled weekly cleaning for the whole home.", price_minor: 1000000, duration_minutes: 180 },
    ],
  },
  {
    email: "hassan.mechanic@example.com",
    first_name: "Hassan",
    last_name: "Garba",
    category: "Mechanics",
    city: "Abuja",
    bio: "Experienced mechanic specialising in electrical faults.",
    hourly_rate_minor: 750000,
    services: [
      { title: "Electrical Fault Check", description: "Diagnosis of vehicle electrical problems.", price_minor: 950000, duration_minutes: 75 },
      { title: "Alternator Repair", description: "Alternator inspection and minor repair.", price_minor: 1600000, duration_minutes: 150 },
      { title: "Starter Motor Check", description: "Starter system test and diagnosis.", price_minor: 800000, duration_minutes: 60 },
      { title: "Fuse Replacement", description: "Find and replace a failed vehicle fuse.", price_minor: 300000, duration_minutes: 30 },
    ],
  },
] as const;

async function seed(): Promise<void> {
  for (const providerData of providers) {
    const user = await prisma.user.upsert({
      where: { email: providerData.email },
      update: {
        first_name: providerData.first_name,
        last_name: providerData.last_name,
        role: Role.PROVIDER,
      },
      create: {
        email: providerData.email,
        first_name: providerData.first_name,
        last_name: providerData.last_name,
        role: Role.PROVIDER,
      },
    });

    const profile = await prisma.providerProfile.upsert({
      where: { userId: user.id },
      update: {
        bio: providerData.bio,
        category: providerData.category,
        city: providerData.city,
        hourly_rate_minor: providerData.hourly_rate_minor,
      },
      create: {
        userId: user.id,
        bio: providerData.bio,
        category: providerData.category,
        city: providerData.city,
        hourly_rate_minor: providerData.hourly_rate_minor,
      },
    });

    await prisma.service.deleteMany({ where: { providerId: profile.id } });
    await prisma.service.createMany({
      data: providerData.services.map(service => ({ ...service, providerId: profile.id })),
    });
  }

  console.log(`Seeded ${providers.length} providers.`);
}

seed()
  .catch(error => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
