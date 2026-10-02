# StampField

StampField is a buy-once field photo tool for environmental techs, site inspectors, and small architecture firms. Photos are stamped with GPS (or a manual lat/long), an ISO timestamp, and a short note, then exported as a PDF report or a CSV. Everything stays in the browser. There is no account and no subscription.

Pro is positioned at **$14.99 once**. This demo stores an unlock flag locally and does not take payment.

## Who it is for

People who need a defensible photo of a site condition without an ArcGIS seat or another monthly field app. Typical visits are a folder of photos, a note, and a report.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The field app is at `/field`.

```bash
npm test
npm run build
npm start
```

`npm test` checks the folder-suggestion heuristic, CSV escaping, and Lite quotas. `npm run build` is the production PWA, including the service worker.

No environment variables are required. There is no backend and no `.env`.

## Demo walkthrough

1. Open **Open the field app**. Two sample projects are created in IndexedDB on first launch: Riverside Wetland Survey and Oak Street Facade Check.
2. Open Riverside. You should see two stamped photos, a schematic coordinate plot, and the notes.
3. **Export PDF** and **Export CSV**. The PDF includes the project title, a coordinate plot, and each photo with GPS, time, and note. The CSV is the metadata.
4. Create a project, then **Add photo**. Use the camera, or upload an image. Refresh GPS or turn on manual coordinates. The stamp overlay updates before you save.
5. Type a note such as "hairline crack at the west elevation window". StampField suggests a folder from keywords on the device. Nothing is sent to a model.
6. Gallery filters by project. Open a photo to edit the note or delete it.
7. Settings shows Lite limits (2 projects you create, 4 exports). Sample folders do not count. **Unlock Pro for $14.99** removes the caps on this device only. **Return this device to Lite** puts them back. **Clear local field data** wipes IndexedDB and reloads the samples.

## Offline

Photos, projects, notes, and the Pro flag live in IndexedDB (`stampfield`). They are available offline after the first successful save, even if the app shell is not cached yet.

The service worker is registered in production (`npm run build && npm start`), not during `next dev`, so hot reload is not fighting a cache. After one online visit to the production app, the shell precaches the landing page, projects, capture, gallery, settings, and the offline fallback. Navigations you have not opened yet fall back to `/~offline`. There is no sync.

Install from the browser prompt, or on iPhone use Share → Add to Home Screen. The installed app opens on `/field`.

## Pricing intent

| | Lite | Pro |
| --- | --- | --- |
| Price | $0 | $14.99 once |
| Projects you create | 2 | Unlimited |
| Exports | 4 PDF or CSV downloads | Unlimited |
| Account | None | None |
| Data | This browser | This browser |

The unlock in Settings is a local mock so the gate can be reviewed without a store or Stripe.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, and local UI primitives. Reports use jsPDF in the browser. Offline caching uses Serwist. Keyword folder suggestions are a small word list in `src/lib/suggest.ts`.
