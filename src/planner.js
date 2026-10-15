import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { detectProject, stackFromBrief } from './project.js';

export const packageRoot = fileURLToPath(new URL('../', import.meta.url));
export const platforms = ['web', 'mobile', 'desktop'];
export const modes = ['build', 'redesign', 'audit', 'review'];
export const intents = ['marketing', 'application', 'commerce', 'editorial'];

export async function getRegistry() {
  return JSON.parse(await readFile(new URL('../resources/routing.json', import.meta.url), 'utf8'));
}

export function validateBrief(brief) {
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) throw new Error('Brief must be a JSON object.');
  for (const key of ['product', 'audience', 'primary_task']) {
    if (typeof brief[key] !== 'string' || !brief[key].trim()) throw new Error(`Brief requires a nonempty string: ${key}`);
  }
  if (brief.platform !== undefined && !platforms.includes(brief.platform)) throw new Error(`Invalid platform: ${brief.platform}`);
  if (brief.intent !== undefined && !intents.includes(brief.intent)) throw new Error(`Invalid intent: ${brief.intent}`);
  if (brief.free_only !== undefined && typeof brief.free_only !== 'boolean') throw new Error('free_only must be a boolean.');
  if (brief.open_source !== undefined && typeof brief.open_source !== 'boolean') throw new Error('open_source must be a boolean.');
  if (brief.motion !== undefined && !['none', 'subtle', 'expressive'].includes(brief.motion)) throw new Error('motion must be none, subtle, or expressive.');
  return brief;
}

function chooseIntent(brief) {
  if (brief.intent) return { value: brief.intent, basis: 'Explicit brief intent.' };
  const text = [brief.product, brief.primary_task, brief.scope].filter((v) => typeof v === 'string').join(' ').toLowerCase();
  if (/landing page|marketing (?:page|site|website)|product website/.test(text)) return { value: 'marketing', basis: 'Marketing/landing language in the brief.' };
  if (/checkout|shopping|storefront|e-?commerce|buy products/.test(text)) return { value: 'commerce', basis: 'Purchasing workflow in the brief.' };
  if (/portfolio|magazine|editorial|\bblog\b/.test(text)) return { value: 'editorial', basis: 'Publishing/portfolio language in the brief.' };
  return { value: 'application', basis: 'Working application assumed from the primary task; override with intent if this is a marketing page.' };
}

function rejectReason(item, context) {
  if (!item.platforms.includes(context.surface)) return 'Not compatible with the selected native/web surface.';
  if (item.stacks.length && context.stack !== 'unknown' && !item.stacks.includes(context.stack)) return `Source targets ${item.stacks.join('/')} rather than ${context.stack}.`;
  if (item.stacks.length && context.stack === 'unknown') return 'Framework compatibility is unresolved; confirm the stack first.';
  if (context.freeOnly && !['free', 'free-subset', 'native'].includes(item.cost)) return 'No verified free scope in this entry.';
  if (context.openSource && item.redistribution !== 'permissive' && item.redistribution !== 'native') return 'Source redistribution has restrictions or is unverified; use a permissive alternative for this open-source project.';
  if (item.motion === 'expressive' && context.motion !== 'expressive') return 'Expressive motion is not requested; keep this out of the core foundation.';
  return null;
}

function scoreCandidate(item, context) {
  const reasons = [];
  let score = 0;
  if (item.intents.includes(context.intent)) { score += 50; reasons.push(`Fits the ${context.intent} task.`); }
  else { score -= 30; reasons.push('Less direct task fit; consider only for supporting pieces.'); }
  if (item.stacks.includes(context.stack)) {
    score += 25;
    reasons.push(`Source fits ${context.stack}.`);
    if (item.stacks.length === 1) {
      score += 10;
      reasons.push('Framework-specific source reduces adaptation work.');
    }
  }
  if (item.role === 'foundation') { score += 15; reasons.push('Can provide a consistent primary component foundation.'); }
  if (item.role === 'blocks' && context.intent === 'marketing') score += 20;
  if (context.project.libraries.includes(item.package)) { score += 70; reasons.push('Already installed in this project.'); }
  if (item.id === 'shadcn' && context.project.markers.includes('components.json') && context.stack === 'react') {
    score += 70; reasons.push('Existing components.json makes extending the current system preferable.');
  }
  if (item.motion === 'expressive') { score -= 15; reasons.push('Use for one purposeful visual moment, not every screen.'); }
  if (item.redistribution === 'restricted') score -= 15;
  return { ...item, score, reasons, status: 'candidate-needs-inspection' };
}

