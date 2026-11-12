/* Tombol "Bagikan" untuk halaman portal lama (materi, sirah, kisah, kajian, dll.).
   Disisipkan server.js; index.html tidak diubah. */
(function () {
  var O = 'https://cerdaslca.org';
  var P = {"whatsapp": "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z", "facebook": "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z", "x": "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"};
  function fill(d) { return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + d + '"/></svg>'; }
  function stroke(inner) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>'; }
  var I = {
    wa: fill(P.whatsapp), fb: fill(P.facebook), x: fill(P.x),
    tg: stroke('<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>'),
    th: '<svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="17.5" text-anchor="middle" font-size="17" font-weight="700" fill="currentColor" font-family="Arial,sans-serif">@</text></svg>',
    link: stroke('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
    more: stroke('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>')
  };
  var css = '.lca-share{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:12px 0 18px}' +
    '.lca-share .lbl{font:600 12px/1 var(--f-ui,system-ui);letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#5a6862);margin-right:2px}' +
    '.lca-share a,.lca-share button{width:38px;height:38px;border-radius:50%;display:inline-grid;place-items:center;border:0;padding:0;cursor:pointer;color:#fff;text-decoration:none;box-shadow:0 4px 12px -6px rgba(0,0,0,.55);transition:transform .15s}' +
    '.lca-share a:hover,.lca-share button:hover{transform:translateY(-2px)}' +
    '.lca-share svg{width:18px;height:18px}' +
    '.lca-share .wide{width:auto;padding:0 16px 0 12px;border-radius:999px;display:inline-flex;gap:8px;font:600 14px/1 var(--f-ui,system-ui)}' +
    '.lca-share-end{margin:30px 0 6px;padding:18px 18px 8px;border:1px solid var(--rule,#dae0d8);border-radius:16px;background:var(--sheet,#fff)}' +
    '.lca-share-end h3{margin:0 0 2px;font:600 16px/1.3 var(--f-ui,system-ui);color:var(--ink,#15221e)}' +
    '.lca-share-end p{margin:0;font:400 13.5px/1.5 var(--f-ui,system-ui);color:var(--muted,#5a6862)}' +
    '.meta a.share,#kb-share{display:none!important}' +
    '@media (max-width:480px){.lca-share{gap:6px}.lca-share a,.lca-share button{width:34px;height:34px}.lca-share svg{width:16px;height:16px}.lca-share .wide{width:auto}}' +
    '#lca-toast{position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:9999;background:#0a4334;color:#fff;font:500 14px/1.4 var(--f-ui,system-ui);padding:10px 16px;border-radius:12px;box-shadow:0 10px 30px -10px rgba(0,0,0,.5);max-width:90vw;text-align:center}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function toast(m) {
    var t = document.getElementById('lca-toast');
    if (!t) { t = document.createElement('div'); t.id = 'lca-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = m; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(function () { t.hidden = true; }, 2600);
  }
  function copy(s) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(s);
    return new Promise(function (ok) { var a = document.createElement('textarea'); a.value = s; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} a.remove(); ok(); });
  }
  function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function info(sec) {
    var id = sec.id.slice(2), cur = location.hash.slice(1) || location.pathname.replace(/^\/+|\/+$/g, '');
    var url = O + '/' + (id === 'kisah-baca' && /^kisah-\d+$/.test(cur) ? cur : id);
    var title = txt(sec.querySelector('h1')) || sec.getAttribute('data-title') || 'Portal LCA';
    var eye = txt(sec.querySelector('.eyebrow'));
    var lead = txt(sec.querySelector('.lead') || sec.querySelector('.prose p'));
    if (lead.length > 220) lead = lead.slice(0, 217).replace(/\s+\S*$/, '') + '…';
    var msg = '*' + title + '*' + (eye ? '\n' + eye : '') + (lead ? '\n\n' + lead : '') + '\n\nBaca selengkapnya di Portal Lembaga Cerdas Al-Qur\'an:\n' + url;
    return { url: url, title: title, msg: msg };
  }
  function act(sec, k) {
    var d = info(sec), u = encodeURIComponent(d.url), t = encodeURIComponent(d.title + ' | Lembaga Cerdas Al-Qur\'an');
    var go = {
      wa: 'https://wa.me/?text=' + encodeURIComponent(d.msg),
      fb: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
      x: 'https://twitter.com/intent/tweet?text=' + t + '&url=' + u,
      tg: 'https://t.me/share/url?url=' + u + '&text=' + t,
      th: 'https://www.threads.net/intent/post?text=' + encodeURIComponent(d.title + '\n' + d.url)
    }[k];
    if (go) { window.open(go, '_blank', 'noopener'); return; }
    if (k === 'more' && navigator.share) { navigator.share({ title: d.title, text: d.msg.replace(/\n\nBaca selengkapnya[\s\S]*$/, ''), url: d.url }).catch(function () {}); return; }
    copy(d.msg).then(function () { toast(k === 'link' ? 'Tautan & ringkasan disalin. Tempel di Instagram, TikTok, atau grup mana pun.' : 'Disalin. Tempel di Instagram, TikTok, atau aplikasi lain.'); });
  }
  var BTN = [['wa', 'WhatsApp', '#25D366'], ['fb', 'Facebook', '#0866FF'], ['x', 'X (Twitter)', '#000'], ['tg', 'Telegram', '#229ED9'], ['th', 'Threads', '#111'], ['link', 'Salin tautan (Instagram/TikTok)', '#475569'], ['more', 'Bagikan ke aplikasi lain', '#A6731C']];
  function bar(sec, big) {
    var el = document.createElement('div'); el.className = 'lca-share';
    el.innerHTML = (big ? '' : '<span class="lbl">Bagikan</span>') + BTN.map(function (b, i) {
      var wide = big && i === 0;
      return '<button type="button" data-k="' + b[0] + '" title="' + b[1] + '" aria-label="Bagikan via ' + b[1] + '" class="' + (wide ? 'wide' : '') + '" style="background:' + b[2] + '">' + I[b[0]] + (wide ? 'Kirim ke WhatsApp' : '') + '</button>';
    }).join('');
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b) act(sec, b.getAttribute('data-k')); });
    return el;
  }
  function init() {
    document.querySelectorAll('section.page').forEach(function (sec) {
      if (sec.id === 'p-beranda' || sec.querySelector('.lca-share')) return;
      var anchor = sec.querySelector(':scope > .meta') || sec.querySelector(':scope > h1');
      if (anchor) anchor.insertAdjacentElement('afterend', bar(sec, false));
      var end = document.createElement('div'); end.className = 'lca-share-end';
      end.innerHTML = '<h3>Bagikan ' + (/^p-(materi|sirah|sahabat|kisah|kajian|kata)/.test(sec.id) ? 'materi' : 'halaman') + ' ini</h3><p>Semoga menjadi amal jariyah: kirim ke keluarga, grup WhatsApp, dan media sosial Anda.</p>';
      end.appendChild(bar(sec, true));
      var nav = sec.querySelector(':scope > .snav');
      if (nav) sec.insertBefore(end, nav); else sec.appendChild(end);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
