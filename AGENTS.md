# Belajar Animasi — engineering instructions

This is the initial instruction template for the planned `belajar-animasi` repository. Build application features only when requested; the environment setup task does not authorize scaffolding the application.

## Git workflow — mandatory for every change

- Before editing code, documentation, configuration, dependencies, tests, or any other tracked project file, inspect `git status` and the current branch. Create or select a dedicated task branch; never edit or commit directly on `main`.
- Use descriptive names: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, or `chore/<topic>`. Keep one coherent task per branch and preserve unrelated local changes.
- Start new work from an up-to-date `main` when the working tree is clean. Use `git fetch origin` and `git pull --ff-only` rather than silently rewriting history. Do not automatically stash, discard, or move another task's changes.
- Stage explicit files, inspect the diff, and run checks appropriate to the change before committing. Never include secrets, `.env`, unrelated local documents, or generated build output.
- Push the task branch and open a pull request targeting `main` when publication is authorized. A request to push does not by itself authorize merging an ongoing task's pull request. Merge only after the user explicitly requests it and relevant checks pass.
- Explain the current branch, what the commit contains, what the pull request proposes, and whether it has been merged. Teach branch, commit, pull request, merge, conflict resolution, and synchronization briefly in Indonesian as they arise.
- Do not force-push, rewrite shared history, delete branches, change repository protection/settings, or resolve conflicts by discarding changes without authorization. Explain conflicts and preserve both intended behaviors.
- After an authorized merge, synchronize local `main` with `git pull --ff-only`; create the next task branch from that baseline. Branch cleanup is a separate deliberate action.
- Initial publication exception: the already-created project baseline may be pushed once to an empty remote `main`. All subsequent changes, including these workflow instructions, must use a task branch and pull request.

## Stack and budget requirements

- Frontend: React, Vite, strict TypeScript, Tailwind CSS, GSAP/ScrollTrigger, React Three Fiber, and Three.js.
- Backend: NestJS, strict TypeScript, REST, Swagger/OpenAPI, PostgreSQL, and Prisma.
- Tooling: pnpm workspaces, Docker Compose, Vitest, Playwright, ESLint, Prettier, and GitHub Actions.
- Budget is Rp0. Use free, open-source developer tooling. Do not activate paid plans, payment-required trials, metered APIs, OpenAI API billing, or paid monitoring.
- Ask before connecting a new external service, creating accounts/projects, changing account settings, or making administrator-level system changes. Existing authorization applies to its stated scope only.
- Do not introduce Supabase, Firebase, hosted backend replacements, Stripe, Next.js, or Vercel deployment tooling without an explicit stack change. Build Web Apps bundles some guidance for those products; do not apply it to this project.
- Intended hosting is Vercel Hobby for the frontend, Render Free for NestJS, and Neon Free for PostgreSQL. Verify current eligibility and limits before deployment. Vercel Hobby requires personal, non-commercial use; Render Free has cold starts and ephemeral storage. Never assume these tiers provide production uptime guarantees or permit every use case.
- Sentry remains optional and disconnected until explicitly authorized. Prefer local logs, browser tools, and tests for initial diagnostics.

## Architecture and code quality

- Prefer a small pnpm workspace with `apps/web`, `apps/api`, and focused shared packages when scaffolding is authorized. Add packages only for real reuse.
- Organize web code by feature and API code by NestJS domain module. Keep controllers thin, business rules in services, and persistence behind clear boundaries. Avoid circular dependencies and oversized generic utility modules.
- Keep Prisma and database credentials on the backend. The frontend communicates through typed REST contracts; it must not import server implementation or Prisma runtime code.
- Treat OpenAPI as the API contract. Define DTOs, response shapes, error responses, authentication requirements, and pagination. Generate or validate client types against it rather than maintaining divergent copies.
- Enable TypeScript `strict`; favor `unknown` with narrowing over `any`. Keep types, names, public interfaces, and error handling clear. Explain any justified suppression.
- Pin a tested supported Node LTS version and pnpm version in the future repository. Check the Nest CLI generator's engine requirements separately from `@nestjs/core` runtime requirements. Do not enable Nest Observe or other hosted observability during generation.
- Use a committed lockfile, immutable installs in CI, ESLint and Prettier. Inspect third-party installers and lifecycle scripts before execution; do not run downloaded shell pipelines.
- Inspect existing files before editing. Preserve unrelated configuration, user changes, and security settings. Do not change machine execution policy, sandbox protections, or certificate checks to make tools work.

## Security and data

- Validate configuration at startup and validate every REST boundary with DTOs and a global validation pipe using whitelisting and rejection of unexpected properties. Enforce authentication and authorization server-side.
- Use least-privilege database roles, Prisma parameterized queries, deliberate CORS origins, secure headers, bounded request bodies, and rate limits on sensitive endpoints. Never interpolate untrusted input into SQL or shell commands.
- Render untrusted educational content safely. Sanitize any allowed HTML/SVG and do not execute submitted animation code in the main application origin. Use a deliberately sandboxed preview design if editable code is requested.
- Never commit `.env` files or secrets. Keep a placeholder-only `.env.example`. Remember that Vite `VITE_*` variables are public. Redact sensitive data from logs, screenshots, test fixtures, and reports.
- Review migrations and destructive commands. Use a disposable test database for integration tests; never point destructive tests at production. Preserve persistent local database volumes.
- For later containers, use a supported open-source Docker-compatible engine, pin appropriate images, run services with least privilege, provide health checks, and avoid exposing PostgreSQL publicly.

