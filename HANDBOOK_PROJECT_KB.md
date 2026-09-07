# Handbook — Session Knowledge Base

> Updated: 7 September 2026  
> Scope: replacement website for the legacy MJU handbook catalog

## 1. Product direction

Build a modern, static-first digital handbook catalog for the Office of Agricultural Research and Extension, Maejo University.

- Legacy reference: https://researchex.mju.ac.th/handbook2/
- Do **not** reuse or integrate Joomla.
- MVP is a searchable catalog of metadata with links to source PDFs.
- Do not build a CMS, login system, upload workflow, database, or document storage in the first release.

## 2. Delivery and release policy

| Area | Decision |
|---|---|
| Local workspace | `G:\ProjectAI\handbook` (WSL: `/mnt/g/ProjectAI/handbook`) |
| GitHub repository | `https://github.com/numtip/handbook` |
| Branch policy | Work in a branch and open a PR; do not push directly to the default branch |
| First publication | GitHub Pages only |
| Production VPS | Strictly prohibited until the user explicitly approves after GitHub Pages acceptance |
| Source of truth | GitHub; Pages is preview/staging |
| Public safety | Never publish real master, internal, restricted, or private documents; use only approved public metadata/sample content and add build guards when appropriate |

## 3. Recommended MVP stack

- Astro + TypeScript static site
- Design tokens and accessible component primitives
- Canonical catalog stored as CSV/JSON in the repository
- Client-side search and filtering by keyword, year, division, and access status
- GitHub Actions for check, test/build, and GitHub Pages deployment

Suggested routes:

```text
/
/manuals/
/manuals/[slug]/
/categories/administration/
/categories/finance/
/categories/research/
/categories/extension/
/about/
```

## 4. Legacy-source inventory

The legacy page contains **42 listed handbook records** across:

1. กองบริหารงานสำนักวิจัยฯ
   - งานบริหารและธุรการ
   - งานคลังและพัสดุ
   - งานนโยบาย แผนและประกันคุณภาพ
2. กองบริหารงานวิจัย
3. กองบริหารงานบริการวิชาการ

Initial catalog generated in this session:

- File: `handbook-catalog-initial.csv`
- Fields: `รหัส, ชื่อคู่มือ, ปี, กอง/หมวด, คำสำคัญ, ลิงก์ PDF, เจ้าของ, สถานะ`
- Initial legacy records: `HND-001` through `HND-042`
- Current catalog: 43 records, including HND-043 (B.E. 2569) in งานคลังและพัสดุ.

### Data-quality and access facts

- Links point mainly to `erp.mju.ac.th/openFile.aspx`.
- Some source PDFs were accessible and verified, including Zoom Meeting (2568) and Thai lady’s-slipper orchid manual (2567).
- Many legacy links now require MJU SSO, so they cannot be treated as public downloadable documents.
- Two legacy administrative entries use a duplicated source URL; their actual PDF URLs are intentionally blank in the catalog pending owner verification.
- The source catalog has four blank PDF-URL rows: HND-002, HND-004, HND-015, and HND-016. The latter two are known duplicated-URL pending cases; confirm the reason for the first two with the data owner.
- The owner explicitly authorized publication of every source URL. The web-served catalog at `site/public/data/manuals.csv` must still be generated from the source catalog, preserve source URLs when present, and visibly distinguish access status.
- The CSV status column preserves these distinctions. Do not convert unverified, login-required, or duplicate links to `available`.
- `เจ้าของ` is currently the responsible division/organization inferred from the catalog grouping, not the document author. Confirm individual data owners before any authoritative claim.

## 5. Immediate next actions

1. In the local Codex session, run read-only checks:

   ```bash
   cd /mnt/g/ProjectAI/handbook
   git status --short --branch
   git remote -v
   git branch --show-current
   ```

2. Confirm that `origin` is `https://github.com/numtip/handbook.git` and the working tree is clean.
3. Copy the initial CSV into the repository (suggested: `src/data/manuals.csv`) only after review.
4. Add explicit status semantics, for example: `public_verified`, `login_required`, `url_pending`, and `archived_legacy`.
5. Build the MVP catalog with no document migration. Make link availability visible in the UI.
6. Before GitHub Pages publication, review every record for public-release suitability and ensure the site contains no restricted files or metadata.

## 6. Stop conditions

Stop and ask the user before:

- merging a PR;
- enabling or changing GitHub Pages settings;
- deploying or changing the VPS/production server;
- copying, hosting, or publishing a PDF whose access/ownership is not explicitly confirmed;
- replacing ambiguous legacy links with guessed URLs.

## 7. Handoff prompt

```text
Read HANDBOOK_PROJECT_KB.md first. Work only in the local repo G:\\ProjectAI\\handbook (WSL /mnt/g/ProjectAI/handbook). Start with read-only git and environment checks. Build a static Astro + TypeScript handbook catalog from the reviewed canonical CSV; do not use Joomla, CMS, database, login, PDF migration, direct default-branch pushes, merges, GitHub Pages changes, or VPS deployment without explicit approval. Preserve the distinction between public_verified, login_required, url_pending, and archived legacy records. Report evidence, changed files, checks, branch/PR, and stop before merge/deploy.
```
