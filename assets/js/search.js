(function () {
  var form = document.getElementById('search-form');
  if (!form) return;
  var input = document.getElementById('search-q');
  var status = document.getElementById('search-status');
  var list = document.getElementById('search-results');
  var index = null;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function run(q) {
    list.innerHTML = '';
    q = q.trim().toLowerCase();
    if (!q) { status.textContent = ''; return; }
    var words = q.split(/\s+/);
    var hits = [];
    index.forEach(function (d) {
      var t = d.title.toLowerCase(), s = (d.summary || '').toLowerCase(), x = (d.text || '').toLowerCase(), score = 0, ok = true;
      words.forEach(function (w) {
        var w1 = t.indexOf(w) > -1 ? 10 : 0, w2 = s.indexOf(w) > -1 ? 4 : 0, w3 = x.indexOf(w) > -1 ? 1 : 0;
        if (!(w1 + w2 + w3)) ok = false;
        score += w1 + w2 + w3;
      });
      if (ok) hits.push({ d: d, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    status.textContent = hits.length ? hits.length + (hits.length === 1 ? ' result' : ' results') + ' for "' + q + '"' : 'No results for "' + q + '".';
    hits.forEach(function (h) {
      var li = document.createElement('li');
      var snippet = h.d.summary || (h.d.text || '').slice(0, 160);
      li.innerHTML = '<a href="' + esc(h.d.url) + '">' + esc(h.d.title) + '</a><br><span class="muted">' + esc(snippet) + '</span>';
      list.appendChild(li);
    });
  }

  function load(cb) {
    if (index) return cb();
    status.textContent = 'Loading index…';
    fetch(form.getAttribute('data-index')).then(function (r) { return r.json(); })
      .then(function (j) { index = j; status.textContent = ''; cb(); })
      .catch(function () { status.textContent = 'The search index could not be loaded. Browse by category instead.'; });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value;
    if (history.replaceState) history.replaceState(null, '', '?q=' + encodeURIComponent(q));
    load(function () { run(q); });
  });

  var m = /[?&]q=([^&]*)/.exec(location.search);
  if (m) { input.value = decodeURIComponent(m[1].replace(/\+/g, ' ')); load(function () { run(input.value); }); }
})();
