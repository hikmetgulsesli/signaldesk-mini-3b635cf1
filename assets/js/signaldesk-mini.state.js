/* SignalDesk Mini — state module */
(function () {
  'use strict';

  const STATUS_LIST = ['open', 'acknowledged', 'closed'];
  const PRIORITY_LIST = ['high', 'medium', 'low'];

  const defaultPreferences = {
    density: 'comfortable',
    notifications: true,
    defaultView: 'operations',
    savedFilters: []
  };

  const initialState = {
    view: 'operations',
    lastError: null,
    records: [],
    nextId: 1,
    filter: { search: '', status: '', priority: '' },
    editor: { id: null, draft: {}, errors: {} },
    preferences: { ...defaultPreferences },
    insightsFilter: 'all',
    tickCount: 0,
    loaded: false
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function makeRecord(draft, id) {
    const now = Date.now();
    return {
      id: id || draft.id || cryptoRandomId(),
      title: (draft.title || '').trim(),
      details: (draft.details || '').trim(),
      status: STATUS_LIST.includes(draft.status) ? draft.status : 'open',
      priority: PRIORITY_LIST.includes(draft.priority) ? draft.priority : 'medium',
      tags: (draft.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      createdAt: draft.createdAt || now,
      updatedAt: now
    };
  }

  function cryptoRandomId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function reducer(state, action) {
    const s = clone(state);
    switch (action.type) {
      case 'HYDRATE': {
        const saved = action.saved || {};
        s.records = Array.isArray(saved.records) ? saved.records : [];
        s.nextId = typeof saved.nextId === 'number' ? saved.nextId : s.records.length + 1;
        s.preferences = { ...defaultPreferences, ...(saved.preferences || {}) };
        s.filter = { ...initialState.filter, ...(saved.filter || {}) };
        s.view = saved.view || initialState.view;
        s.loaded = true;
        return s;
      }
      case 'SET_VIEW':
        s.view = action.view || 'operations';
        s.lastError = null;
        return s;
      case 'TICK':
        s.tickCount += 1;
        return s;
      case 'CREATE_RECORD':
        s.editor = {
          id: 'new',
          draft: { status: 'open', priority: 'medium' },
          errors: {}
        };
        s.view = 'editor';
        return s;
      case 'SELECT_RECORD': {
        const rec = s.records.find(r => r.id === action.id);
        if (rec) {
          s.editor = {
            id: rec.id,
            draft: {
              title: rec.title,
              details: rec.details,
              status: rec.status,
              priority: rec.priority,
              tags: rec.tags.join(', ')
            },
            errors: {}
          };
          s.view = 'editor';
        }
        return s;
      }
      case 'UPDATE_DRAFT':
        s.editor.draft[action.field] = action.value;
        s.editor.errors = {};
        return s;
      case 'SAVE_RECORD': {
        const title = (s.editor.draft.title || '').trim();
        if (!title) {
          s.editor.errors.title = 'Title is required';
          return s;
        }
        const record = makeRecord(s.editor.draft, s.editor.id === 'new' ? null : s.editor.id);
        if (s.editor.id === 'new') {
          record.id = 'rec-' + s.nextId;
          s.nextId += 1;
          s.records.unshift(record);
        } else {
          const idx = s.records.findIndex(r => r.id === s.editor.id);
          if (idx >= 0) s.records[idx] = record;
        }
        s.editor = { id: null, draft: {}, errors: {} };
        s.view = 'operations';
        return s;
      }
      case 'CANCEL_EDIT':
        s.editor = { id: null, draft: {}, errors: {} };
        s.view = 'operations';
        return s;
      case 'DELETE_RECORD': {
        s.records = s.records.filter(r => r.id !== action.id);
        if (s.records.length === 0 && s.view === 'operations' && s.lastError) s.view = 'recovery';
        return s;
      }
      case 'SEARCH_RECORDS':
        s.filter.search = (action.q || '').toLowerCase();
        return s;
      case 'SET_STATUS_FILTER':
        s.filter.status = action.status || '';
        return s;
      case 'SET_PRIORITY_FILTER':
        s.filter.priority = action.priority || '';
        return s;
      case 'CLEAR_FILTERS':
        s.filter = { search: '', status: '', priority: '' };
        return s;
      case 'SET_INSIGHTS_FILTER':
        s.insightsFilter = action.filter || 'all';
        return s;
      case 'SET_ERROR':
        s.lastError = action.error || null;
        s.view = 'recovery';
        return s;
      case 'RETRY_LOAD':
        s.lastError = null;
        s.view = 'operations';
        s.records = s.records.length ? s.records : [];
        return s;
      case 'SAVE_PREFERENCES': {
        const prefs = action.preferences || {};
        s.preferences = { ...s.preferences, ...prefs };
        if (prefs.defaultView && prefs.defaultView !== s.view && action.applyView) {
          s.view = prefs.defaultView;
        }
        return s;
      }
      case 'RESET_PREFERENCES':
        s.preferences = { ...defaultPreferences };
        s.filter = { ...initialState.filter };
        return s;
      case 'CLEAR_DATA':
        s.records = [];
        s.nextId = 1;
        s.filter = { ...initialState.filter };
        s.preferences = { ...defaultPreferences };
        s.editor = { id: null, draft: {}, errors: {} };
        s.lastError = null;
        s.view = 'operations';
        return s;
      case 'EXPORT_SUMMARY':
        try {
          const blob = new Blob([JSON.stringify({ records: s.records, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'signaldesk-summary.json';
          a.click();
          URL.revokeObjectURL(url);
        } catch (_) { /* noop */ }
        return s;
      default:
        return s;
    }
  }

  function createStore() {
    let state = clone(initialState);
    const listeners = [];
    return {
      getState() { return state; },
      dispatch(action) {
        state = reducer(state, action);
        listeners.forEach(fn => fn(state, action));
      },
      subscribe(fn) { listeners.push(fn); }
    };
  }

  const store = createStore();

  const actions = {
    setView: view => store.dispatch({ type: 'SET_VIEW', view }),
    createRecord: () => store.dispatch({ type: 'CREATE_RECORD' }),
    selectRecord: id => store.dispatch({ type: 'SELECT_RECORD', id }),
    updateDraft: (field, value) => store.dispatch({ type: 'UPDATE_DRAFT', field, value }),
    saveRecord: () => store.dispatch({ type: 'SAVE_RECORD' }),
    cancelEdit: () => store.dispatch({ type: 'CANCEL_EDIT' }),
    deleteRecord: id => store.dispatch({ type: 'DELETE_RECORD', id }),
    searchRecords: q => store.dispatch({ type: 'SEARCH_RECORDS', q }),
    setStatusFilter: status => store.dispatch({ type: 'SET_STATUS_FILTER', status }),
    setPriorityFilter: priority => store.dispatch({ type: 'SET_PRIORITY_FILTER', priority }),
    clearFilters: () => store.dispatch({ type: 'CLEAR_FILTERS' }),
    setInsightsFilter: filter => store.dispatch({ type: 'SET_INSIGHTS_FILTER', filter }),
    tick: () => store.dispatch({ type: 'TICK' }),
    retryLoad: () => store.dispatch({ type: 'RETRY_LOAD' }),
    setError: error => store.dispatch({ type: 'SET_ERROR', error }),
    savePreferences: preferences => store.dispatch({ type: 'SAVE_PREFERENCES', preferences, applyView: false }),
    resetPreferences: () => store.dispatch({ type: 'RESET_PREFERENCES' }),
    clearData: () => store.dispatch({ type: 'CLEAR_DATA' }),
    exportSummary: () => store.dispatch({ type: 'EXPORT_SUMMARY' })
  };

  window.app = {
    get state() { return store.getState(); },
    actions,
    store
  };

  // Filtering helpers
  function filteredRecords(state) {
    const f = state.filter;
    return state.records.filter(r => {
      const matchesSearch = !f.search ||
        r.title.toLowerCase().includes(f.search) ||
        r.details.toLowerCase().includes(f.search) ||
        r.tags.some(t => t.toLowerCase().includes(f.search));
      const matchesStatus = !f.status || r.status === f.status;
      const matchesPriority = !f.priority || r.priority === f.priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  function formatTime(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleString();
  }

  function badgeClass(prefix, value) {
    return `badge badge-${value}`;
  }

  // Render
  function render(state, action) {
    const views = ['operations', 'editor', 'insights', 'settings', 'recovery'];
    views.forEach(v => {
      const el = document.getElementById('view-' + v);
      if (el) el.classList.toggle('hidden', state.view !== v);
    });

    // nav active state
    document.querySelectorAll('.app-nav button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === state.view);
    });

    // error banner
    const banner = document.getElementById('error-banner');
    if (banner) {
      banner.classList.toggle('hidden', !state.lastError);
      banner.textContent = state.lastError || '';
    }

    if (state.view === 'operations') renderOperations(state);
    if (state.view === 'editor') renderEditor(state);
    if (state.view === 'insights') renderInsights(state);
    if (state.view === 'settings') renderSettings(state);
    if (state.view === 'recovery') renderRecovery(state);
  }

  function renderOperations(state) {
    const records = filteredRecords(state);
    document.querySelector('[data-metric="total"]').textContent = state.records.length;
    document.querySelector('[data-metric="open"]').textContent = state.records.filter(r => r.status === 'open').length;
    document.querySelector('[data-metric="acknowledged"]').textContent = state.records.filter(r => r.status === 'acknowledged').length;
    document.querySelector('[data-metric="high"]').textContent = state.records.filter(r => r.priority === 'high').length;

    const list = document.getElementById('record-list');
    const empty = document.getElementById('operations-empty');
    const container = document.getElementById('record-list-container');

    if (records.length === 0) {
      if (container) container.classList.add('hidden');
      if (empty) empty.classList.remove('hidden');
    } else {
      if (container) container.classList.remove('hidden');
      if (empty) empty.classList.add('hidden');
      list.innerHTML = records.map(r => `
        <tr data-action-id="ACT_SELECT_RECORD" data-record-id="${escapeHtml(r.id)}">
          <td>${escapeHtml(r.title)}<br><small>${escapeHtml(r.tags.join(', '))}</small></td>
          <td><span class="${badgeClass('badge', r.status)}">${escapeHtml(r.status)}</span></td>
          <td><span class="${badgeClass('badge', r.priority)}">${escapeHtml(r.priority)}</span></td>
          <td>${formatTime(r.updatedAt)}</td>
        </tr>
      `).join('');
    }

    // sync filter controls
    const statusSel = document.getElementById('filter-status');
    const prioritySel = document.getElementById('filter-priority');
    const searchInput = document.querySelector('[data-action-id="ACT_SEARCH_RECORDS"]');
    if (statusSel) statusSel.value = state.filter.status;
    if (prioritySel) prioritySel.value = state.filter.priority;
    if (searchInput) searchInput.value = state.filter.search;
  }

  function renderEditor(state) {
    const d = state.editor.draft;
    const titleInput = document.getElementById('edit-title');
    const detailsInput = document.getElementById('edit-details');
    const statusInput = document.getElementById('edit-status');
    const priorityInputs = document.querySelectorAll('[name="edit-priority"]');
    const tagsInput = document.getElementById('edit-tags');
    const heading = document.getElementById('editor-title');

    if (heading) heading.textContent = state.editor.id === 'new' ? 'Create Record' : 'Edit Record';
    if (titleInput) titleInput.value = d.title || '';
    if (detailsInput) detailsInput.value = d.details || '';
    if (statusInput) statusInput.value = d.status || 'open';
    if (tagsInput) tagsInput.value = d.tags || '';
    priorityInputs.forEach(input => { input.checked = (input.value === (d.priority || 'medium')); });

    // show validation
    const existing = document.getElementById('editor-error');
    if (existing) existing.remove();
    if (state.editor.errors.title && titleInput) {
      const err = document.createElement('div');
      err.id = 'editor-error';
      err.className = 'error-banner';
      err.textContent = state.editor.errors.title;
      titleInput.parentElement.appendChild(err);
    }
  }

  function renderInsights(state) {
    const total = state.records.length;
    const open = state.records.filter(r => r.status === 'open').length;
    const openRate = total ? Math.round((open / total) * 100) : 0;
    const closed = state.records.filter(r => r.status === 'closed');
    const avgResolution = closed.length
      ? Math.round(closed.reduce((sum, r) => sum + (r.updatedAt - r.createdAt), 0) / closed.length / 3600000)
      : 0;
    document.querySelector('[data-metric="open-rate"]').textContent = openRate + '%';
    document.querySelector('[data-metric="avg-resolution"]').textContent = avgResolution + 'h';

    let activity = state.records
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 10);
    if (state.insightsFilter === 'high') activity = activity.filter(r => r.priority === 'high');

    const list = document.getElementById('activity-list');
    list.innerHTML = activity.length
      ? activity.map(r => `<li><strong>${escapeHtml(r.title)}</strong> — ${escapeHtml(r.status)} (${escapeHtml(r.priority)}) at ${formatTime(r.updatedAt)}</li>`).join('')
      : '<li>No recent activity.</li>';

    const filterSel = document.getElementById('insight-filter');
    if (filterSel) filterSel.value = state.insightsFilter;
  }

  function renderSettings(state) {
    const prefs = state.preferences;
    document.querySelectorAll('[name="pref-density"]').forEach(input => { input.checked = (input.value === prefs.density); });
    const notif = document.querySelector('[data-pref="notifications"]');
    if (notif) notif.checked = !!prefs.notifications;
    const viewSel = document.getElementById('pref-default-view');
    if (viewSel) viewSel.value = prefs.defaultView;
  }

  function renderRecovery(state) {
    const title = document.getElementById('recovery-title');
    const msg = document.getElementById('recovery-message');
    if (title) title.textContent = state.lastError ? 'Unable to load records' : 'No records yet';
    if (msg) msg.textContent = state.lastError
      ? state.lastError
      : 'Get started by creating a record or clearing any active filters.';
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // Event delegation
  function bindEvents() {
    document.body.addEventListener('click', e => {
      const target = e.target.closest('[data-action-id]');
      if (!target) return;
      const action = target.dataset.actionId;

      if (target.dataset.view) {
        actions.setView(target.dataset.view);
        return;
      }

      switch (action) {
        case 'ACT_CREATE_RECORD':
          actions.createRecord();
          break;
        case 'ACT_SELECT_RECORD': {
          const id = target.dataset.recordId;
          if (id) actions.selectRecord(id);
          break;
        }
        case 'ACT_SAVE_RECORD':
          actions.saveRecord();
          break;
        case 'ACT_CANCEL_EDIT':
          actions.cancelEdit();
          break;
        case 'ACT_SEARCH_RECORDS':
          // input handled via input event; click may be a search button in future
          break;
        case 'ACT_CLEAR_FILTERS':
          actions.clearFilters();
          break;
        case 'ACT_RETRY_LOAD':
          actions.retryLoad();
          break;
        case 'ACT_SAVE_PREFERENCES':
          actions.savePreferences(readPreferences());
          break;
        case 'ACT_RESET_PREFERENCES':
          actions.resetPreferences();
          break;
        case 'ACT_CLEAR_DATA':
          actions.clearData();
          break;
        case 'ACT_FILTER_INSIGHTS':
          // handled by select change
          break;
        case 'ACT_EXPORT_SUMMARY':
          actions.exportSummary();
          break;
        case 'ACT_NOTIFICATIONS':
        case 'ACT_HELP':
        case 'ACT_NAV_OPERATIONS':
        case 'ACT_NAV_INSIGHTS':
        case 'ACT_NAV_SETTINGS':
          // nav/views handled above; notifications/help are no-ops for shell story
          break;
      }
    });

    document.body.addEventListener('input', e => {
      const edit = e.target.closest('[data-edit]');
      if (edit) {
        const field = edit.dataset.edit;
        const value = edit.type === 'radio' ? (edit.checked ? edit.value : undefined) : edit.value;
        if (field && value !== undefined) actions.updateDraft(field, value);
      }
      const search = e.target.closest('[data-action-id="ACT_SEARCH_RECORDS"]');
      if (search) actions.searchRecords(search.value);
    });

    document.body.addEventListener('change', e => {
      const status = e.target.closest('#filter-status');
      if (status) actions.setStatusFilter(status.value);
      const priority = e.target.closest('#filter-priority');
      if (priority) actions.setPriorityFilter(priority.value);
      const insight = e.target.closest('#insight-filter');
      if (insight) actions.setInsightsFilter(insight.value);
    });

    document.body.addEventListener('submit', e => {
      const form = e.target.closest('#editor-form');
      if (form) {
        e.preventDefault();
        actions.saveRecord();
      }
      const settingsForm = e.target.closest('#settings-form');
      if (settingsForm) {
        e.preventDefault();
        actions.savePreferences(readPreferences());
      }
    });
  }

  function readPreferences() {
    const density = document.querySelector('[name="pref-density"]:checked');
    const notifications = document.querySelector('[data-pref="notifications"]');
    const defaultView = document.getElementById('pref-default-view');
    return {
      density: density ? density.value : 'comfortable',
      notifications: notifications ? notifications.checked : true,
      defaultView: defaultView ? defaultView.value : 'operations'
    };
  }

  store.subscribe(render);

  window.SignalDeskState = {
    createStore,
    store,
    initialState: clone(initialState),
    defaultPreferences: clone(defaultPreferences),
    actions
  };

  window.renderSignalDesk = function () {
    render(store.getState(), { type: 'INIT' });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindEvents);
  } else {
    bindEvents();
  }
})();
