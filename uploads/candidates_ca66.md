# Product Hunt Problems — Candidates from Reddit & X
**Research date:** Fri Oct 2, 2026 (ET)  
**Grounded in shipped DNA:** RoomiePlate · AfterMerge · FieldSight · FieldClear · Ship Pack Notes · Cubiczan/icohangar-ops  
**Rule:** new custom repos only — do not rebuild the same demos.

---

## Recommended FIRST build

### **JobProof** — photo + voice → proof-of-work PDF for solo / micro crews

**Why first**
1. **Clear willingness to pay** — contractors already pay $99–$249/mo for CompanyCam *alone*, and $400–$700+/mo for Jobber + CompanyCam stacks. A $19–$29/mo (or $99 lifetime) wedge undercuts that without fighting full FSM incumbents.
2. **Maps directly to FieldClear + FieldSight** — field photos, job notes, contractor workflow — without becoming another Jobber.
3. **1-week MVP is honest** — phone PWA: job → before/after photos → 30s voice note → PDF report + share link. Stripe. Done.
4. **Distribution is free** — post in r/Contractor, r/handyman, r/WhichCRM where people are *actively* asking for cheaper photo+job tools this year.

**Do not build:** full scheduling CRM, GPS fleet, quoting engine. That is the overserved trap.

---

## Ranked top recommendations (buildable in days)

| Rank | Product | Problem (1 sentence) | Who | Stack fit | 1-week MVP | Monetization |
|------|---------|----------------------|-----|-----------|------------|--------------|
| **1** | **JobProof** | Solo/small crews need before/after photos + notes tied to a job *without* paying for CompanyCam + Jobber. | Handymen, landscapers, cleaners, 1–5 person shops | FieldClear + FieldSight | PWA: jobs, photo capture, voice→text note, PDF export, magic-link share | $19/mo or $99 lifetime; upsell SMS send |
| **2** | **MenuAller** | People with severe allergies cannot trust chain lists or barcode apps; they need *this menu photo* checked against *their* allergens. | Peanut/tree-nut/dairy families who eat out | RoomiePlate (allergen + local Gemma/Ollama) | iOS/web: set allergens → photo menu → local or edge OCR → green/yellow/red dishes + “ask server” questions | $4.99/mo family; free 5 scans |
| **3** | **ChainSafe** | Allergy communities keep reinventing “safe/unsafe fast food” lists that go stale and contradict each other. | r/peanutallergy parents & travelers | RoomiePlate domain; community data | Web app: allergen + city → crowd reports + last-verified date + source link; seed from public threads | Free read; $2.99/mo to submit+alerts; B2B chain badge later |
| **4** | **ShipText Voice** | Indie founders rewrite the same “what we shipped” into email/X/changelog and still leave users asking “any updates?” | Solo SaaS / AfterMerge-adjacent builders | AfterMerge DNA (post-ship) | Paste 2 sentences *or* 45s voice memo → drafts for email, X, changelog, Slack | $9/mo; free 3 gens |
| **5** | **StampField** | Field scientists / inspectors hate monthly photo apps; they want GPS+timestamp+notes+PDF once. | Env techs, site inspectors, architects | FieldSight | Mobile: stamp GPS/time, project folders, PDF/CSV export; offline | **$14.99 one-time** (explicit anti-sub) |
| **6** | **FridgeGuard** | Shared kitchens with allergies run on post-its and hope; roommates forget labels and cross-contaminate. | College/apartment roommates with FA | RoomiePlate | Shared house profile: allergens, labeled fridge zones, grocery “mine/ours”, push when allergen restocked | Free for 2; $2.99/mo house |
| **7** | **CarePack** | Generic packing lists miss *medical* trip reality: epi-pens, meds, allergen snacks, school forms. | Allergy parents traveling | Ship Pack Notes DNA (not a clone) | Trip type → medical checklist templates + “leave-by” reminder + share with co-parent | $3.99/trip or $19.99/yr |

---

## Supporting evidence table

