import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PricingForm from "@/components/admin/pricing-form";

export default async function EditPricingPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await prisma.pricingPlan.findUnique({ where: { id: Number(id) } });
  if (!plan) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Edit pricing plan</h1>
      <PricingForm
        initial={{
          id: plan.id,
          slug: plan.slug,
          name: plan.name,
          tagline: plan.tagline,
          price: plan.price,
          billingPeriod: plan.billingPeriod,
          classesPerWeek: plan.classesPerWeek,
          classesPerMonth: plan.classesPerMonth,
          minutesPerClass: plan.minutesPerClass,
          altPricingNote: plan.altPricingNote,
          features: Array.isArray(plan.features) ? (plan.features as string[]) : [],
          highlighted: plan.highlighted,
          ctaLabel: plan.ctaLabel,
          published: plan.published,
          sortOrder: plan.sortOrder,
        }}
      />
    </div>
  );
}
