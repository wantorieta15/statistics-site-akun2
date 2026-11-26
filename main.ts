// TalaStat hand-in program (Node 22, standard library only) — reviser
// rewrite. The site is plain static files under app/ (index.html plus its
// own modules, styles and data — nothing loads over the network). This
// program copies app/ and screenshots/ beside it into the output
// directory and writes /output/dossier.json with the vendored make.fun
// library, which must stay byte for byte as the kit shipped it.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Reviser notes (2026-11-26): the build itself was already correct, so the
// logic below is unchanged in behaviour — it is rewritten for clarity and
// to make the gate limits explicit next to the call that enforces them.
// The visible fixes live in app/: a compact dashboard hero, one-row KPI
// grid on desktop so the first charts enter a 1280x720 viewport, and
// charts.js axis labels that match the plotted scale.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Gate caps from the competition rules, enforced by buildDossier:
// at most 4 screenshots, each at most 256 KiB; app/ at most 993 files
// and directories and 16 MiB; the dossier text at most 160 KiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
