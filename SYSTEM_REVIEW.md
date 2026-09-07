# Handbook Catalog — System Review Handoff

This file is a technical and product handoff for an independent reviewer, including Claude. Read it together with `HANDBOOK_PROJECT_KB.md`; the knowledge base is authoritative when the documents differ.

## Review scope and safety

- Workspace: `G:\ProjectAI\handbook`
- Remote repository: `https://github.com/numtip/handbook`
- Active branch: `codex/initial-catalog`
- Current local baseline: commit `fda1861` (`feat: improve handbook search filters`)
- The project is intentionally local-only at this stage. Do **not** push, open or merge a pull request, configure GitHub Pages, deploy, or alter a production/VPS environment unless the owner explicitly asks.
- This is a static metadata catalog. Do not add a CMS, login, database, upload flow, PDF migration, or host any PDF files.
- Do not mark a source link as publicly available unless the catalog data says it is verified.

## What the system does

The site is a Thai digital handbook catalog for the Office of Agricultural Research and Extension, Maejo University. It provides:

- 42 handbook metadata records from the legacy catalog.
- Category navigation for five document groups.
- Client-side searching by title, handbook code, keyword, and owner.
- Filters for category, publication year, and source access status.
- External PDF links only for records whose source status is verified as public.
- A responsive, single-page Astro experience.

## Current implementation

| Area | Current design |
|---|---|
| Framework | Astro 6 with TypeScript, Tailwind CSS 4, and DaisyUI 5 |
| Main page | `site/src/pages/index.astro` |
| Shared styles | `site/src/styles/global.css` |
| Canonical runtime data | `site/public/data/manuals.csv` |
| Original catalog snapshot | `handbook-catalog-initial.csv` |
| Local commands | From `site/`: `npm run dev`, `npm run build`, `npm run preview` |
| Build output | `site/dist/` (generated; do not treat as source) |
| Template notice | `site/NOTICE.md` and `site/LICENSE` |

The page fetches `/data/manuals.csv` in the browser, parses it locally, and renders results without a server, database, or API.

## Data contract

The CSV headings are Thai and must remain available to the parser:

```text
รหัส, ชื่อคู่มือ, ปี, กอง/หมวด, คำสำคัญ, ลิงก์ PDF, เจ้าของ, สถานะ
```

### Categories and expected record counts

| Key used by UI | Division value in CSV | Expected count |
|---|---|---:|
| `admin` | กองบริหารงานสำนักวิจัยฯ / งานบริหารและธุรการ | 16 |
| `finance` | กองบริหารงานสำนักวิจัยฯ / งานคลังและพัสดุ | 10 |
| `policy` | กองบริหารงานสำนักวิจัยฯ / งานนโยบาย แผนและประกันคุณภาพ | 1 |
| `research` | กองบริหารงานวิจัย | 2 |
| `extension` | กองบริหารงานบริการวิชาการ | 13 |

The values above total 42. Keep the strings synchronized with both the CSV and the `groups` array in `index.astro`.

### Year filter: Thai Buddhist Era

- The `ปี` field in the source file is already stored in Thai Buddhist Era (B.E.) values, not Common Era values.
- The dropdown must use the raw CSV year as its `value`, but display it as `พ.ศ. <year>`.
- Current source years and record totals are: 2568 (1), 2567 (2), 2566 (4), 2565 (3), 2564 (3), 2563 (3), 2562 (1), 2560 (9), 2559 (4), 2558 (7), 2557 (4), and 1 record with no year.
- The UI sorts the year options descending and includes `ไม่ระบุปี` for the blank source value.
- Do not subtract 543 or otherwise convert the stored year during filtering.

### Access-status mapping

The UI derives a display access state from the CSV `สถานะ` text:

| UI state | Source-text condition | UI behavior |
|---|---|---|
| `public` | Contains `PDF ตรวจพบ` | Shows an external PDF button when a URL exists |
| `login` | Contains `ต้องล็อกอิน` | Clearly states login is required; no PDF button |
| `pending` | Contains `ต้องยืนยัน` or `ซ้ำกับรายการอื่น` | States link needs confirmation; no PDF button |
| `review` | Any remaining status | States access needs review; no PDF button |

This classification preserves the source-access distinction. It is a safety requirement, not merely presentation.

## Current UX behavior to review

- The category area uses one larger organizational card and two secondary category cards. Category cards set the corresponding category filter and scroll to the catalog.
- The selected category has an active visual state and `aria-pressed` value.
- The search panel is a responsive working surface: search, category, B.E. year, and access status align in one row on wide screens; they reflow to two columns and then one column on smaller screens.
- `ล้างตัวกรอง` returns every control to its default and restores focus to the search field.
- Result groups are full-width vertical sections, with document cards in a two-column grid on large screens.
- Animations honor `prefers-reduced-motion`.

## Reviewer checklist

Please review these items and report findings with file paths and line numbers before changing behavior:

1. Verify the CSV parser handles quoted Thai keywords, blank URLs, and the blank year record correctly.
2. Verify that the year dropdown displays only B.E. years extracted from `manuals.csv`, is newest first, and filters using the matching source value.
3. Verify category counts against the CSV and ensure no results disappear because of mismatched division strings.
4. Check desktop, tablet, and mobile layout for search controls, category cards, document cards, and long Thai text.
5. Confirm keyboard focus, clear-filter behavior, category selection state, and no-result state work correctly.
6. Confirm only `public` records can expose an external PDF action.
7. Run the production build before approving changes:

   ```powershell
   Set-Location G:\ProjectAI\handbook\site
   npm run build
   ```

8. Check `git diff --check` and preserve the local-only release policy.

## Known constraints and non-goals

- The legacy source is `https://researchex.mju.ac.th/handbook2/`; it is reference material only. Do not reuse Joomla.
- Many legacy URLs require MJU SSO. Do not guess replacement URLs or expose a direct-download control for them.
- Two legacy administrative entries intentionally have blank URLs because the old page used a duplicated URL; they remain pending confirmation.
- `เจ้าของ` identifies the responsible organization inferred from the grouping, not the document author.
- The current site has one implemented route (`/`). Suggested future routes in the project knowledge base are not yet implemented requirements.
- The ProCleaning template license and attribution files in `site/` must be retained unless the owner makes a deliberate licensing decision.

## Recent local commits

```text
fda1861 feat: improve handbook search filters
3088c92 fix: align handbook catalog UX
e8fa443 fix: compact secondary category cards
d6b2e71 fix: stabilize category card layout
67e77a2 feat: elevate catalog visual experience
```

## Expected reviewer output

Provide a concise report containing:

1. Findings ordered by severity, with evidence.
2. Any data-integrity or public-access risks.
3. Responsive/UX issues observed.
4. Build and test results.
5. Recommended changes, explicitly separated from changes that were actually made.

Stop before publishing, pushing, merging, deploying, or changing external service settings.
