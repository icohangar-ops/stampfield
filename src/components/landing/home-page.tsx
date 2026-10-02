import Link from "next/link";
import { Mark } from "@/components/brand/mark";
import { Button } from "@/components/ui/button";
import { LITE_EXPORT_LIMIT, LITE_PROJECT_LIMIT, PRO_PRICE } from "@/lib/constants";

const steps = [
  {
    title: "Open a folder",
    body: "One project per site visit. Rename it in the truck. Delete it when the job file is exported.",
  },
  {
    title: "Stamp the shot",
    body: "GPS when the browser can get a fix, or type the lat/long from the instrument. ISO time and a short note sit on the photo.",
  },
  {
    title: "Leave with a report",
    body: "PDF for the job folder. CSV if the coordinates need to land in a spreadsheet. Both are built on this device.",
  },
];

const audiences = [
  {
    title: "Environmental techs",
    body: "Wetland banks, culverts, and sediment flags without standing up an ArcGIS project for six photos.",
  },
  {
    title: "Site inspectors",
    body: "A crack, a guardrail, a curb — stamped and noted before the next pour covers the evidence.",
  },
  {
    title: "Small architecture firms",
    body: "Facade checks for a two-person office that does not want another monthly seat.",
  },
];

export function HomePage() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring">
            <Mark />
          </Link>
          <nav aria-label="Page" className="flex items-center gap-2">
            <a href="#pricing" className="hidden min-h-11 items-center px-2 text-sm sm:inline-flex">
              Pricing
            </a>
            <Button asChild className="min-h-11">
              <Link href="/field">Open the field app</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-center lg:py-20">
          <div className="space-y-5">
            <p className="font-mono text-xs tracking-[0.18em] text-[#9a3412]">
              BUY ONCE · {PRO_PRICE} · NO SUBSCRIPTION
            </p>
            <h1 className="font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              Field photos with a stamp you can defend.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              StampField is for people who photograph a site, write four words,
              and need the GPS and the time still attached when they get back.
              Lite works with no account. Pro is a one-time unlock.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="min-h-11">
                <Link href="/field">Try the sample surveys</Link>
              </Button>
              <Button asChild variant="outline" className="min-h-11">
                <a href="#pricing">See Lite and Pro</a>
              </Button>
            </div>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="relative aspect-[4/3] bg-gradient-to-b from-[#b7cbb0] via-[#6e8f78] to-[#3f4d32]" aria-hidden="true">
              <div className="absolute left-[18%] top-[62%] h-16 w-2 bg-[#c2410c]" />
              <div className="absolute left-[calc(18%+8px)] top-[62%] h-0 w-0 border-y-[12px] border-l-[28px] border-y-transparent border-l-[#c2410c]" />
              <div className="absolute inset-x-0 bottom-0 bg-[#141311]/80 px-3 py-2 font-mono text-[11px] text-[#f6f3ec] sm:text-xs">
                <div className="flex justify-between tracking-[0.14em] text-[#f3b08a]">
                  <span>STAMPFIELD</span>
                  <span>DEVICE GPS</span>
                </div>
                <p className="mt-1">47.65120, -122.34890 ±6 m</p>
                <p>2026-09-18T15:42:11.000Z</p>
                <p className="mt-1 text-[#f6f3ec]/90">North bank, sparse cattail cover after drawdown.</p>
              </div>
            </div>
            <figcaption className="px-4 py-3 text-sm text-muted-foreground">
              Sample stamp from the Riverside Wetland Survey already loaded in the app.
            </figcaption>
          </figure>
        </section>

        <section className="border-y border-border bg-card/70" aria-labelledby="problem-heading">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 id="problem-heading" className="font-heading text-3xl tracking-tight">
                The other tools assume a GIS seat.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Offline GPS stamps usually arrive inside an ArcGIS subscription
                or a field app that bills every month. A lot of visits are a
                folder of photos, a note, and a PDF.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3">
              {audiences.map((item) => (
                <li key={item.title} className="rounded-xl border border-border bg-background p-4">
                  <h3 className="font-heading text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12" aria-labelledby="how-heading">
          <h2 id="how-heading" className="font-heading text-3xl tracking-tight">
            Three steps, then you are done.
          </h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-border p-4">
                <p className="font-mono text-xs text-[#9a3412]">0{index + 1}</p>
                <h3 className="mt-2 font-heading text-xl">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="pricing" className="border-t border-border bg-card/70" aria-labelledby="pricing-heading">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 id="pricing-heading" className="font-heading text-3xl tracking-tight">
              One price. Not a plan.
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              The demo stores an unlock flag in this browser. No card is charged.
              The product intent is a single {PRO_PRICE} purchase.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-border bg-background p-5">
                <h3 className="font-heading text-2xl">Lite</h3>
                <p className="mt-1 font-mono text-sm">$0</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>{LITE_PROJECT_LIMIT} projects you create, plus sample folders</li>
                  <li>GPS or manual coordinates, ISO time, notes</li>
                  <li>{LITE_EXPORT_LIMIT} PDF or CSV exports</li>
                  <li>Offline after the app is cached</li>
                  <li>No account</li>
                </ul>
              </article>
              <article className="rounded-xl border-2 border-[#9a3412] bg-background p-5">
                <h3 className="font-heading text-2xl">Pro</h3>
                <p className="mt-1 font-mono text-sm">{PRO_PRICE} once</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>Unlimited projects</li>
                  <li>Unlimited PDF and CSV exports</li>
                  <li>Same local photos. Nothing new to subscribe to.</li>
                  <li>Unlock stays on this device until you clear site data</li>
                </ul>
                <Button asChild className="mt-5 min-h-11">
                  <Link href="/field/settings">Review the unlock</Link>
                </Button>
              </article>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>StampField keeps photos in this browser. There is no cloud sync.</p>
          <p>MIT licensed. Not a survey instrument.</p>
        </div>
      </footer>
    </div>
  );
}
