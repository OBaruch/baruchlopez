# Baruch Lopez GenAI Architect CV

This folder contains the current GenAI Architect-targeted CV deliverables:

- `baruch-lopez-genai-architect-cv.html`: standalone premium HTML CV.
- `baruch-lopez-genai-architect-cv.pdf`: generated print/PDF version optimized for ATS and human review.
- Current positioning: Bosch-internal role application, with internal Bosch project material summarized for recruiting use.

## Source Policy

The CV uses claims supported by the repository, curated `_content_mining` files, LinkedIn export data, the public Astro site source, prior CV text extraction, public GitHub repository metadata, local certificate summaries, direct user-provided updates, and user-provided Bosch internal portfolio screenshots.

The TOGAF item was added from a direct user update on 2026-06-11. It is intentionally phrased as active Enterprise Architecture certification preparation, not as a completed certification or formal credential.

Bosch project details were added from user-provided screenshots on 2026-06-11 for an internal Bosch recruiting context. They are summarized as capability evidence and should not be treated as public website content without a separate confidentiality review.

## Recruiting Positioning Decision

The first version used a visible `Target Role Alignment: GenAI Architecture` section. After recruiter-style review, that label was removed from the CV because it reads more like a cover letter or application memo than a senior technical resume. The final version uses `AI Architecture Readiness`, which keeps the role fit visible while sounding more confident and evidence-based.

Sensitive items intentionally excluded:

- phone number;
- immigration/citizenship information;
- exact private addresses;
- official document identifiers;
- Bosch metrics, clients, internal stakeholders, private business records and low-level confidential implementation details;
- private Cyrus Global Capital legal, financial, reporting or performance details;
- completed TOGAF certification claims.

## Confirmed Claim Matrix

| Claim | Evidence | Confidence | Publish? | Notes |
| --- | --- | --- | --- | --- |
| Current CV display name is Omar Baruch M. Lopez | Direct user update, prior CV context | CONFIRMED | Yes | Avoids exposing the full legal surname sequence and removes the former public-name label. |
| Current role is AI Engineer II at Bosch Mexico | LinkedIn export and `_content_mining` profile/timeline | CONFIRMED | Yes | Dates follow LinkedIn export: Jan 2026 - Present. |
| Previous Bosch role was AI Engineer, 2022 - Feb 2026 | LinkedIn export and `_content_mining` professional experience | CONFIRMED | Yes | Kept public-safe and high level. |
| Bosch work includes AI, ML MVPs, Python, SQL, ETL, Alteryx, Power BI, dashboards, data engineering, documentation and training | LinkedIn export, prior CV, `_content_mining` Bosch safe summary | CONFIRMED | Yes | Internal details generalized. |
| Bosch internal delivery portfolio includes MIURA, Fraccion Arancelaria, TLP analytics/data-pipeline work, vehicle detection, staff mobility optimization, e-commerce automation and multiple ML/PoC initiatives | User-provided Bosch internal portfolio screenshots, 2026-06-11 | CONFIRMED BY USER | Internal use | Summarized for internal Bosch recruiting; not recommended for public site copy. |
| Bosch internal training includes compliance, information security, data protection, CIP, Power BI, applied ML, ABAP basics, supply-chain security and process standardization | User-provided Bosch internal training screenshot, 2026-06-11 | CONFIRMED BY USER | Internal use | Summarized, not listed exhaustively. |
| Professional engagements include Explainable AI at Talent Land Guadalajara, Connectory Talks Data Analytics, Mentoring4GS and robotics workshops | User-provided external courses/engagements screenshot, 2026-06-11 | CONFIRMED BY USER | Yes | Listed as a compact engagement summary. |
| Uses AWS EC2 for an MVP and has AWS training | LinkedIn export, prior CV, certificate summary | CONFIRMED | Yes | Cloud-native or production architecture claims not overstated. |
| Co-Founder & CFO at Cyrus Global Capital since Jul 2024 | LinkedIn export and `_content_mining` Cyrus summary | CONFIRMED | Yes | Scope kept prudently institutional. |
| Dual MBA in progress, MIU City University Miami and UNIR Mexico, Jul 2025 - Mar 2027 | LinkedIn export and `_content_mining` education | CONFIRMED | Yes | Listed as in progress. |
| Robotics Engineering at Universidad de Guadalajara | LinkedIn export, education source summary and official local evidence summaries | CONFIRMED | Yes | Exact IDs excluded. |
| Introduction to Generative AI, Cognigy AI Agents/Foundation, ML in Production and other public certifications | LinkedIn export, recognitions data and certificate summaries | CONFIRMED | Yes | Used as training path, not as job-title proof. |
| Public GitHub projects include ai-voice-agent, cards_perks_downloader, global-card-perks and others | GitHub API metadata and site data | CONFIRMED | No | Not surfaced as a selected-projects section because the user stated these projects are not representative for this Bosch-internal role. |
| TOGAF Enterprise Architecture certification preparation | Direct user update on 2026-06-11 | CONFIRMED BY USER | Yes | Listed only as in-progress preparation. |

