import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { getDatabaseUrl } from "../src/lib/database-url";

const adapter = new PrismaMariaDb(getDatabaseUrl());
const prisma = new PrismaClient({ adapter });

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (!email || !initialPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD must be set in .env before seeding the admin user"
    );
  }
  if (initialPassword.length < 8) {
    throw new Error("ADMIN_INITIAL_PASSWORD is too short");
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists, skipping seed.`);
    return;
  }

  const passwordHash = await bcrypt.hash(initialPassword, 12);
  await prisma.adminUser.create({ data: { email, passwordHash } });
  console.log(`Created admin user ${email}. Sign in and consider rotating this password.`);
}

const genericFaqs = (title: string) => [
  {
    question: `Who is ${title} for?`,
    answer:
      "Students of all levels, from complete beginners to those looking to build on existing knowledge. Every class is paced to the individual student.",
  },
  {
    question: "How long is each class?",
    answer: "Classes are 30 minutes by default, with a 60-minute option available on every plan.",
  },
  {
    question: "Can I try a class before committing?",
    answer: "Yes — every plan includes a free trial class with no obligation to continue.",
  },
];

async function seedCourses() {
  const count = await prisma.course.count();
  if (count > 0) {
    console.log("Courses already exist, skipping course seed.");
    return;
  }

  const courses = [
    {
      slug: "online-quran-classes-for-kids",
      title: "Online Quran Classes for Kids",
      shortDescription:
        "Fun, patient, one-on-one Quran reading classes for children — building strong foundations with certified teachers experienced in working with kids.",
      contentHtml:
        "<p>Our Online Quran Classes for Kids are designed to make learning the Quran engaging and enjoyable for young students. Each class is one-on-one, so your child gets the teacher's full attention, taught at a pace that keeps them confident and motivated.</p><p>Our teachers are experienced in working with children and use interactive, age-appropriate methods to teach correct pronunciation and reading from day one.</p>",
      icon: "🧒",
      faqs: genericFaqs("Quran Classes for Kids"),
      sortOrder: 1,
    },
    {
      slug: "online-tajweed-classes",
      title: "Online Tajweed Classes",
      shortDescription:
        "Master the rules of Tajweed to recite the Quran correctly and beautifully, with certified Tajweed teachers guiding every session.",
      contentHtml:
        "<p>Tajweed is the science of correct Quranic pronunciation. In our Online Tajweed Classes, students learn the rules of articulation, elongation and pausing through structured, one-on-one lessons with certified teachers.</p><p>Whether you're refining an existing recitation or starting from scratch, our teachers build a personalized study plan for your level.</p>",
      icon: "📖",
      faqs: genericFaqs("Tajweed Classes"),
      sortOrder: 2,
    },
    {
      slug: "online-hifz-program",
      title: "Online Hifz Program",
      shortDescription:
        "A structured memorization program with revision tracking, helping students memorize the Quran with strong retention and correct Tajweed.",
      contentHtml:
        "<p>Our Online Hifz Program guides students through Quran memorization using proven revision techniques and consistent, one-on-one accountability with a dedicated teacher.</p><p>Every session includes new memorization, recent revision and long-term revision (Sabaq, Sabqi, Manzil) to ensure what's memorized stays memorized.</p>",
      icon: "🕋",
      faqs: genericFaqs("Hifz Program"),
      sortOrder: 3,
    },
    {
      slug: "online-quran-classes-for-adults",
      title: "Online Quran Classes for Adults",
      shortDescription:
        "Flexible, judgment-free Quran reading classes for adult beginners and those looking to refresh their recitation, on a schedule that fits your life.",
      contentHtml:
        "<p>It's never too late to learn the Quran. Our Online Quran Classes for Adults are one-on-one, flexible around work and family life, and taught at a pace that respects where you're starting from.</p><p>Many of our adult students start with little to no reading ability — our teachers specialize in building confidence from the very first class.</p>",
      icon: "👤",
      faqs: genericFaqs("Quran Classes for Adults"),
      sortOrder: 4,
    },
    {
      slug: "online-noorani-qaida-classes",
      title: "Online Noorani Qaida Classes",
      shortDescription:
        "The essential first step for absolute beginners — learn the Arabic alphabet and basic reading rules before moving into full Quran recitation.",
      contentHtml:
        "<p>Noorani Qaida is the foundation for reading the Quran correctly. Our Online Noorani Qaida Classes take complete beginners — kids and adults alike — through the Arabic alphabet, letter joining, and basic Tajweed rules step by step.</p><p>Once a student completes Qaida, they're ready to move confidently into full Quran recitation.</p>",
      icon: "🔤",
      faqs: genericFaqs("Noorani Qaida Classes"),
      sortOrder: 5,
    },
    {
      slug: "quran-classes-for-new-muslims",
      title: "Quran Classes for New Muslims",
      shortDescription:
        "A welcoming, judgment-free introduction to reading the Quran and understanding the basics of prayer and Islamic practice for new Muslims.",
      contentHtml:
        "<p>Our Quran Classes for New Muslims are designed specifically for those who have recently accepted Islam and want to learn to read the Quran and understand the basics of worship in a supportive, patient environment.</p><p>Classes cover Arabic letters, basic Quran reading, and the essentials of Salah (prayer), all one-on-one with a teacher experienced in guiding new Muslims.</p>",
      icon: "🌙",
      faqs: genericFaqs("Classes for New Muslims"),
      sortOrder: 6,
    },
    {
      slug: "learn-arabic-online",
      title: "Learn Arabic Online",
      shortDescription:
        "Build real Arabic language skills — reading, writing, vocabulary and grammar — with lessons tailored to your goals, from Quranic Arabic to conversational fluency.",
      contentHtml:
        "<p>Our Learn Arabic Online course covers reading, writing, grammar and vocabulary, tailored to your goals — whether that's understanding the Quran in its original language or building everyday conversational skills.</p><p>Lessons are one-on-one and paced to your progress, with a personalized curriculum built around what you want to achieve.</p>",
      icon: "📚",
      faqs: genericFaqs("Learn Arabic Online"),
      sortOrder: 7,
    },
    {
      slug: "online-islamic-studies-classes",
      title: "Online Islamic Studies Classes",
      shortDescription:
        "Learn the fundamentals of Islamic belief, worship, history and character through structured, age-appropriate Islamic Studies lessons.",
      contentHtml:
        "<p>Our Online Islamic Studies Classes cover core topics including Aqeedah (belief), Fiqh (jurisprudence), Seerah (biography of the Prophet ﷺ), and Akhlaq (character) — taught one-on-one and adapted to the student's age and level.</p><p>These classes work well alongside our Quran or Hifz programs, or as a standalone course for building Islamic knowledge.</p>",
      icon: "🕌",
      faqs: genericFaqs("Islamic Studies Classes"),
      sortOrder: 8,
    },
  ];

  await prisma.course.createMany({ data: courses });
  console.log(`Seeded ${courses.length} courses.`);
}

async function seedPricingPlans() {
  const count = await prisma.pricingPlan.count();
  if (count > 0) {
    console.log("Pricing plans already exist, skipping pricing seed.");
    return;
  }

  await prisma.pricingPlan.createMany({
    data: [
      {
        slug: "foundation",
        name: "Foundation",
        tagline: "For complete beginners taking their first step",
        price: 40,
        billingPeriod: "month",
        classesPerWeek: 2,
        classesPerMonth: 8,
        minutesPerClass: 30,
        altPricingNote: "Prefer 60-minute classes? $72/month",
        features: [
          "One-on-one live sessions",
          "Certified teacher",
          "Flexible scheduling",
          "Progress tracking",
          "Free trial class included",
        ],
        highlighted: false,
        ctaLabel: "Start Free Trial",
        sortOrder: 1,
      },
      {
        slug: "steady",
        name: "Steady",
        tagline: "For serious students committed to consistent growth",
        price: 55,
        billingPeriod: "month",
        classesPerWeek: 3,
        classesPerMonth: 12,
        minutesPerClass: 30,
        altPricingNote: "Prefer 60-minute classes? $99/month",
        features: [
          "One-on-one live sessions",
          "Certified teacher",
          "Flexible scheduling",
          "Priority teacher matching",
          "Monthly progress report",
          "Free trial class included",
        ],
        highlighted: true,
        ctaLabel: "Start Free Trial",
        sortOrder: 2,
      },
      {
        slug: "immersion",
        name: "Immersion",
        tagline: "For dedicated learners who want fast, steady progress",
        price: 85,
        billingPeriod: "month",
        classesPerWeek: 5,
        classesPerMonth: 20,
        minutesPerClass: 30,
        altPricingNote: "Prefer 60-minute classes? $153/month",
        features: [
          "One-on-one live sessions",
          "Premium certified teacher",
          "Flexible scheduling",
          "Priority support",
          "Weekly progress reports",
          "Parent updates",
          "Free trial class included",
        ],
        highlighted: false,
        ctaLabel: "Start Free Trial",
        sortOrder: 3,
      },
    ],
  });
  console.log("Seeded 3 pricing plans.");
}

async function seedReviews() {
  const count = await prisma.review.count();
  if (count > 0) {
    console.log("Reviews already exist, skipping review seed.");
    return;
  }

  await prisma.review.createMany({
    data: [
      {
        clientName: "Amina R.",
        role: "Parent",
        quote:
          "My daughter looks forward to her Quran classes every week. Her teacher is patient and really knows how to keep a 7-year-old engaged.",
        rating: 5,
        sortOrder: 1,
      },
      {
        clientName: "Yusuf K.",
        role: "Adult student",
        quote:
          "I started with zero reading ability as an adult and felt nervous about it. My teacher never made me feel behind — just steady, encouraging progress.",
        rating: 5,
        sortOrder: 2,
      },
      {
        clientName: "Sarah M.",
        role: "Parent",
        quote:
          "The scheduling flexibility is what sold us, but the quality of teaching is why we stayed. Highly recommend the Hifz program.",
        rating: 5,
        sortOrder: 3,
      },
    ],
  });
  console.log("Seeded 3 reviews.");
}

async function main() {
  await seedAdminUser();
  await seedCourses();
  await seedPricingPlans();
  await seedReviews();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