/** Explainable local routing; the host LLM must inspect candidates and the UI. */
export async function createPlan(brief, options = {}) {
  validateBrief(brief);
  const mode = options.mode ?? 'build';
  if (!modes.includes(mode)) throw new Error(`Invalid mode: ${mode}`);
  const reviewOnly = mode === 'audit' || mode === 'review';
  if (options.platform !== undefined && !platforms.includes(options.platform)) throw new Error(`Invalid platform: ${options.platform}`);
  const project = options.project ? await detectProject(options.project) : {
    root: null, stack: 'unknown', platform: 'web', shell: null, markers: [], libraries: [], warnings: ['No project inspected; recommendations are provisional.'],
  };
  const registry = options.registry ?? await getRegistry();
  const stack = project.stack !== 'unknown' ? project.stack : stackFromBrief(brief.stack);
  const platform = options.platform ?? brief.platform ?? project.platform;
  const surface = platform === 'desktop' && (project.shell || /electron|tauri/i.test(brief.stack ?? '')) ? 'desktop-web' : platform;
  const inferred = chooseIntent(brief);
  const context = {
    platform, surface, stack, intent: inferred.value, project,
    freeOnly: brief.free_only ?? true, openSource: brief.open_source ?? false,
    motion: brief.motion ?? 'subtle',
  };
  const candidates = [];
  const excluded = [];
  for (const item of registry.resources) {
    const reason = rejectReason(item, context);
    if (reason) excluded.push({ id: item.id, name: item.name, reason, url: item.url });
    else candidates.push(scoreCandidate(item, context));
  }
  candidates.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  const preserve = project.markers.length > 0 || project.libraries.some((name) => name !== 'tailwindcss');
  const strategy = reviewOnly ? 'assess-before-changing' : preserve ? 'extend-existing-system' : platform !== 'web' && surface !== 'desktop-web' ? 'platform-native-first' : 'inspect-best-fit-foundation';
  const selected = candidates.filter((item) => item.intents.includes(context.intent)).slice(0, 3);
  const primary = selected.find((item) => ['foundation', 'native'].includes(item.role)) ?? selected[0] ?? null;
  return {
    schemaVersion: 1, mode, brief, context, strategy,
    intentBasis: inferred.basis,
    recommendation: {
      primary: reviewOnly ? 'retain-until-evidence' : preserve ? 'existing-system' : primary?.id ?? 'custom',
      rationale: reviewOnly ? 'Judge the actual work first. Retain sound decisions; suggest a different foundation only for an observed problem a smaller repair cannot solve.' : preserve ? 'Preserve existing components and tokens; use the shortlist to fill specific gaps.' : primary ? primary.reasons.join(' ') : 'No compatible foundation was established; build from platform primitives and inspect the actual stack.',
      shortlist: reviewOnly ? [] : selected,
      supporting: reviewOnly ? [] : candidates.filter((item) => !selected.includes(item) && item.intents.includes(context.intent)).slice(0, 3),
      excluded: reviewOnly ? [] : excluded,
    },
    ...(reviewOnly ? { assessment: {
      status: 'unassessed',
      verdicts: ['keep', 'refine', 'rethink', 'insufficient-evidence'],
      changesAuthorized: false,
      report: ['Verdict and reviewed scope', 'Specific strengths to keep', 'Zero to three priority corrections with reasons and checks; disclose all critical blockers', 'Better approach only when justified', 'Material unverified checks'],
      principle: 'A sound implementation needs no invented corrections. Distinguish observed defects from taste; prefer the smallest effective repair.',
    } } : {}),
    research: {
      reviewed: registry.reviewed,
      liveVerified: false,
      queries: [
        `${stack === 'unknown' ? 'selected framework' : stack} ${context.intent} ${context.freeOnly ? 'free' : ''} UI source license`,
        `${brief.product} interface layout reference`,
      ],
      steps: reviewOnly ? [
        'Inspect the existing artifact and primary task before researching replacements.',
        'Research alternatives only if an observed structural problem cannot reasonably be repaired in place.',
      ] : [
        'Inspect up to three official candidate previews with relevant content and a narrow layout.',
        'Confirm exact free item, current source revision, license, assets, dependency versions, and compatibility.',
        'Choose one main foundation; reuse its tokens and interaction primitives. Add other blocks only for named gaps.',
        'Record why it fits, what will change, retained notices, and any unverified condition before adoption.',
      ],
    },
    execution: reviewOnly ? [
      'Read supplied source and inspect the UI when available; do not edit files.',
      'Identify concrete strengths and assess the actual task, constraints, accessibility, and platform behavior.',
      'Choose Keep, Refine, Rethink, or Insufficient evidence from observed evidence; no invented defects or framework-based verdict.',
      'Give zero to three priority corrections with location, issue, impact, smallest fix, and verification. Disclose additional critical blockers.',
      'Suggest a better implementation only when warranted, including the first step, preserved behavior, and tradeoff. Do not start the changes.',
      'Keep the report concise and mark material missing checks unverified.',
    ] : [
      'Inspect existing routes, components, brand, and data boundaries. Preserve working behavior during redesign.',
      'Create a concise product contract, task flow, visual direction, semantic tokens, and acceptance checks.',
      'Inspect shortlisted sources; select one compatible foundation or justify custom primitives.',
      'Build a representative working slice with realistic content and all applicable states; render and critique.',
      'Extend the same system through the primary journey; verify layout, keyboard, errors, build, and tests.',
      'Deliver the artifact, commands, resource provenance, actual evidence, and remaining limitations.',
    ],
    limits: ['Rankings are explicit heuristics, not a live design review or model verdict.', ...project.warnings],
  };
}