| # | Link | Source date (approx) | Short quote / signal | Maps to |
|---|------|----------------------|----------------------|---------|
| 1 | [r/CRM — Jobber scam?](https://www.reddit.com/r/CRM/comments/1r8muam/is_jobber_a_scam_crm_or_am_i_over_reacting/) | ~Feb 19, 2026 | “CompanyCam. About 99 a month… We’re sitting somewhere between **400 and 700 a month** in software… I wish someone would’ve just been straight up about the real stacked cost” | JobProof |
| 2 | [r/WhichCRM — CompanyCam + Jobber](https://www.reddit.com/r/WhichCRM/comments/1pim52p/best_alternative_for_company_cam_jobber/) | ~Dec 9, 2025 | “paying **$700+ a month** between CompanyCam and Jobber… death by a thousand subscriptions” | JobProof |
| 3 | [r/Contractor — disappointed with Jobber](https://www.reddit.com/r/Contractor/comments/1qk5y04/im_really_disappointed_with_jobber/) | ~Jan 22, 2026 | “nickel and dime you for every little thing… paying **$267 a month**”; comment: “proof of work photos can be attached to invoices… No upsells, no need for 3rd party apps” | JobProof |
| 4 | [r/Contractor comment culture](https://www.reddit.com/r/Contractor/comments/1qk5y04/im_really_disappointed_with_jobber/) | Jan 2026 | “you’d be better off writing job notes on a 2x4 — at least you get to keep them… your own photos, notes, and history don’t actually belong to you” | JobProof (data ownership angle) |
| 5 | [r/peanutallergy — safe/unsafe list](https://www.reddit.com/r/peanutallergy/comments/1q49ysv/can_anyone_make_an_updated_safeunsafe_fast/) | ~Jan 5, 2026 | OP asks for **updated** safe/unsafe fast food list; community debates Sonic (“loose peanuts… no ability to control cross contamination”), Cava contradictions | ChainSafe |
| 6 | [r/FoodAllergies — tracking apps](https://www.reddit.com/r/FoodAllergies/comments/1ojwj6m/how_are_you_tracking_your_food_allergens_do_you/) | ~Oct 30, 2025 | “Every time I’ve tried a scan barcode app, it either **flags things that aren’t an issue or misses things that are**”; “I really wish it would expand into **restaurant menus**” | MenuAller |
| 7 | [r/FoodAllergies — allergen menus](https://www.reddit.com/r/FoodAllergies/comments/1q9iayf/allergen_menus/) | ~2026 | Want ingredient lists broken out by component + cross-contamination notes; hate peanut+tree-nut lumped as “nuts” | MenuAller / ChainSafe |
| 8 | [r/FoodAllergies — apps helpful?](https://www.reddit.com/r/FoodAllergies/comments/1roh7ju/are_there_any_apps_for_people_with_food_allergies/) | ~Mar 8, 2026 | Users cite Fig/Spokin gaps; others use menu-photo AI (Niblu/stufficaneat) — validates *menu photo* wedge over barcode DB | MenuAller |
| 9 | [X — Elizajade1984](https://x.com/Elizajade1984/status/1875226903931711518) | Jan 3, 2025 | “I wish there was more transparency with online menus such as adding **allergen information**… rather than the customer having to contact the restaurant all the time” | MenuAller |
| 10 | [r/Environmental_Careers — field pictures](https://www.reddit.com/r/Environmental_Careers/comments/1s3j53n/what_app_are_you_using_for_field_pictures/) | ~Mar 25, 2026 | Builder of JotCam: “full featured professional field photo app but with **no monthly subscription**. Probably gonna charge like **$10-15 one time**… I just hate subscriptions” | StampField |
| 11 | [r/Architects — field reports](https://www.reddit.com/r/Architects/comments/1qva88g/app_for_field_reports/) | ~2026 | “I wish there was a more basic interface for snapping pictures and notes for quick on-site input” (vs expensive Autodesk) | StampField / JobProof |
| 12 | [r/indiehackers — ShipText](https://www.reddit.com/r/indiehackers/comments/1plsgxp/built_a_tiny_tool_that_turns_1_product_update/) | ~Dec 13, 2025 | “I was tired of rewriting the same product update for X, email, changelog, Product Hunt, LinkedIn…” | ShipText Voice |
| 13 | [X — Changesmith / MrPhilGames](https://x.com/MrPhilGames/status/2026036592846991433) | Feb 23, 2026 | “Solo devs tired of writing changelogs at midnight” | ShipText Voice (differentiate: voice + customer tone, not git-only) |
| 14 | [X — ReleaseClaw](https://x.com/j4ycked/status/2025876887927685286) | Feb 23, 2026 | “Indie devs: tired of writing weekly release notes from scratch?” | ShipText Voice |
| 15 | [DEV — stopped writing changelogs](https://dev.to/kavinjeya/why-i-stopped-writing-changelogs-and-how-i-automated-them-instead-46fe) | ~Jun 25, 2026 | “GitHub gets the commit. My users? They get nothing.” | ShipText Voice |
| 16 | [Spokin — college roommates FA](https://www.spokin.com/college-roommates-and-food-allergies) | ~Oct 2025 | Repeated patterns: separate sponges, labeled shelves, post-it on fridge, mini-fridge when roommates ignore rules | FridgeGuard |
| 17 | [r/ComfortLevelPod — housemate peanut oil](https://www.reddit.com/r/ComfortLevelPod/comments/1o9ukjt/aitah_for_not_caring_that_my_housemate_had_an/) | ~2025 | Fridge leftovers + peanut oil → ER; comments stress labeling and cross-contamination in shared fridges | FridgeGuard |
| 18 | [r/LocalLLaMA — offline private LLM](https://www.reddit.com/r/LocalLLaMA/comments/1qrvx16/whats_the_best_way_to_run_an_offline_private_llm/) | ~2026 | Demand for offline private notes/reminders — not ChatGPT for health-adjacent | MenuAller (local path) / RoomiePlate DNA |
| 19 | [r/ollama — medical practice local](https://www.reddit.com/r/ollama/comments/1uz2dwa/seeking_advice_best_local_llm_32b_vs_70b_hardware/) | ~2026 | “patient data privacy is absolutely non-negotiable… everything must run 100% locally” | Local health-adjacent products only; skip building a medical EHR |

---

## Candidate detail cards

### 1. JobProof (FIRST)
- **Problem:** Small contractors need job-tied photos + notes + a shareable proof PDF, but CompanyCam is photo-only and expensive, and Jobber stacks to $400–700+/mo.
- **Who:** Solo–5 person home services (handyman, landscape, cleaning, stone, HVAC independent).
- **Why our stack:** FieldClear (contractor field ops) + FieldSight (vision/photos) without rebuilding a full FSM.
- **1-week MVP:** Next.js PWA + Supabase; create Job → capture photos → optional voice note (Whisper) → generate branded PDF → share link; Stripe Checkout.
- **Monetization:** $19/mo Pro (unlimited jobs) or $99 lifetime Lite; optional Twilio $0.02/SMS send-to-customer.
- **Positioning line:** “CompanyCam’s job: photos. Jobber’s job: everything else. JobProof’s job: prove the work and get paid — for coffee money.”

### 2. MenuAller
- **Problem:** Barcode/database allergy apps miss reformulations; restaurant menus are the real daily risk and mostly lack usable allergen UX.
- **Who:** Families managing peanut / tree nut / dairy / sesame who still want to eat out.
- **Why our stack:** RoomiePlate allergen logic + local Gemma/Ollama privacy for health-adjacent scans.
- **1-week MVP:** Profile allergens → camera on paper/PDF menu → OCR → flag dishes → export “questions for server” card.
- **Monetization:** Free 5 scans/mo; Family $4.99/mo; never claim medical certainty — UX copy: “decision aid, not a guarantee.”
- **Differentiation:** OCR *this* menu, not a stale barcode DB (Fig/Spokin already own packaged goods).

### 3. ChainSafe
- **Problem:** Peanut-allergy Reddit constantly crowdsources safe/unsafe chain lists that contradict and rot.
- **Who:** Same FA community; travelers new to a city.
- **Why our stack:** Domain expertise from RoomiePlate; Cubiczan-style small focused tool.
- **1-week MVP:** Seed DB from public r/peanutallergy threads + user “I ate here / reacted / staff protocol” reports with date.
- **Monetization:** Alerts when a chain’s status flips; optional restaurant “verified allergen protocol” paid badge later.
- **Risk:** Liability — disclaimers + community attribution mandatory; never “guaranteed safe.”

### 4. ShipText Voice
- **Problem:** Post-ship communication fatigue — same update rewritten 5 ways; users still ping “any updates?”
- **Who:** Indie hackers / small SaaS (AfterMerge audience).
- **Why our stack:** AfterMerge / Life After Code — post-merge customer communication, not another git→markdown bot.
- **1-week MVP:** Voice memo or 3 bullets → customer email + X thread + changelog blurb + Slack; copy buttons.
- **Monetization:** $9/mo; GitHub OAuth later (week 2), not week 1.
- **Skip if:** You only do commit→changelog (overserved: ShipLog, Changesmith, ReleaseClaw, GitVersify…).

### 5. StampField
- **Problem:** Field photo apps that work offline with GPS stamps are either ArcGIS-heavy or subscription-y; env/consulting users want buy-once.
- **Who:** Environmental techs, site inspectors, small architecture firms.
- **Why our stack:** FieldSight OpenCV/camera DNA.
- **1-week MVP:** Capture + GPS/time overlay + project folders + PDF report; no account required for Lite.
- **Monetization:** $14.99 IAP unlock (match JotCam price signal on Reddit).

### 6. FridgeGuard
- **Problem:** Shared kitchens with allergies fail on labeling, dish hygiene, and “whose food is safe.”
- **Who:** College / young adult roommates; couples where one has FA.
- **Why our stack:** RoomiePlate shared-kitchen + allergen awareness.
- **1-week MVP:** House invite link, allergen profiles, fridge zone labels, shopping list “safe for all / personal only.”
- **Monetization:** Soft — hard to get $ from broke roommates; good lead-gen into MenuAller/RoomiePlate ecosystem.

### 7. CarePack
- **Problem:** Travel packing apps ignore medical kits (epi, antihistamine, safe snacks, action plan PDFs).
- **Who:** Allergy parents; chronic illness travelers.
- **Why our stack:** Ship Pack Notes checklist DNA — **new niche**, not a PackItSmart clone.
- **1-week MVP:** Templates for “weekend / flight / camp” + med inventory + co-parent share.
- **Monetization:** $19.99/yr; partner with Spokin-like communities for distribution.

---

## Explicit SKIP list (vague, overserved, or wrong wedge)

| Skip | Why |
|------|-----|
| **Another generic packing list app** | PackItSmart, PackPoint, PackParty, Apple Reminders — crowded; only CarePack (medical) is distinct |
| **Full Jobber / ServiceTitan / Housecall Pro clone** | Months not days; capital-intensive; QuoteIQ/FieldCamp already attacking |
| **Generic barcode allergy scanner** | Fig, Spokin, AllerScan, Olive, Trash Panda — users already distrust DBs |
| **Git-commit → changelog only** | Dozens of 2026 indie launches (ShipLog, Changesmith, ReleaseClaw, updatify…) |
| **“AI receptionist for HVAC”** | Hot but crowded SaaS; weak unique DNA vs FieldClear’s field focus |
| **Alexa skill for trades morning briefing** | Thin organic demand in search; Alexa+ already chaotic for power users |
| **General local LLM notes app** | Obsidian/AnythingLLM/Open WebUI territory; only ship if tied to allergen/health profile |
| **StarRocks/Iceberg product** | Spike interest ≠ consumer complaint threads; keep as eng R&D, not this hunt |
| **Medical practice AI agent** | HIPAA / liability / hardware buyers — not a 1-week Cubiczan ship |
| **Vague “AI for contractors” wrapper** | No specificity; Reddit wants photos+invoice proof and lower stack cost |

---

## Build order suggestion (next 30 days)

1. **Week 1:** Ship **JobProof** MVP → post in r/Contractor + r/handyman + r/WhichCRM with “$19 vs your $700 stack” framing.  
2. **Week 2:** Instrument usage; if ≥10 paying trials, harden PDF + SMS; else kill or pivot to StampField one-time.  
3. **Week 3–4:** Parallel spike **MenuAller** (RoomiePlate reuse) if allergy community engagement higher than contractor.  
4. Park ChainSafe until legal disclaimer template is lawyer-reviewed.  
5. ShipText Voice as a *half-day* AfterMerge side-release if JobProof needs a marketing story (“we ship like we sell”).

---

## Method notes
- Sources: Brave web/LLM-context search, X `search_posts_all`, WebSearch; Reddit JSON often blocked from box egress — quotes taken from search snippets + Brave grounding that cite thread bodies.
- Preference: threads ~last 12 months (Oct 2025–Oct 2026).
- Bias: concrete complaints with $ or “I wish” language over trend articles.
