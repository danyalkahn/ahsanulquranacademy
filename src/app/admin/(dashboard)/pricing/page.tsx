import Link from "next/link";
import { prisma } from "@/lib/db";
import DeleteButton from "@/components/admin/delete-button";

export default async function AdminPricingPage() {
  const plans = await prisma.pricingPlan.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Pricing plans</h1>
        <Link
          href="/admin/pricing/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          New plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <p className="text-sm text-muted">No pricing plans yet.</p>
      ) : (
        <div className="space-y-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{plan.name}</span>
                  <span className="text-xs text-muted-2">${plan.price}/{plan.billingPeriod}</span>
                  {plan.highlighted && (
                    <span className="text-[10px] label px-2 py-0.5 rounded-full bg-gold/15 text-gold">
                      Most Popular
                    </span>
                  )}
                  {!plan.published && (
                    <span className="text-[10px] label px-2 py-0.5 rounded-full bg-black/5 text-muted-2">
                      Hidden
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/pricing/${plan.id}`} className="text-sm text-primary hover:underline">
                  Edit
                </Link>
                <DeleteButton endpoint={`/api/admin/pricing/${plan.id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