## Accessible and responsive UI

- Use semantic HTML, keyboard access, visible focus, labeled controls, sufficient contrast, responsive layouts, and meaningful loading/error/empty states. Do not make essential content depend on hovering, dragging, animation completion, or WebGL availability.
- Respect `prefers-reduced-motion` in CSS, GSAP, and R3F. Provide readable static/final states and ordinary vertical document flow; disable or simplify scrub, pin, parallax, camera motion, and continuous loops when appropriate. Rebuild cleanly when this preference changes.
- Keep typography selectable and accessible. Preserve accessible text equivalents when using SplitText, kinetic typography, SVG, or canvas. Prevent duplicate announcements and restore text during cleanup.
- Provide a useful fallback for unsupported WebGL, context loss, slow devices, and failed assets. Animation examples must remain understandable without motion.

## GSAP and animation lifecycle

- Consult the installed official `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-performance`, and `gsap-frameworks` skills when relevant. Use React guidance for this frontend.
- Register only the GSAP plugins needed by a scene. Prefer `@gsap/react` `useGSAP` with a scoped ref, or an explicitly owned `gsap.context`. Use `contextSafe` for callbacks that create animations after setup.
- Revert component-owned contexts, timelines, matchMedia registrations, ScrollTriggers, pin styles, and SplitText on dependency changes and unmount. Remove listeners, observers, timeouts, ticker callbacks, and animation frames. Do not globally kill other components' animations.
- Verify mount/unmount/remount under React Strict Mode and client navigation. Avoid duplicate triggers, stale closures, abandoned pin spacers, and listeners surviving route changes.
- Compose multi-stage scenes with named timeline labels and reusable scene functions. Make scrub, pin, pin spacing, start/end calculations, and refresh behavior explicit. Measure horizontal scroll distances from actual dimensions and invalidate on relevant changes.
- Refresh ScrollTrigger after layout-affecting images/fonts finish loading and at appropriate resize boundaries; avoid refresh loops and per-frame measurement. Test breakpoint changes and content resizing.
- Keep 3D scroll controllers and GSAP timelines under one clear ownership model. Animate refs or scene properties; avoid competing writers and React state updates on every frame.

## Performance requirements

- Prefer transforms and opacity for DOM animation. Batch measurements before writes; avoid layout thrashing, per-frame DOM queries, large animated filters, and unnecessary allocation. Apply `will-change` selectively and release it when no longer useful.
- Lazy-load complex examples, Three.js scenes, plugins, and large assets. Pause offscreen/hidden-tab work. Reuse geometry/materials where appropriate, use instancing for repeated objects, and explicitly release resources when their owner ends; do not dispose shared cached assets prematurely.
- In R3F, use refs and `useFrame` for continuous scene mutation, delta-based movement, and demand rendering when the scene can be idle. Cap device pixel ratio and provide lower quality settings for constrained devices.
- Target smooth 60 fps on a documented representative device (about 16.7 ms total per frame), while providing graceful degradation. Profile actual scenes with browser performance tools and renderer statistics; report measured device, viewport, draw calls, long tasks, memory, and any remaining bottleneck. Do not claim performance solely from a desktop screenshot.
- Cover scrub/pin, multi-stage timelines, depth parallax, horizontal storytelling, typography, SVG morph/draw, FLIP, and scroll-controlled 3D with isolated, reusable examples when requested. Avoid enabling every effect on one page by default.

## Testing and completion

- Write meaningful Vitest tests for business logic, data transformations, and animation state/configuration that can regress. Test user-visible React behavior rather than internal implementation details.
- Add API integration tests for validation, authorization, contracts, Prisma queries, and migrations against a disposable PostgreSQL instance.
- Use Playwright for important end-to-end flows, keyboard navigation, responsive breakpoints, reduced motion, routes, scene mount/unmount, pinning/horizontal scroll, and fallback/error behavior. Keep visual checks deterministic and use suitable tolerances for rendered graphics.
- After implementation, run the repository's actual formatting/lint, type-check, unit/integration, production build, and relevant e2e commands. Define those scripts when scaffolding is authorized; do not report placeholder commands as executed.
- CI should reproduce the supported runtime, pnpm version, frozen lockfile install, checks, build, database test setup, and browser tests. Use least-privilege workflow permissions; never expose deployment secrets to untrusted pull requests.
- Before reporting completion, inspect the diff and verify the behavior. State what changed, which checks really ran, their results, and any missing dependencies or unverified conditions. Configuration-file existence alone is not proof that a tool works.
