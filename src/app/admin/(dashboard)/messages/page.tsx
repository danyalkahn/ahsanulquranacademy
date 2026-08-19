import { prisma } from "@/lib/db";
import MessageActions from "@/components/admin/message-actions";

export default async function AdminMessagesPage() {
  const [messages, trialRequests] = await Promise.all([
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.trialRequest.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold mb-8">Trial requests</h1>
        {trialRequests.length === 0 ? (
          <p className="text-sm text-muted">No trial requests yet.</p>
        ) : (
          <div className="space-y-3">
            {trialRequests.map((t) => (
              <div
                key={t.id}
                className={`rounded-lg border px-5 py-4 ${
                  t.readAt ? "border-border bg-surface" : "border-primary/40 bg-primary/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{t.name}</span>
                      <span className="text-xs text-muted-2">{t.email}</span>
                    </div>
                    <div className="text-xs text-muted-2 mt-0.5">
                      {[t.course, t.preferredPlan, t.phone, t.preferredTime].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  <span className="text-xs text-muted-2 whitespace-nowrap">
                    {t.createdAt.toLocaleString()}
                  </span>
                </div>
                {t.notes && <p className="mt-3 text-sm text-foreground/85 whitespace-pre-wrap">{t.notes}</p>}
                <div className="mt-4">
                  <MessageActions id={t.id} read={Boolean(t.readAt)} endpointBase="trial-requests" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-8">Contact messages</h2>
        {messages.length === 0 ? (
          <p className="text-sm text-muted">No contact submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg border px-5 py-4 ${
                  m.readAt ? "border-border bg-surface" : "border-primary/40 bg-primary/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{m.name}</span>
                      <span className="text-xs text-muted-2">{m.email}</span>
                    </div>
                    <div className="text-xs text-muted-2 mt-0.5">
                      {[m.subject, m.phone].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  <span className="text-xs text-muted-2 whitespace-nowrap">
                    {m.createdAt.toLocaleString()}
                  </span>
                </div>
                <p className="mt-3 text-sm text-foreground/85 whitespace-pre-wrap">{m.message}</p>
                <div className="mt-4">
                  <MessageActions id={m.id} read={Boolean(m.readAt)} endpointBase="messages" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
