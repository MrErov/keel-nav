window.__ModuleLoader__.load({
  id: '@local/keel-nav',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useState } = React;
    const PANEL_ID = 'keel-nav';
    const NS = 'keelNav';

    const copyEn = {
      panel: 'Keel Nav',
      title: '⚓ Keel Nav',
      subtitle: 'Methodology status and actions for the active chat.',
      refresh: 'Refresh',
      loading: 'Scanning Keel Nav Markdown…',
      noSession: 'Open a session in the workspace to scan Keel Nav and send actions.',
      workspace: 'Working directory',
      unknownWorkspace: 'The session does not expose a working directory.',
      methodology: 'Methodology',
      specsFolder: 'Specs',
      found: 'Found',
      missing: 'Not found',
      unreadable: 'Unreadable',
      markdownFiles: 'Markdown files',
      specsFound: 'specs found',
      noSpecs: 'No .spec.md files in specs/.',
      specsTitle: 'Workspace specs',
      selectedHint: 'Select a spec for phases 1b, 2, 3, and 4.',
      unknownStatus: 'no status',
      readError: 'read error',
      quickActions: 'Quick actions',
      quickActionsHint: 'They only send a prompt to the agent; this plugin never modifies files.',
      installKeelNav: 'Install Keel Nav in this project',
      installKeelNavHint: 'No .meta-skills/ folder was found. Send the installation prompt to the active chat.',
      phase0: 'Start Phase 0 (Context Bootstrap)',
      phase0Hint: 'Map repository context, dependencies, and risks.',
      phase1a: 'Start Phase 1a (Write Spec)',
      phase1aHint: 'SDD: one User Story, one bounded spec, and its test plan.',
      phase1b: 'Start Phase 1b (Goldfish Audit)',
      phase1bHint: 'Orchestrates a blind audit in a fresh subagent.',
      phase2: 'Start Phase 2 (TDD)',
      phase2Hint: 'RED → GREEN → REFACTOR, only after passing the Goldfish gate.',
      phase3: 'Start Phase 3 (ODD Vertical Slices)',
      phase3Hint: 'Wire an observable vertical slice for the selected spec.',
      phase4: 'Start Phase 4 (Drift Control)',
      phase4Hint: 'Compare the implementation with the spec and generate the drift report.',
      selectedSpec: 'Selected spec',
      selectSpecFirst: 'Select a spec first',
      sending: 'Sending…',
      promptFailed: 'Could not send the prompt',
      scanFailed: 'Could not complete the scan',
      truncated: 'The specs folder has more entries than shown; narrow the directory to see them all.',
      auditRound: 'Next audit round detected from filenames',
      readOnly: 'READ-ONLY',
      closeNotice: 'Dismiss notice',
    };

    const copyEs = {
      panel: 'Keel Nav',
      title: '⚓ Keel Nav',
      subtitle: 'Estado de la metodología y acciones para el chat activo.',
      refresh: 'Actualizar',
      loading: 'Escaneando Markdown de Keel Nav…',
      noSession: 'Abre una sesión en el workspace para escanear Keel Nav y enviar acciones.',
      workspace: 'Directorio de trabajo',
      unknownWorkspace: 'La sesión no expone un directorio de trabajo.',
      methodology: 'Metodología',
      specsFolder: 'Specs',
      found: 'Encontrada',
      missing: 'No encontrada',
      unreadable: 'No legible',
      markdownFiles: 'archivos Markdown',
      specsFound: 'specs encontradas',
      noSpecs: 'No hay archivos .spec.md en specs/.',
      specsTitle: 'Specs del workspace',
      selectedHint: 'Selecciona una spec para las fases 1b, 2, 3 y 4.',
      unknownStatus: 'sin estado',
      readError: 'error de lectura',
      quickActions: 'Acciones rápidas',
      quickActionsHint: 'Solo envían un prompt al agente; este plugin nunca modifica archivos.',
      installKeelNav: 'Instalar Keel Nav en este proyecto',
      installKeelNavHint: 'No se encontró la carpeta .meta-skills/. Envía el prompt de instalación al chat activo.',
      phase0: 'Iniciar Fase 0 (Context Bootstrap)',
      phase0Hint: 'Mapea el contexto, las dependencias y los riesgos del repositorio.',
      phase1a: 'Iniciar Fase 1a (Escribir Spec)',
      phase1aHint: 'SDD: una User Story, una spec acotada y su plan de tests.',
      phase1b: 'Iniciar Fase 1b (Auditoría Goldfish)',
      phase1bHint: 'Orquesta una auditoría ciega en un subagente nuevo.',
      phase2: 'Iniciar Fase 2 (TDD)',
      phase2Hint: 'RED → GREEN → REFACTOR, solo tras superar la compuerta Goldfish.',
      phase3: 'Iniciar Fase 3 (ODD Vertical Slices)',
      phase3Hint: 'Cablea un vertical slice observable para la spec seleccionada.',
      phase4: 'Iniciar Fase 4 (Drift Control)',
      phase4Hint: 'Compara la implementación con la spec y genera el drift report.',
      selectedSpec: 'Spec seleccionada',
      selectSpecFirst: 'Selecciona una spec primero',
      sending: 'Enviando…',
      promptFailed: 'No se pudo enviar el prompt',
      scanFailed: 'No se pudo completar el escaneo',
      truncated: 'La carpeta specs tiene más entradas de las mostradas; acota el directorio para verlas todas.',
      auditRound: 'Siguiente ronda de auditoría detectada por nombre',
      readOnly: 'SOLO LECTURA',
      closeNotice: 'Cerrar aviso',
    };

    const CSS = `
      .keel-nav-page {
        box-sizing: border-box;
        height: 100%;
        overflow: auto;
        padding: 30px;
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-base);
        font: inherit;
      }
      .keel-nav-page * { box-sizing: border-box; }
      .keel-nav-container { max-width: 1040px; margin: 0 auto; }
      .keel-nav-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 24px;
      }
      .keel-nav-title { margin: 0 0 7px; font-size: 25px; line-height: 1.2; font-weight: 650; }
      .keel-nav-subtitle, .keel-nav-muted { color: var(--dsw-alias-label-secondary); }
      .keel-nav-subtitle { margin: 0; font-size: 14px; line-height: 1.5; }
      .keel-nav-workspace {
        margin-top: 12px;
        color: var(--dsw-alias-label-secondary);
        font-size: 12px;
        overflow-wrap: anywhere;
      }
      .keel-nav-workspace code { color: var(--dsw-alias-label-primary); }
      .keel-nav-button {
        appearance: none;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px;
        background: var(--dsw-alias-bg-layer-1);
        color: var(--dsw-alias-label-primary);
        font: inherit;
        cursor: pointer;
      }
      .keel-nav-button:hover:not(:disabled) { border-color: var(--dsw-alias-brand-primary); }
      .keel-nav-button:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
      .keel-nav-button:disabled { cursor: not-allowed; opacity: 0.5; }
      .keel-nav-refresh { flex: none; padding: 8px 13px; font-size: 13px; }
      .keel-nav-readonly {
        display: inline-flex;
        margin-left: 10px;
        padding: 3px 7px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 5px;
        color: var(--dsw-alias-state-success-primary);
        font-size: 10px;
        font-weight: 650;
        letter-spacing: 0.06em;
        vertical-align: middle;
      }
      .keel-nav-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
      .keel-nav-card {
        padding: 17px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 11px;
        background: var(--dsw-alias-bg-layer-1);
      }
      .keel-nav-card-title { margin: 0 0 12px; font-size: 14px; font-weight: 650; }
      .keel-nav-folder { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .keel-nav-folder-name { font-family: inherit; font-size: 13px; overflow-wrap: anywhere; }
      .keel-nav-folder-meta { margin-top: 7px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
      .keel-nav-badge {
        flex: none;
        padding: 3px 8px;
        border: 1px solid currentColor;
        border-radius: 999px;
        font-size: 11px;
        line-height: 1.4;
      }
      .keel-nav-success { color: var(--dsw-alias-state-success-primary); }
      .keel-nav-warn { color: var(--dsw-alias-state-warn-primary); }
      .keel-nav-error { color: var(--dsw-alias-state-error-primary); }
      .keel-nav-idle { color: var(--dsw-alias-label-secondary); }
      .keel-nav-section { margin-top: 25px; }
      .keel-nav-section-heading { margin: 0 0 5px; font-size: 17px; font-weight: 650; }
      .keel-nav-section-hint { margin: 0 0 13px; color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 1.5; }
      .keel-nav-spec-list { display: flex; flex-direction: column; gap: 8px; }
      .keel-nav-spec {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding: 13px 15px;
        text-align: left;
      }
      .keel-nav-spec[aria-pressed="true"] {
        border-color: var(--dsw-alias-brand-primary);
        background: var(--dsw-alias-bg-layer-2);
      }
      .keel-nav-spec-name { display: block; font-size: 13px; font-weight: 600; overflow-wrap: anywhere; }
      .keel-nav-spec-path { display: block; margin-top: 4px; color: var(--dsw-alias-label-secondary); font-size: 11px; overflow-wrap: anywhere; }
      .keel-nav-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 11px; }
      .keel-nav-action { min-height: 108px; padding: 14px; text-align: left; }
      .keel-nav-action:disabled { color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-1); }
      .keel-nav-action-title { display: block; font-size: 13px; font-weight: 650; line-height: 1.45; }
      .keel-nav-action-hint { display: block; margin-top: 8px; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 1.45; }
      .keel-nav-bootstrap {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 0 0 18px;
        padding: 18px 20px;
        border-color: var(--dsw-alias-brand-primary);
        background: var(--dsw-alias-brand-primary);
        color: var(--dsw-alias-bg-base);
        text-align: left;
      }
      .keel-nav-bootstrap:hover:not(:disabled) {
        border-color: var(--dsw-alias-brand-primary);
        box-shadow: 0 0 0 3px var(--dsw-alias-border-l2);
      }
      .keel-nav-bootstrap-title { font-size: 15px; font-weight: 650; line-height: 1.4; }
      .keel-nav-bootstrap-hint { color: inherit; font-size: 12px; line-height: 1.5; opacity: 0.85; }
      .keel-nav-selected { margin: 0 0 13px; font-size: 12px; color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }
      .keel-nav-selected code { color: var(--dsw-alias-label-primary); }
      .keel-nav-empty, .keel-nav-notice {
        padding: 16px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 9px;
        background: var(--dsw-alias-bg-layer-1);
        color: var(--dsw-alias-label-secondary);
        font-size: 13px;
        line-height: 1.5;
      }
      .keel-nav-notice { margin-bottom: 14px; }
      .keel-nav-notice-error { color: var(--dsw-alias-state-error-primary); }
      .keel-nav-small { margin-top: 10px; font-size: 11px; color: var(--dsw-alias-label-secondary); }
      @media (max-width: 820px) {
        .keel-nav-page { padding: 20px; }
        .keel-nav-actions { grid-template-columns: 1fr; }
        .keel-nav-action { min-height: 0; }
      }
      @media (max-width: 560px) {
        .keel-nav-grid { grid-template-columns: 1fr; }
        .keel-nav-header { flex-direction: column; }
      }
    `;

    function errorMessage(error) {
      if (!error) return 'Error desconocido';
      if (typeof error === 'string') return error;
      if (error.error) return errorMessage(error.error);
      return error.message || error.code || String(error);
    }

    function metadata(text, key) {
      const match = text.match(new RegExp(`^[\\t ]*${key}[\\t ]*:[\\t ]*(.+?)[\\t ]*$`, 'mi'));
      if (!match) return null;
      let value = match[1].replace(/[\t ]+#.*$/, '').trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1).trim();
      }
      if (value.includes('|')) value = value.split('|')[0].trim();
      return value ? value.slice(0, 160) : null;
    }

    function statusTone(status) {
      const normalized = (status || '').toLowerCase();
      if (['audited', 'approved', 'implemented', 'observed', 'certified'].includes(normalized)) return 'success';
      if (['draft', 'pending'].includes(normalized)) return 'warn';
      if (normalized === 'error de lectura') return 'error';
      return 'idle';
    }

    async function listFolder(ctx, sessionId, path, signal) {
      try {
        const result = await ctx.remote.workspaceFiles.list(sessionId, path, signal);
        if (result.ok) {
          return {
            exists: true,
            entries: result.value.entries,
            truncated: result.value.truncated,
            error: null,
          };
        }
        if (result.error && result.error.code === 'workspace-file/not-found') {
          return { exists: false, entries: [], truncated: false, error: null };
        }
        return { exists: false, entries: [], truncated: false, error: errorMessage(result) };
      } catch (error) {
        if (error && error.code === 'workspace-file/not-found') {
          return { exists: false, entries: [], truncated: false, error: null };
        }
        return { exists: false, entries: [], truncated: false, error: errorMessage(error) };
      }
    }

    function auditInfo(entries, specName) {
      const stem = specName.slice(0, -'.spec.md'.length);
      const expression = new RegExp(`^${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.audit\\.(\\d+)\\.md$`, 'i');
      const rounds = [];
      for (const entry of entries) {
        if (entry.type !== 'file') continue;
        const match = entry.name.match(expression);
        if (match) rounds.push(Number(match[1]));
      }
      rounds.sort((a, b) => a - b);
      const latest = rounds.length ? rounds[rounds.length - 1] : 0;
      return {
        nextRound: latest + 1,
        latestPath: latest ? `specs/${stem}.audit.${latest}.md` : null,
      };
    }

    async function scanWorkspace(ctx, sessionId, signal) {
      const [metaSkills, specsFolder] = await Promise.all([
        listFolder(ctx, sessionId, '.meta-skills', signal),
        listFolder(ctx, sessionId, 'specs', signal),
      ]);
      const markdownCount = metaSkills.entries.filter((entry) => entry.type === 'file' && entry.name.toLowerCase().endsWith('.md')).length;
      const specEntries = specsFolder.entries
        .filter((entry) => entry.type === 'file' && entry.name.toLowerCase().endsWith('.spec.md'))
        .sort((left, right) => left.name.localeCompare(right.name));
      const specs = await Promise.all(specEntries.map(async (entry) => {
        const path = `specs/${entry.name}`;
        const rounds = auditInfo(specsFolder.entries, entry.name);
        try {
          const result = await ctx.remote.workspaceFiles.read(sessionId, path, { offset: 0, limit: 200 }, signal);
          if (!result.ok) {
            return { name: entry.name, path, status: 'error de lectura', auditPath: null, error: errorMessage(result), ...rounds };
          }
          const text = result.value.text;
          const declaredAudit = metadata(text, 'goldfish_audit');
          return {
            name: entry.name,
            path,
            status: metadata(text, 'status'),
            auditPath: declaredAudit && declaredAudit !== 'pending' ? declaredAudit : rounds.latestPath,
            auditDeclared: Boolean(declaredAudit && declaredAudit !== 'pending'),
            error: null,
            ...rounds,
          };
        } catch (error) {
          return { name: entry.name, path, status: 'error de lectura', auditPath: null, error: errorMessage(error), ...rounds };
        }
      }));
      return {
        metaSkills: { ...metaSkills, markdownCount },
        specsFolder,
        specs,
        specListTruncated: specsFolder.truncated,
      };
    }

    function workspaceLine(cwd) {
      return cwd ? `Directorio de trabajo actual: ${cwd}\n` : '';
    }

    function phaseRequiresSpec(phase) {
      return !['bootstrap', '0', '1a'].includes(phase);
    }

    function actionDisabled(phase, { sessionId, methodologyReady, busyPhase, selected }) {
      return !sessionId || Boolean(busyPhase) || (phaseRequiresSpec(phase) && (!methodologyReady || !selected));
    }

    function buildPrompt(phase, cwd, spec) {
      const root = workspaceLine(cwd);
      if (phase === 'bootstrap') {
        return 'Este proyecto no tiene Keel Nav instalado. Por favor, ejecuta los siguientes comandos en la terminal para instalarlo:\n' +
          'git clone https://github.com/MrErov/keel-nav.git /tmp/keel-nav-temp\n' +
          'cp -r /tmp/keel-nav-temp/.meta-skills .\n' +
          'cp -r /tmp/keel-nav-temp/templates .\n' +
          'rm -rf /tmp/keel-nav-temp\n' +
          'Una vez instalado, avísame para poder iniciar la Fase 0.';
      }
      if (phase === '0') {
        return 'Lee .meta-skills/00-context-bootstrap.md y ejecuta la Fase 0 para mapear este repositorio.';
      }
      if (phase === '1a') {
        return `${root}Quiero iniciar Keel Nav — Fase 1a (SDD / Escribir Spec).\n\n` +
          'Lee y aplica estrictamente `.meta-skills/01-sdd-spec-writer.md` y `AGENTS.md`. ' +
          'La plantilla obligatoria es `templates/spec.template.md`; la única salida permitida es `specs/<US-ID>.spec.md`.\n\n' +
          'Antes de escribir, valida las entradas y prerrequisitos de la meta-skill. Si falta la User Story, el US-ID o el `context_doc`, ' +
          'pídemelos como Navigator y no los inventes. Respeta los límites, la trazabilidad y todas las compuertas. ' +
          'No escribas código ni tests, no ejecutes build/tests y no realices la auditoría Goldfish inline. Detente tras el handoff de la fase.';
      }
      if (phase === '1b') {
        return `${root}Quiero iniciar Keel Nav — Fase 1b (Auditoría Goldfish).\n\n` +
          `Meta-skill: \`.meta-skills/02-egm-goldfish-audit.md\`.\nSpec seleccionada (\`spec_path\`): \`${spec.path}\`.\n` +
          `Ronda de auditoría (\`audit_round\`): ${spec.nextRound}, calculada solo a partir de nombres de archivos existentes.\n\n` +
          'Actúa únicamente como orquestador: usa la herramienta `subagent` para crear un agente nuevo y ciego; no uses `subagent_fork` y no audites inline. ' +
          'Pásale solo la meta-skill, el texto completo de la spec, el texto completo del `context_doc` y la ronda indicada, sin historial, razonamientos ni auditorías previas. ' +
          'Si falta o es ambiguo el `context_doc`, pídemelo antes de lanzar el subagente. El subagente debe respetar exactamente sus entradas, salidas y compuertas; ' +
          'no propongas correcciones ni avances a TDD por iniciativa propia.';
      }
      if (phase === '3') {
        return `Lee .meta-skills/04-odd-vertical-slice.md y ejecuta la Fase 3 para la spec ${spec.path}.`;
      }
      if (phase === '4') {
        return `Lee .meta-skills/05-drift-control.md y ejecuta la Fase 4 para la spec ${spec.path}.`;
      }
      return `${root}Quiero iniciar Keel Nav — Fase 2 (TDD estricto).\n\n` +
        `Meta-skill: \`.meta-skills/03-tdd-cycle.md\`.\nSpec seleccionada (\`spec_path\`): \`${spec.path}\`.\n` +
        `Auditoría (\`audit_path\`): ${spec.auditPath ? `\`${spec.auditPath}\`` : 'no declarada; la compuerta debe detener la fase'}.\n\n` +
        'Lee y aplica `AGENTS.md` y la meta-skill. Verifica primero que la spec está `audited` o `approved`, que `goldfish_audit` apunta a un archivo existente ' +
        'y que el veredicto efectivo es `audited`. Si cualquier compuerta falla, detente y escala; no escribas código. ' +
        'Si pasa, ejecuta estrictamente RED → GREEN → REFACTOR dentro del plan de tests y los contratos de la spec. No avances a ODD ni Drift Control.';
    }

    function KeelNavIcon({ size, active }) {
      return h('span', {
        'aria-hidden': true,
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          fontSize: Math.max(16, size * 0.9),
          lineHeight: 1,
          color: active ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-label-secondary)',
        },
      }, '⚓');
    }

    function FolderCard({ title, path, folder, detail, t }) {
      const tone = folder.error ? 'error' : folder.exists ? 'success' : 'warn';
      const label = folder.error ? t('unreadable') : folder.exists ? t('found') : t('missing');
      return h('article', { className: 'keel-nav-card' },
        h('h3', { className: 'keel-nav-card-title' }, title),
        h('div', { className: 'keel-nav-folder' },
          h('code', { className: 'keel-nav-folder-name' }, path),
          h('span', { className: `keel-nav-badge keel-nav-${tone}` }, label)),
        h('div', { className: 'keel-nav-folder-meta' }, folder.error || (folder.exists ? detail : '—')));
    }

    function KeelNavPage({ useSessions, keelNav }) {
      const { ctx, t } = keelNav;
      const current = useSessions((snapshot) => Object.values(snapshot.byId).find((row) => (row.retainedBy.mainView || 0) > 0));
      const sessionId = current && current.id;
      const cwd = current && current.cwd;
      const [refreshVersion, setRefreshVersion] = useState(0);
      const [loading, setLoading] = useState(false);
      const [data, setData] = useState(null);
      const [scanFailure, setScanFailure] = useState(null);
      const [selectedPath, setSelectedPath] = useState(null);
      const [busyPhase, setBusyPhase] = useState(null);
      const [actionFailure, setActionFailure] = useState(null);

      useEffect(() => {
        setSelectedPath(null);
        setActionFailure(null);
        if (!sessionId) {
          setData(null);
          setLoading(false);
          setScanFailure(null);
          return undefined;
        }
        const controller = new AbortController();
        let active = true;
        setLoading(true);
        setScanFailure(null);
        scanWorkspace(ctx, sessionId, controller.signal).then((next) => {
          if (!active) return;
          setData(next);
          setLoading(false);
        }).catch((error) => {
          if (!active) return;
          setScanFailure(errorMessage(error));
          setLoading(false);
        });
        return () => {
          active = false;
          controller.abort();
        };
      }, [sessionId, refreshVersion]);

      const specs = data ? data.specs : [];
      const selected = specs.find((spec) => spec.path === selectedPath) || null;
      const methodologyReady = Boolean(data && data.metaSkills.exists && !data.metaSkills.error);

      async function sendPhase(phase) {
        if (actionDisabled(phase, { sessionId, methodologyReady, busyPhase, selected })) return;
        setBusyPhase(phase);
        setActionFailure(null);
        try {
          const prompt = buildPrompt(phase, cwd, selected);
          const result = await ctx.sessions.using(sessionId, { source: 'controllerOperation' }, (reference) => (
            reference.binding.session.prompt([{ type: 'text', text: prompt }], 'queue')
          ));
          if (!result.ok) throw new Error(errorMessage(result));
          ctx.layout.selectPanel(null);
        } catch (error) {
          setActionFailure(`${t('promptFailed')}: ${errorMessage(error)}`);
        } finally {
          setBusyPhase(null);
        }
      }

      function actionButton(phase, title, hint) {
        const missingSpec = phaseRequiresSpec(phase) && !selected;
        const disabled = actionDisabled(phase, { sessionId, methodologyReady, busyPhase, selected });
        return h('button', {
          type: 'button',
          className: 'keel-nav-button keel-nav-action',
          disabled,
          title: missingSpec ? t('selectSpecFirst') : t(hint),
          onClick: () => sendPhase(phase),
        },
        h('span', { className: 'keel-nav-action-title' }, busyPhase === phase ? t('sending') : t(title)),
        h('span', { className: 'keel-nav-action-hint' }, missingSpec ? t('selectSpecFirst') : t(hint)));
      }

      return h('div', { className: 'keel-nav-page' },
        h('style', null, CSS),
        h('div', { className: 'keel-nav-container' },
          h('header', { className: 'keel-nav-header' },
            h('div', null,
              h('h1', { className: 'keel-nav-title' }, t('title'), h('span', { className: 'keel-nav-readonly' }, t('readOnly'))),
              h('p', { className: 'keel-nav-subtitle' }, t('subtitle')),
              sessionId && h('div', { className: 'keel-nav-workspace' }, `${t('workspace')}: `, h('code', null, cwd || t('unknownWorkspace')))),
            h('button', {
              type: 'button',
              className: 'keel-nav-button keel-nav-refresh',
              disabled: !sessionId || loading || Boolean(busyPhase),
              onClick: () => setRefreshVersion((value) => value + 1),
            }, loading ? t('loading') : t('refresh'))),
          !sessionId && h('div', { className: 'keel-nav-empty' }, t('noSession')),
          sessionId && scanFailure && h('div', { className: 'keel-nav-notice keel-nav-notice-error' }, `${t('scanFailed')}: ${scanFailure}`),
          sessionId && data && h(React.Fragment, null,
            h('div', { className: 'keel-nav-grid' },
              h(FolderCard, {
                title: t('methodology'), path: '.meta-skills/', folder: data.metaSkills,
                detail: `${data.metaSkills.markdownCount} ${t('markdownFiles')}`, t,
              }),
              h(FolderCard, {
                title: t('specsFolder'), path: 'specs/', folder: data.specsFolder,
                detail: `${data.specs.length} ${t('specsFound')}`, t,
              })),
            h('section', { className: 'keel-nav-section' },
              h('h2', { className: 'keel-nav-section-heading' }, t('specsTitle')),
              h('p', { className: 'keel-nav-section-hint' }, t('selectedHint')),
              data.specListTruncated && h('div', { className: 'keel-nav-notice' }, t('truncated')),
              specs.length === 0 && h('div', { className: 'keel-nav-empty' }, t('noSpecs')),
              specs.length > 0 && h('div', { className: 'keel-nav-spec-list', role: 'group', 'aria-label': t('specsTitle') },
                specs.map((spec) => {
                  const status = spec.status || t('unknownStatus');
                  return h('button', {
                    key: spec.path,
                    type: 'button',
                    className: 'keel-nav-button keel-nav-spec',
                    'aria-pressed': selected && selected.path === spec.path,
                    onClick: () => setSelectedPath(spec.path),
                  },
                  h('span', null,
                    h('span', { className: 'keel-nav-spec-name' }, spec.name),
                    h('span', { className: 'keel-nav-spec-path' }, spec.path),
                    spec.error && h('span', { className: 'keel-nav-spec-path keel-nav-error' }, spec.error)),
                  h('span', { className: `keel-nav-badge keel-nav-${statusTone(status)}` }, status));
                }))),
            h('section', { className: 'keel-nav-section' },
              h('h2', { className: 'keel-nav-section-heading' }, t('quickActions')),
              h('p', { className: 'keel-nav-section-hint' }, t('quickActionsHint')),
              actionFailure && h('div', { className: 'keel-nav-notice keel-nav-notice-error', role: 'alert' }, actionFailure),
              data.metaSkills.exists === false && h('button', {
                type: 'button',
                className: 'keel-nav-button keel-nav-bootstrap',
                disabled: actionDisabled('bootstrap', { sessionId, methodologyReady, busyPhase, selected }),
                title: t('installKeelNavHint'),
                onClick: () => sendPhase('bootstrap'),
              },
              h('span', { className: 'keel-nav-bootstrap-title' }, busyPhase === 'bootstrap' ? t('sending') : t('installKeelNav')),
              h('span', { className: 'keel-nav-bootstrap-hint' }, t('installKeelNavHint'))),
              h('p', { className: 'keel-nav-selected' }, `${t('selectedSpec')}: `,
                selected ? h('code', null, selected.path) : '—'),
              !selected && h('p', { className: 'keel-nav-selected', role: 'note' }, t('selectSpecFirst')),
              selected && h('p', { className: 'keel-nav-selected' }, `${t('auditRound')}: ${selected.nextRound}`),
              h('div', { className: 'keel-nav-actions' },
                actionButton('0', 'phase0', 'phase0Hint'),
                actionButton('1a', 'phase1a', 'phase1aHint'),
                actionButton('1b', 'phase1b', 'phase1bHint'),
                actionButton('2', 'phase2', 'phase2Hint'),
                actionButton('3', 'phase3', 'phase3Hint'),
                actionButton('4', 'phase4', 'phase4Hint'))))));
    }

    return {
      inject: ['slots', 'locale', 'sessions', 'layout', 'remote', 'remote.workspaceFiles'],
      apply(ctx) {
        ctx.effect(() => {
          const registrations = [
            ctx.locale.register(NS, 'en', copyEn),
            ctx.locale.register(NS, 'es', copyEs),
          ];
          return () => registrations.forEach((dispose) => dispose());
        }, 'keel-nav: dictionaries');
        const t = ctx.locale.bind(NS);
        ctx.effect(() => ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
          locale: NS,
          inject: () => ({ keelNav: { ctx, t } }),
        }, KeelNavPage)), 'keel-nav: main panel');
        ctx.effect(() => ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 20,
          locale: NS,
          label: () => t('panel'),
        }, KeelNavIcon)), 'keel-nav: sidebar entry');
      },
    };
  },
});
