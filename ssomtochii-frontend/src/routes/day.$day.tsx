import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getDay } from "@/lib/days";
import { Botanicals } from "@/components/Botanicals";

export const Route = createFileRoute("/day/$day")({
  loader: ({ params }) => {
    const day = getDay(Number(params.day));
    if (!day) throw notFound();
    return day;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Day ${loaderData?.day ?? ""} · 16 Days of You` },
      { name: "description", content: "Today's little surprise." },
      { property: "og:title", content: `Day ${loaderData?.day ?? ""} · 16 Days of You` },
      { property: "og:description", content: "Today's little surprise." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DayPage,
});

function DayPage() {
  const day = Route.useLoaderData();
  return (
    <main className="page-shell">
      <Botanicals />
      <div className="relative mx-auto w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> All days
        </Link>
        <div className="paper-card mt-6 p-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">DAY {day.day} · {day.label}</p>
          <h1 className="mt-3 font-script text-5xl">Hello, you ♡</h1>
          <p className="mt-4 text-foreground/80">Today's surprise is still being wrapped. Check back soon.</p>
        </div>
      </div>
    </main>
  );
}
