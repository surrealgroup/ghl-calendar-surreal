/* SURREAL GROUP · Agenda GHL · tela de CANCELAMENTO: oferece "Remarcar para outro dia".
   Hospedado junto do CSS (surrealgroup/ghl-calendar-surreal · GitHub Pages) e carregado UMA vez
   pelo campo "Insira código personalizado" do calendário.
   - Só age na tela de cancelamento (existe .hl_calendar_widget-cancellation-inner-padding).
   - Lê o event_id da query string da própria página e monta
     <origem>/widget/booking/<calendarId>?event_id=<id>  (funciona em msgsndr.com, api.leadconnectorhq.com
     e em domínio branded). Não envia dados a lugar nenhum; só cria um link.
   - Depois de cancelada, a oferta vira "agendar um novo horário" (sem event_id). */
(function () {
  if (window.__sgCancelLoaded) return;
  window.__sgCancelLoaded = 1;

  var CAL_FALLBACK = 'NryhANunHOaPLF8sjqJB';
  var ID_RE = /^[A-Za-z0-9_-]{6,64}$/;

  function eventId() {
    var v = '';
    try { v = new URLSearchParams(location.search).get('event_id') || ''; } catch (e) {}
    return ID_RE.test(v) ? v : '';
  }

  function calendarId() {
    // o GHL marca a raiz do widget com a classe "calendar-<id>" (ex.: appointment_widgets--revamp--booking calendar-AbC...)
    var root = document.querySelector('.appointment_widgets--revamp--booking');
    var m = root && String(root.className).match(/(?:^|\s)calendar-([A-Za-z0-9]{12,40})(?:\s|$)/);
    return m ? m[1] : CAL_FALLBACK;
  }

  function buildHref(withEvent) {
    var href = location.origin + '/widget/booking/' + calendarId();
    var eid = eventId();
    if (withEvent && eid) href += '?event_id=' + encodeURIComponent(eid);
    return href;
  }

  var ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3.5v3M16 3.5v3M3.5 10h17"/><path d="M9 15.5l2 2 4-4"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  var CHECK = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  function make(kind) {
    var box = document.createElement('div');
    box.id = 'sg-resched';
    box.className = 'sg-resched sg-resched--' + kind;
    var after = kind === 'after';
    box.innerHTML =
      '<div class="sg-resched__icon">' + ICON + '</div>' +
      '<div class="sg-resched__body">' +
        '<h3 class="sg-resched__title"></h3>' +
        '<p class="sg-resched__text"></p>' +
        '<ul class="sg-resched__perks"></ul>' +
        '<a class="sg-resched__btn" rel="noopener"><span></span>' + ARROW + '</a>' +
      '</div>';
    box.querySelector('.sg-resched__title').textContent = after ? 'Quer escolher um novo horário?' : 'Prefere escolher outro dia?';
    box.querySelector('.sg-resched__text').textContent = after
      ? 'Sua conversa continua de pé. Escolha uma nova data em menos de um minuto.'
      : 'Sem problema, a agenda se ajusta a você. Escolha outro horário e a conversa continua de onde parou.';
    var perks = after ? ['Menos de 1 minuto', 'Confirmação por e-mail'] : ['Menos de 1 minuto', 'Sem perder o seu lugar'];
    var ul = box.querySelector('.sg-resched__perks');
    perks.forEach(function (t) {
      var li = document.createElement('li');
      li.innerHTML = CHECK + '<span></span>';
      li.querySelector('span').textContent = t;
      ul.appendChild(li);
    });
    box.querySelector('.sg-resched__btn span').textContent = after ? 'Agendar novo horário' : 'Remarcar para outro dia';
    box.querySelector('.sg-resched__btn').href = buildHref(!after);
    return box;
  }

  function render() {
    var form = document.querySelector('.hl_calendar_widget-cancellation-inner-padding');
    var ex = document.getElementById('sg-resched');
    if (!form || !eventId()) { if (ex && ex.parentNode) ex.parentNode.removeChild(ex); return; }
    var kind = form.querySelector('h5') ? 'after' : 'before';
    if (ex && ex.classList.contains('sg-resched--' + kind) && ex.parentNode === form) return;
    if (ex && ex.parentNode) ex.parentNode.removeChild(ex);
    form.insertBefore(make(kind), form.firstChild);
  }

  var t = null;
  function schedule() { if (t) return; t = setTimeout(function () { t = null; render(); }, 60); }
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  render();
})();