## GenAI Architect Alignment Matrix

| GenAI Architect requirement | Baruch evidence | Strength | Gap | Positioning used |
| --- | --- | --- | --- | --- |
| Lead GenAI solution architecture | AI/data delivery at Bosch; MIURA workflow enablement; tariff-classification AI/data workflow exploration; GenAI and agent training | Medium | No confirmed GenAI Architect title | "Enterprise AI Architecture Focus" and internal delivery evidence. |
| RAG, agentic AI, orchestration and grounding patterns | GenAI course, Cognigy AI Agents, voice-agent project | Emerging | No confirmed RAG production work | Label as development focus, not demonstrated production experience. |
| Reference architectures and reusable components | Documentation, training, data workflows, Project Center/system thinking, TOGAF preparation | Medium | No formal architecture ownership evidence | "Solution architecture" and "enterprise architecture." |
| GenAIOps / LLMOps, evaluation, quality gates, telemetry | ML in Production training and production-aware enterprise data work | Emerging | No confirmed LLMOps delivery | Career direction and development focus. |
| Security, privacy, compliance and Responsible AI | Bosch compliance/security training, corporate environment, explainable AI public signal | Medium | No formal Responsible AI governance role | Responsible implementation and guardrails, no ownership claim. |
| Enterprise integration | SQL, APIs, FastAPI, Airflow, AWS EC2 MVP, ETL, Power BI, Alteryx, SAP/data-lake source integration, enterprise data contexts | Strong | Low-level details should stay internal | Internal-role language with summarized implementation evidence. |
| Stakeholder management and mentoring | Bosch cross-functional collaboration, recommendations, documentation/training | Strong | No people-manager title claimed | Stakeholder enablement and technical mentoring language. |

## Regeneration

From the repository root:

```powershell
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$PWD\cv\gen-ai-architect\baruch-lopez-genai-architect-cv.pdf" "$PWD\cv\gen-ai-architect\baruch-lopez-genai-architect-cv.html"
```

After generating, validate text extraction with PyMuPDF:

```powershell
@'
import fitz
doc = fitz.open(r"cv/gen-ai-architect/baruch-lopez-genai-architect-cv.pdf")
text = "\n".join(page.get_text() for page in doc)
print(len(text))
print(text[:2000])
'@ | py -3 -
```

## Pending Confirmations

- `[PENDIENTE DE CONFIRMAR]` whether the internal Bosch project wording should be further reduced before sending outside Bosch.
- `[PENDIENTE DE CONFIRMAR]` exact public wording for Cyrus Global Capital if a lighter formulation is preferred.
- `[PENDIENTE DE CONFIRMAR]` project metrics for AI, data and public GitHub projects.
- `[PENDIENTE DE CONFIRMAR]` preferred public location line if the CV should use Guadalajara, Winchester, or omit location.
