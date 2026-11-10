# Belajar Animasi

Personal, noncommercial portfolio. Monthly hosting budget Rp0; no external service or paid API is activated by development.

## Architecture

Vite React client → typed HTTP REST → NestJS domain service → Prisma → PostgreSQL. PostgreSQL owns published metadata, categories, tags and search terms. Executable code is a local allowlisted registry in packages/animation-demos, never database JavaScript. Swagger defines the contract; packages/shared contains generated client types.

GET /api/animations accepts q, category, difficulty, page and limit. It returns {items,total,page,limit}. GET /api/animations/:slug returns a published record or 404. GET /api/categories returns categories. /health checks database availability. No writes or authentication exposed in the MVP. Unknown DTO properties are rejected. Parameterized PostgreSQL search handles Indonesian keywords and synonyms.

Animation record fields: id, slug, technicalName, indonesianName, shortDescription, explanation, difficulty (BEGINNER/INTERMEDIATE/ADVANCED), category {slug,name}, tags string[], keywords string[], libraries string[], demoId, codeExampleId, aiPrompt, published, createdAt, updatedAt.

Initial stable identifiers: pin-scrub, depth-parallax, scroll-cube. The first two use scoped useGSAP and matchMedia; cube uses lazy R3F with demand rendering, capped DPR, owned resources and WebGL fallback. Reduced motion restores normal flow and static understandable states.

## Visual specification

Code-native geometric laboratory: neutral near-white (#fafaf8), ink (#202323), muted gray, violet accent; dark mode charcoal. Wide editorial heading, concise Indonesian copy, a useful search field, category/difficulty controls, three generous preview cards, and an educational footer. No marketing metrics or decorative scrolling effects. Category accents violet, blue, orange. 1120px content, 24px gutters; one column on mobile, three on desktop. System sans typography and monospace technical labels; fine borders, modest 14px radii. Detail pages separate explanation/code from a full-page scroll laboratory. Buttons and focus states remain visible and keyboard accessible.

Ruling: user explicitly requested implementation after a concise plan, so no additional design approval gate. Geometric code-native design avoids image generation and any potentially billed AI service. Existing AGENTS.md is retained. No application existed, so initialize a local feature branch rather than creating a second checkout.

## Milestone boundary

Three complete demos now. Taxonomy plans twelve techniques but only implemented demos appear as published content. No authentication, arbitrary code execution, chatbot, payments or hosted monitoring. Hosting configuration and instructions are prepared; publishing requires user account participation.
