/* AGCO Power Lead Capture – main application logic
 * Plain JavaScript, no build step. Works as a Progressive Web App (PWA)
 * on Android (Chrome/Edge) and iPhone (Safari).
 */
(() => {
  "use strict";
  const CFG = window.APP_CONFIG;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // ------------------------------------------------------------------ i18n
  const I18N = {
    fi: {
      subtitle: "Liidien keräys", login: "Kirjaudu", logout: "Kirjaudu ulos", tabNew: "Uusi liidi", tabList: "Liidit",
      tabSettings: "Asetukset", event: "Tapahtuma", step1: "1. Yhteystiedot", scanCard: "Skannaa kortti",
      pickImage: "Valitse kuva", ocrRaw: "Tunnistettu teksti", name: "Nimi", company: "Yritys", jobTitle: "Titteli",
      email: "Sähköposti", phone: "Puhelin", website: "Verkkosivu", country: "Maa", address: "Osoite",
      step2: "2. Kiinnostus", engines: "Kiinnostavat moottorit", application: "Sovellus / käyttökohde",
      volume: "Vuosivolyymi (kpl)", timeline: "Aikataulu", temperature: "Liidin lämpötila", step3: "3. Muistiinpanot",
      dictate: "Sanele", stop: "Lopeta", notesPh: "Kirjoita tai sanele lyhyet muistiinpanot…", nextStep: "Seuraava toimenpide",
      responsible: "Vastuuhenkilö", followDate: "Seurantapäivä",
      consent: "Asiakas on antanut luvan tallentaa yhteystiedot ja ottaa yhteyttä (GDPR)", clear: "Tyhjennä",
      save: "Tallenna liidi", update: "Päivitä liidi", syncAll: "Synkronoi SharePointiin", exportCsv: "Vie CSV",
      searchPh: "Hae nimellä tai yrityksellä…", folder: "SharePoint-kansio", uiLang: "Sovelluksen kieli",
      myName: "Oma nimi (kerääjä)", saveSettings: "Tallenna asetukset",
      privacyNote: "Liidit tallentuvat ensin puhelimeen ja siirtyvät SharePointiin, kun yhteys on käytössä. Poista synkronoidut liidit puhelimesta tapahtuman jälkeen.",
      purge: "Poista synkronoidut liidit puhelimesta", online: "Online", offline: "Offline", localMode: "Paikallinen tila",
      notConfigured: "Ei kirjautumista", ocrLoading: "Ladataan tekstintunnistusta… (ensimmäisellä kerralla hitaampi)",
      ocrRunning: "Luetaan korttia…", ocrDone: "Valmis – tarkista ja korjaa kentät.", ocrFail: "Tekstintunnistus epäonnistui. Kortin kuva tallentuu silti – kirjoita tiedot käsin.",
      dictUnsupported: "Sanelu ei ole tuettu tässä selaimessa. Käytä näppäimistön mikrofonipainiketta 🎤 tai kirjoita.",
      dictError: "Sanelu keskeytyi. Voit käyttää näppäimistön mikrofonia 🎤 tai kirjoittaa.",
      required: "Täytä vähintään yritys ja nimi tai sähköposti.", saved: "Liidi tallennettu ✔", savedSynced: "Liidi tallennettu SharePointiin ✔",
      syncing: "Synkronoidaan…", syncOk: "Synkronoitu", syncFail: "Synkronointi epäonnistui", pending: "Odottaa",
      synced: "SharePointissa", error: "Virhe", edit: "Muokkaa", del: "Poista", sync: "Synkronoi", vcard: "Puhelimen yhteystietoihin",
      mail: "Kiitos-viesti", confirmDel: "Poistetaanko liidi puhelimesta?", confirmPurge: "Poistetaanko kaikki synkronoidut liidit puhelimesta?",
      dupEmail: "Huom: tällä sähköpostilla on jo liidi: ", noLeads: "Ei liidejä vielä.", loginFirst: "Kirjaudu ensin sisään, niin liidit siirtyvät SharePointiin.",
      settingsSaved: "Asetukset tallennettu", consentMissing: "Lupaa ei ole merkitty. Tallennetaanko silti?",
      excelWarn: "JSON tallentui, mutta Excel-rivin lisäys epäonnistui: "
    },
    en: {
      subtitle: "Lead capture", login: "Sign in", logout: "Sign out", tabNew: "New lead", tabList: "Leads",
      tabSettings: "Settings", event: "Event", step1: "1. Contact details", scanCard: "Scan card",
      pickImage: "Choose photo", ocrRaw: "Recognised text", name: "Name", company: "Company", jobTitle: "Job title",
      email: "Email", phone: "Phone", website: "Website", country: "Country", address: "Address",
      step2: "2. Interest", engines: "Engines of interest", application: "Application",
      volume: "Annual volume (pcs)", timeline: "Timeline", temperature: "Lead temperature", step3: "3. Notes",
      dictate: "Dictate", stop: "Stop", notesPh: "Type or dictate short notes…", nextStep: "Next step",
      responsible: "Owner", followDate: "Follow-up date",
      consent: "Customer agreed that we store the contact details and contact them (GDPR)", clear: "Clear",
      save: "Save lead", update: "Update lead", syncAll: "Sync to SharePoint", exportCsv: "Export CSV",
      searchPh: "Search name or company…", folder: "SharePoint folder", uiLang: "App language",
      myName: "My name (collector)", saveSettings: "Save settings",
      privacyNote: "Leads are stored on the phone first and uploaded to SharePoint when online. Delete synced leads from the phone after the event.",
      purge: "Delete synced leads from phone", online: "Online", offline: "Offline", localMode: "Local mode",
      notConfigured: "No sign-in", ocrLoading: "Loading text recognition… (slower the first time)",
      ocrRunning: "Reading card…", ocrDone: "Done – check and correct the fields.", ocrFail: "Text recognition failed. The card photo is still saved – type the details.",
      dictUnsupported: "Dictation is not supported in this browser. Use the keyboard microphone 🎤 or type.",
      dictError: "Dictation stopped. Use the keyboard microphone 🎤 or type.",
      required: "Fill in at least company and name or email.", saved: "Lead saved ✔", savedSynced: "Lead saved to SharePoint ✔",
      syncing: "Syncing…", syncOk: "Synced", syncFail: "Sync failed", pending: "Pending",
      synced: "In SharePoint", error: "Error", edit: "Edit", del: "Delete", sync: "Sync", vcard: "Save to phone contacts",
      mail: "Thank-you email", confirmDel: "Delete this lead from the phone?", confirmPurge: "Delete all synced leads from the phone?",
      dupEmail: "Note: a lead with this email already exists: ", noLeads: "No leads yet.", loginFirst: "Sign in first so leads can be uploaded to SharePoint.",
      settingsSaved: "Settings saved", consentMissing: "Consent is not ticked. Save anyway?",
      excelWarn: "JSON saved, but adding the Excel row failed: "
    }
  };
  const NEXT_STEPS = {
    fi: ["Lähetä esite", "Soita", "Sovi palaveri", "Tarjous / RFQ", "Tehdasvierailu Linnavuori", "Tekninen yhteyshenkilö", "Välitä kollegalle"],
    en: ["Send brochure", "Call", "Book meeting", "Quotation / RFQ", "Factory visit Linnavuori", "Technical contact", "Forward to colleague"]
  };

  // ------------------------------------------------------------------ settings
  const S_KEY = "apLeads.settings";
  const settings = Object.assign({
    event: CFG.defaultEvent, folder: CFG.defaultFolderPath, uiLang: CFG.defaultUiLanguage,
    speechLang: CFG.defaultSpeechLanguage, collector: ""
  }, JSON.parse(localStorage.getItem(S_KEY) || "{}"));
  const saveSettings = () => localStorage.setItem(S_KEY, JSON.stringify(settings));
  const t = k => (I18N[settings.uiLang] || I18N.fi)[k] || k;

  function applyI18n() {
    document.documentElement.lang = settings.uiLang;
    $$("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
    $$("[data-i18n-ph]").forEach(el => el.placeholder = t(el.dataset.i18nPh));
    buildNextChips();
    $("#btnSave").textContent = editingId ? t("update") : t("save");
    updateNet(); updateLoginUi();
  }

  // ------------------------------------------------------------------ IndexedDB
  const DB_NAME = "apLeadsDB", STORE = "leads";
  const dbP = new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: "id" });
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  const tx = async (mode, fn) => { const db = await dbP; return new Promise((res, rej) => {
    const x = db.transaction(STORE, mode); const st = x.objectStore(STORE); const out = fn(st);
    x.oncomplete = () => res(out && out.result !== undefined ? out.result : out); x.onerror = () => rej(x.error); }); };
  const dbPut = lead => tx("readwrite", st => st.put(lead));
  const dbGet = id => tx("readonly", st => st.get(id));
  const dbAll = () => tx("readonly", st => st.getAll());
  const dbDel = id => tx("readwrite", st => st.delete(id));

  // ------------------------------------------------------------------ UI helpers
  let toastTimer;
  function toast(msg, ms = 2600) {
    const el = $("#toast"); el.textContent = msg; el.classList.remove("hidden");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.add("hidden"), ms);
  }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const configured = () => !/PASTE/i.test(CFG.clientId) && !/PASTE/i.test(CFG.tenantId);

  $$(".tab").forEach(b => b.addEventListener("click", () => showView(b.dataset.view)));
  function showView(id) {
    $$(".tab").forEach(b => b.classList.toggle("active", b.dataset.view === id));
    $$(".view").forEach(v => v.classList.toggle("active", v.id === id));
    if (id === "viewList") renderList();
    window.scrollTo(0, 0);
  }
  function updateNet() {
    const el = $("#netStatus");
    el.textContent = !configured() ? t("localMode") : (navigator.onLine ? t("online") : t("offline"));
  }
  window.addEventListener("online", () => { updateNet(); syncPending(); });
  window.addEventListener("offline", updateNet);

  // ------------------------------------------------------------------ chips
  const sel = { engines: new Set(), applications: new Set(), nextSteps: new Set(), temperature: "" };
  function chip(container, label, set) {
    const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = label;
    b.dataset.val = label;
    b.onclick = () => { set.has(label) ? set.delete(label) : set.add(label); b.classList.toggle("on", set.has(label)); };
    container.appendChild(b);
  }
  function buildEngineChips() {
    const root = $("#engineChips"); root.innerHTML = "";
    CFG.engineGroups.forEach(g => {
      const h = document.createElement("div"); h.className = "group-title"; h.textContent = g.group; root.appendChild(h);
      const c = document.createElement("div"); c.className = "chips"; root.appendChild(c);
      g.items.forEach(i => chip(c, i, sel.engines));
    });
    const a = $("#appChips"); a.innerHTML = ""; CFG.applications.forEach(i => chip(a, i, sel.applications));
  }
  function buildNextChips() {
    const n = $("#nextChips"); n.innerHTML = "";
    NEXT_STEPS[settings.uiLang].forEach(i => chip(n, i, sel.nextSteps));
    refreshChipState();
  }
  function refreshChipState() {
    $$("#engineChips .chip").forEach(b => b.classList.toggle("on", sel.engines.has(b.dataset.val)));
    $$("#appChips .chip").forEach(b => b.classList.toggle("on", sel.applications.has(b.dataset.val)));
    $$("#nextChips .chip").forEach(b => b.classList.toggle("on", sel.nextSteps.has(b.dataset.val)));
    $$("#tempSeg button").forEach(b => b.classList.toggle("on", b.dataset.val === sel.temperature));
  }
  $$("#tempSeg button").forEach(b => b.onclick = () => {
    sel.temperature = sel.temperature === b.dataset.val ? "" : b.dataset.val; refreshChipState();
  });

  // ------------------------------------------------------------------ business card OCR
  let cardBlob = null, ocrWorker = null;
  $("#cardInput").addEventListener("change", e => handleCard(e.target.files[0]));
  $("#cardInputGallery").addEventListener("change", e => handleCard(e.target.files[0]));

  function loadImage(file) {
    return new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = URL.createObjectURL(file); });
  }
  function toCanvas(img, maxSide) {
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * scale); c.height = Math.round(img.naturalHeight * scale);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); return c;
  }
  function enhanceForOcr(canvas) {
    // grayscale + contrast stretch improves recognition of phone photos
    const ctx = canvas.getContext("2d"); const d = ctx.getImageData(0, 0, canvas.width, canvas.height); const p = d.data;
    let min = 255, max = 0; const g = new Uint8ClampedArray(p.length / 4);
    for (let i = 0, j = 0; i < p.length; i += 4, j++) { const v = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]; g[j] = v; if (v < min) min = v; if (v > max) max = v; }
    const r = Math.max(1, max - min);
    for (let i = 0, j = 0; i < p.length; i += 4, j++) { const v = ((g[j] - min) / r) * 255; p[i] = p[i + 1] = p[i + 2] = v; }
    ctx.putImageData(d, 0, 0); return canvas;
  }
  const canvasToBlob = (c, q) => new Promise(r => c.toBlob(r, "image/jpeg", q));

  async function handleCard(file) {
    if (!file) return;
    const status = $("#ocrStatus"); status.classList.remove("hidden");
    try {
      const img = await loadImage(file);
      cardBlob = await canvasToBlob(toCanvas(img, 1600), 0.8);           // stored / uploaded photo
      $("#cardPreview").src = URL.createObjectURL(cardBlob); $("#cardPreview").classList.remove("hidden");
      const ocrCanvas = enhanceForOcr(toCanvas(img, 2000));
      if (!window.Tesseract) throw new Error("Tesseract not loaded");
      if (!ocrWorker) { status.textContent = t("ocrLoading"); ocrWorker = await Tesseract.createWorker(CFG.ocrLanguages); }
      status.textContent = t("ocrRunning");
      const { data } = await ocrWorker.recognize(ocrCanvas);
      $("#ocrRaw").textContent = data.text; $("#ocrRawBox").classList.remove("hidden");
      fillForm(parseCard(data.text), true);
      status.textContent = t("ocrDone");
      checkDuplicate();
    } catch (err) {
      console.error(err); status.textContent = t("ocrFail");
    } finally { $("#cardInput").value = ""; $("#cardInputGallery").value = ""; }
  }

  const PHONE_PREFIX = [["+358", "Finland"], ["+372", "Estonia"], ["+371", "Latvia"], ["+370", "Lithuania"], ["+385", "Croatia"],
    ["+386", "Slovenia"], ["+420", "Czech Republic"], ["+421", "Slovakia"], ["+351", "Portugal"], ["+353", "Ireland"],
    ["+39", "Italy"], ["+49", "Germany"], ["+33", "France"], ["+46", "Sweden"], ["+47", "Norway"], ["+45", "Denmark"],
    ["+44", "United Kingdom"], ["+43", "Austria"], ["+41", "Switzerland"], ["+34", "Spain"], ["+31", "Netherlands"],
    ["+32", "Belgium"], ["+48", "Poland"], ["+36", "Hungary"], ["+40", "Romania"], ["+30", "Greece"], ["+90", "Turkey"],
    ["+86", "China"], ["+81", "Japan"], ["+82", "South Korea"], ["+91", "India"], ["+55", "Brazil"], ["+54", "Argentina"],
    ["+61", "Australia"], ["+27", "South Africa"], ["+1", "USA / Canada"]];
  const COMPANY_RE = /\b(oy|oyj|ab|gmbh|ag|s\.?p\.?a\.?|s\.?r\.?l\.?|ltd\.?|limited|inc\.?|corp\.?|corporation|co\.,?|company|group|llc|s\.?a\.?s?|b\.?v\.?|kg|a\/s|as|plc|spa|srl|industries|industrie|machinery|maschinen|macchine|tractors?|motors?)\b/i;
  const TITLE_RE = /(manager|director|head of|engineer|ceo|cto|cfo|coo|president|vp\b|vice|purchas|procurement|buyer|sales|marketing|owner|founder|specialist|coordinator|account|export|product|johtaja|päällikkö|myynti|asiantuntija|responsabile|direttore|ingegnere|commerciale|leiter|geschäftsführer|einkauf|vertrieb|directeur|responsable|chef|säljare|inköp|försäljning)/i;
  const STREET_RE = /(via|viale|piazza|str\.|strasse|straße|street|st\.|road|rd\.|avenue|ave\.|katu|tie|kuja|vägen|gatan|rue|zona|industrial|postbox|p\.?o\.? box|\b\d{4,5}\s+[A-ZÄÖÜ])/i;

  function parseCard(raw) {
    const text = raw.replace(/\s*@\s*/g, "@").replace(/\(at\)/gi, "@");
    const lines = text.split(/\n/).map(l => l.replace(/[|_«»©®]+/g, " ").replace(/\s{2,}/g, " ").trim()).filter(l => l.length > 1);
    const out = {}; const used = new Set();

    const em = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (em) { out.email = em[0].toLowerCase(); lines.forEach((l, i) => { if (l.includes(em[0])) used.add(i); }); }

    const emailDomain = out.email ? out.email.split("@")[1] : "";
    const web = text.match(/\b(?:https?:\/\/)?(?:www\.)[a-z0-9.-]+\.[a-z]{2,}[^\s,;]*/i) ||
      (emailDomain && !/(gmail|outlook|hotmail|yahoo|libero|icloud|163|qq)\./i.test(emailDomain) ? ["www." + emailDomain] : null);
    if (web) out.website = web[0].toLowerCase();

    const phones = [];
    lines.forEach((l, i) => {
      if (l.includes("@")) return;
      const m = l.match(/(\+?\(?\d[\d\s().\/-]{6,}\d)/g);
      if (m) m.forEach(p => { const digits = p.replace(/\D/g, ""); if (digits.length >= 7 && digits.length <= 15) { phones.push(p.trim()); used.add(i); } });
    });
    // mobile numbers first
    phones.sort((a, b) => (/\+/.test(b) ? 1 : 0) - (/\+/.test(a) ? 1 : 0));
    if (phones.length) out.phone = [...new Set(phones)].slice(0, 2).join(" / ");

    const pref = phones.find(p => p.trim().startsWith("+"));
    if (pref) { const c = PHONE_PREFIX.find(([k]) => pref.replace(/[\s()]/g, "").startsWith(k)); if (c) out.country = c[1]; }

    lines.forEach((l, i) => { if (!used.has(i) && !out.company && COMPANY_RE.test(l) && !/@/.test(l)) { out.company = l; used.add(i); } });
    lines.forEach((l, i) => { if (!used.has(i) && !out.title && TITLE_RE.test(l) && !/\d/.test(l) && l.length < 60) { out.title = l; used.add(i); } });

    // Name: email local part like "mario.rossi" helps to find the right line
    const local = out.email ? out.email.split("@")[0].split(/[._-]/).filter(x => x.length > 1) : [];
    let nameIdx = lines.findIndex((l, i) => !used.has(i) && local.length && local.some(p => l.toLowerCase().includes(p)) && !/\d|@|www/i.test(l));
    if (nameIdx < 0) nameIdx = lines.findIndex((l, i) => !used.has(i) && /^[A-ZÀ-ÖØ-Þ][\p{L}'’.-]+(\s+[A-ZÀ-ÖØ-Þa-z][\p{L}'’.-]+){1,3}$/u.test(l) && !/\d|@|www/i.test(l));
    if (nameIdx >= 0) { out.name = lines[nameIdx]; used.add(nameIdx); }
    else if (local.length >= 2) out.name = local.map(p => p[0].toUpperCase() + p.slice(1)).join(" ");

    if (!out.company && emailDomain && !/(gmail|outlook|hotmail|yahoo|libero|icloud)\./i.test(emailDomain)) {
      const d = emailDomain.split(".").slice(-2, -1)[0]; out.company = d.charAt(0).toUpperCase() + d.slice(1);
    }
    const addr = lines.filter((l, i) => !used.has(i) && STREET_RE.test(l)).slice(0, 2);
    if (addr.length) out.address = addr.join(", ");
    return out;
  }

  // ------------------------------------------------------------------ dictation
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, recording = false;
  $("#speechLang").value = settings.speechLang;
  $("#speechLang").onchange = e => { settings.speechLang = e.target.value; saveSettings(); };
  $("#btnDictate").addEventListener("click", () => {
    const hint = $("#dictateHint");
    if (!SR) { hint.textContent = t("dictUnsupported"); hint.classList.remove("hidden"); $("#notes").focus(); return; }
    if (recording) { rec.stop(); return; }
    const notes = $("#notes"); const base = notes.value ? notes.value.trimEnd() + " " : "";
    let finalText = "";
    rec = new SR(); rec.lang = settings.speechLang; rec.interimResults = true; rec.continuous = true;
    rec.onresult = ev => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i]; if (r.isFinal) finalText += r[0].transcript + " "; else interim += r[0].transcript;
      }
      notes.value = base + finalText + interim;
    };
    rec.onerror = ev => { if (ev.error !== "aborted" && ev.error !== "no-speech") { hint.textContent = t("dictError") + " (" + ev.error + ")"; hint.classList.remove("hidden"); } };
    rec.onend = () => { recording = false; setDictBtn(); notes.value = (base + finalText).trimEnd(); };
    try { rec.start(); recording = true; hint.classList.add("hidden"); setDictBtn(); }
    catch (e) { hint.textContent = t("dictError"); hint.classList.remove("hidden"); }
  });
  function setDictBtn() {
    const b = $("#btnDictate"); b.classList.toggle("recording", recording);
    b.innerHTML = recording ? "⏹ " + esc(t("stop")) : "🎤 " + esc(t("dictate"));
  }

  // ------------------------------------------------------------------ form
  let editingId = null;
  const F = n => $("#leadForm").elements[n];
  const FIELDS = ["name", "company", "title", "email", "phone", "website", "country", "address"];
  function fillForm(o, onlyEmpty) {
    FIELDS.forEach(k => { if (o[k] && (!onlyEmpty || !F(k).value)) F(k).value = o[k]; });
  }
  function clearForm() {
    $("#leadForm").reset(); ["#notes", "#volume", "#timeline", "#responsible", "#followDate"].forEach(s => $(s).value = "");
    $("#consent").checked = false; sel.engines.clear(); sel.applications.clear(); sel.nextSteps.clear(); sel.temperature = "";
    cardBlob = null; editingId = null; refreshChipState();
    ["#cardPreview", "#ocrStatus", "#ocrRawBox", "#dupWarning", "#dictateHint"].forEach(s => $(s).classList.add("hidden"));
    $("#btnSave").textContent = t("save");
  }
  $("#btnClear").onclick = clearForm;

  F("email").addEventListener("blur", checkDuplicate);
  async function checkDuplicate() {
    const email = F("email").value.trim().toLowerCase(); const w = $("#dupWarning");
    if (!email) { w.classList.add("hidden"); return; }
    const hit = (await dbAll()).find(l => l.email && l.email.toLowerCase() === email && l.id !== editingId);
    if (hit) { w.textContent = t("dupEmail") + hit.name + " / " + hit.company + " (" + new Date(hit.createdAt).toLocaleString() + ")"; w.classList.remove("hidden"); }
    else w.classList.add("hidden");
  }

  $("#btnSave").addEventListener("click", async () => {
    const v = k => F(k).value.trim();
    if (!v("company") || (!v("name") && !v("email"))) { toast(t("required")); return; }
    if (!$("#consent").checked && !confirm(t("consentMissing"))) return;
    const old = editingId ? await dbGet(editingId) : null;
    const now = new Date().toISOString();
    const lead = Object.assign(old || { id: uid(), createdAt: now }, {
      updatedAt: now, event: settings.event, collectedBy: settings.collector || (account && account.name) || "",
      collectedByEmail: account ? account.username : "",
      name: v("name"), company: v("company"), title: v("title"), email: v("email"), phone: v("phone"),
      website: v("website"), country: v("country"), address: v("address"),
      engines: [...sel.engines], applications: [...sel.applications], volume: $("#volume").value, timeline: $("#timeline").value,
      temperature: sel.temperature, notes: $("#notes").value.trim(), nextSteps: [...sel.nextSteps],
      responsible: $("#responsible").value.trim(), followUpDate: $("#followDate").value, consent: $("#consent").checked,
      ocrText: $("#ocrRaw").textContent || (old && old.ocrText) || "", syncStatus: "pending", syncError: ""
    });
    if (cardBlob) { lead.cardImage = cardBlob; lead.imageUploaded = false; }
    await dbPut(lead);
    clearForm(); updateBadge();
    if (configured() && navigator.onLine && account) {
      const ok = await syncLead(lead); toast(ok ? t("savedSynced") : t("saved") + " – " + t("syncFail"));
    } else toast(t("saved") + (configured() && !account ? " – " + t("loginFirst") : ""), 3500);
    updateBadge(); window.scrollTo(0, 0);
  });

  async function editLead(id) {
    const l = await dbGet(id); if (!l) return; clearForm(); editingId = id;
    fillForm(l, false); $("#notes").value = l.notes || ""; $("#volume").value = l.volume || ""; $("#timeline").value = l.timeline || "";
    $("#responsible").value = l.responsible || ""; $("#followDate").value = l.followUpDate || ""; $("#consent").checked = !!l.consent;
    (l.engines || []).forEach(x => sel.engines.add(x)); (l.applications || []).forEach(x => sel.applications.add(x));
    (l.nextSteps || []).forEach(x => sel.nextSteps.add(x)); sel.temperature = l.temperature || ""; refreshChipState();
    if (l.cardImage) { $("#cardPreview").src = URL.createObjectURL(l.cardImage); $("#cardPreview").classList.remove("hidden"); }
    if (l.ocrText) { $("#ocrRaw").textContent = l.ocrText; }
    $("#btnSave").textContent = t("update"); showView("viewNew");
  }

  // ------------------------------------------------------------------ list
  $("#search").addEventListener("input", renderList);
  async function renderList() {
    const q = $("#search").value.trim().toLowerCase();
    const leads = (await dbAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter(l => !q || (l.name + " " + l.company + " " + l.email).toLowerCase().includes(q));
    const root = $("#leadList");
    if (!leads.length) { root.innerHTML = `<p class="hint">${esc(t("noLeads"))}</p>`; return; }
    root.innerHTML = leads.map(l => `
      <div class="lead">
        <div class="top">
          <div><div class="name">${esc(l.name || l.email)}</div>
            <div class="meta">${esc(l.company)}${l.title ? " · " + esc(l.title) : ""}</div>
            <div class="meta">${esc((l.engines || []).join(", "))}${l.temperature ? " · " + esc(l.temperature) : ""}</div>
            <div class="meta">${new Date(l.createdAt).toLocaleString()} · ${esc(l.event)}</div></div>
          <div class="st ${l.syncStatus}">${l.syncStatus === "synced" ? "✔ " + esc(t("synced")) : l.syncStatus === "error" ? "⚠ " + esc(t("error")) : "⏳ " + esc(t("pending"))}</div>
        </div>
        ${l.syncError ? `<div class="hint">${esc(l.syncError)}</div>` : ""}
        <div class="btns">
          ${l.syncStatus !== "synced" ? `<button class="btn small secondary" data-act="edit" data-id="${l.id}">${esc(t("edit"))}</button>
          <button class="btn small primary" data-act="sync" data-id="${l.id}">${esc(t("sync"))}</button>` : ""}
          ${l.sharepointUrl ? `<a class="btn small secondary" href="${esc(l.sharepointUrl)}" target="_blank" rel="noopener">SharePoint</a>` : ""}
          <button class="btn small secondary" data-act="vcf" data-id="${l.id}">${esc(t("vcard"))}</button>
          ${l.email ? `<button class="btn small secondary" data-act="mail" data-id="${l.id}">${esc(t("mail"))}</button>` : ""}
          <button class="btn small secondary" data-act="del" data-id="${l.id}">${esc(t("del"))}</button>
        </div>
      </div>`).join("");
  }
  $("#leadList").addEventListener("click", async e => {
    const b = e.target.closest("button[data-act]"); if (!b) return; const id = b.dataset.id;
    const l = await dbGet(id);
    if (b.dataset.act === "edit") editLead(id);
    if (b.dataset.act === "sync") { if (!(await ensureLogin())) return; toast(t("syncing")); const ok = await syncLead(l); toast(ok ? t("syncOk") : t("syncFail")); renderList(); }
    if (b.dataset.act === "del" && confirm(t("confirmDel"))) { await dbDel(id); renderList(); updateBadge(); }
    if (b.dataset.act === "vcf") shareFile(new Blob([vcard(l)], { type: "text/vcard" }), slug(l.name || l.company) + ".vcf");
    if (b.dataset.act === "mail") location.href = mailto(l);
  });
  async function updateBadge() {
    const n = (await dbAll()).filter(l => l.syncStatus !== "synced").length;
    const b = $("#pendingBadge"); b.textContent = n; b.classList.toggle("hidden", n === 0);
  }

  // ------------------------------------------------------------------ export helpers
  const slug = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "lead";
  const COLUMNS = [["Created", l => new Date(l.createdAt).toLocaleString("fi-FI")], ["Event", l => l.event], ["Collected by", l => l.collectedBy],
    ["Name", l => l.name], ["Title", l => l.title], ["Company", l => l.company], ["Email", l => l.email], ["Phone", l => l.phone],
    ["Website", l => l.website], ["Country", l => l.country], ["Address", l => l.address], ["Engines", l => (l.engines || []).join(", ")],
    ["Application", l => (l.applications || []).join(", ")], ["Annual volume", l => l.volume], ["Timeline", l => l.timeline],
    ["Temperature", l => l.temperature], ["Next steps", l => (l.nextSteps || []).join(", ")], ["Owner", l => l.responsible],
    ["Follow-up date", l => l.followUpDate], ["Notes", l => l.notes], ["Consent", l => (l.consent ? "Yes" : "No")],
    ["Card image", l => l.cardFile || ""], ["Lead ID", l => l.id]];
  const rowOf = l => COLUMNS.map(([, f]) => String(f(l) ?? ""));

  $("#btnExport").onclick = async () => {
    const leads = await dbAll();
    const csv = "\ufeff" + [COLUMNS.map(c => c[0]), ...leads.map(rowOf)]
      .map(r => r.map(v => '"' + v.replace(/"/g, '""') + '"').join(";")).join("\r\n");
    shareFile(new Blob([csv], { type: "text/csv" }), `leads_${slug(settings.event)}_${new Date().toISOString().slice(0, 10)}.csv`);
  };
  async function shareFile(blob, name) {
    const file = new File([blob], name, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: name }); return; } catch (e) { if (e.name === "AbortError") return; } }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }
  function vcard(l) {
    const parts = (l.name || "").split(" "); const last = parts.length > 1 ? parts.pop() : ""; const first = parts.join(" ");
    return ["BEGIN:VCARD", "VERSION:3.0", `N:${last};${first};;;`, `FN:${l.name || ""}`, `ORG:${l.company || ""}`, `TITLE:${l.title || ""}`,
      l.email ? `EMAIL;TYPE=WORK:${l.email}` : "", ...(l.phone || "").split("/").filter(Boolean).map(p => `TEL;TYPE=WORK:${p.trim()}`),
      l.website ? `URL:${l.website}` : "", l.address ? `ADR;TYPE=WORK:;;${l.address.replace(/;/g, ",")};;;;${l.country || ""}` : "",
      `NOTE:${l.event} – AGCO Power lead. ${(l.engines || []).join(", ")}`, "END:VCARD"].filter(Boolean).join("\r\n");
  }
  function mailto(l) {
    const fi = settings.uiLang === "fi";
    const subject = `${fi ? "Kiitos tapaamisesta" : "Thank you for meeting us"} – ${l.event} / AGCO Power`;
    const body = fi
      ? `Hei ${(l.name || "").split(" ")[0]},\n\nkiitos mukavasta keskustelusta ${l.event}-tapahtumassa. Palaan pian asiaan ${(l.engines || []).join(", ") || "AGCO Power -moottoreiden"} osalta.\n\nYstävällisin terveisin\n${settings.collector || ""}\nAGCO Power`
      : `Dear ${(l.name || "").split(" ")[0]},\n\nThank you for visiting AGCO Power at ${l.event}. It was a pleasure to discuss ${(l.engines || []).join(", ") || "our engine range"} with you. I will follow up shortly with more information.\n\nBest regards,\n${settings.collector || ""}\nAGCO Power`;
    return `mailto:${encodeURIComponent(l.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // ------------------------------------------------------------------ Microsoft sign-in (MSAL)
  let msalApp = null, account = null;
  const MSAL_SOURCES = ["vendor/msal-browser.min.js",
    "https://cdn.jsdelivr.net/npm/@azure/msal-browser@3.28.1/lib/msal-browser.min.js",
    "https://alcdn.msauth.net/browser/2.38.3/js/msal-browser.min.js"];
  const loadScript = src => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });

  async function initAuth() {
    if (!configured()) { updateLoginUi(); return; }
    for (const src of MSAL_SOURCES) { if (window.msal) break; try { await loadScript(src); } catch (e) { /* try next */ } }
    if (!window.msal) { console.error("MSAL could not be loaded"); updateLoginUi(); return; }
    msalApp = new msal.PublicClientApplication({
      auth: { clientId: CFG.clientId, authority: `https://login.microsoftonline.com/${CFG.tenantId}`, redirectUri: CFG.redirectUri },
      cache: { cacheLocation: "localStorage", storeAuthStateInCookie: true }
    });
    if (msalApp.initialize) await msalApp.initialize();
    try { const r = await msalApp.handleRedirectPromise(); if (r && r.account) account = r.account; } catch (e) { console.error(e); }
    if (!account) account = msalApp.getAllAccounts()[0] || null;
    if (account) { msalApp.setActiveAccount(account); if (!settings.collector) { settings.collector = account.name || ""; saveSettings(); $("#setCollector").value = settings.collector; } }
    updateLoginUi();
    if (account) syncPending();
  }
  function updateLoginUi() {
    const b = $("#btnLogin");
    if (!configured()) b.textContent = t("notConfigured");
    else if (account) b.textContent = (account.name || account.username).split(/[ ,]/)[0];
    else b.textContent = t("login");
    $("#userInfo").textContent = account ? `${account.name} (${account.username})` : "";
    $("#btnLogout").classList.toggle("hidden", !account);
  }
  async function ensureLogin() {
    if (!configured()) { toast(t("notConfigured")); return false; }
    if (!msalApp) await initAuth();
    if (account) return true;
    await msalApp.loginRedirect({ scopes: CFG.scopes }); return false;
  }
  $("#btnLogin").onclick = () => { if (!account) ensureLogin(); else showView("viewSettings"); };
  $("#btnLogout").onclick = () => msalApp && msalApp.logoutRedirect({ account });

  async function getToken() {
    try { return (await msalApp.acquireTokenSilent({ scopes: CFG.scopes, account })).accessToken; }
    catch (e) {
      if (e instanceof msal.InteractionRequiredAuthError || /interaction_required|login_required|consent_required/.test(e.errorCode || "")) {
        await msalApp.acquireTokenRedirect({ scopes: CFG.scopes, account });
      }
      throw e;
    }
  }

  // ------------------------------------------------------------------ Microsoft Graph / SharePoint
  const GRAPH = "https://graph.microsoft.com/v1.0";
  const encPath = p => p.split("/").filter(Boolean).map(encodeURIComponent).join("/");
  async function graph(token, method, url, body, contentType) {
    const r = await fetch(url.startsWith("http") ? url : GRAPH + url, {
      method, headers: { Authorization: "Bearer " + token, ...(contentType ? { "Content-Type": contentType } : {}) }, body
    });
    if (!r.ok) { let msg = r.status + " " + r.statusText; try { const j = await r.json(); msg = (j.error && j.error.message) || msg; } catch (e) {} throw new Error(msg); }
    return r.status === 204 ? null : r.json();
  }
  async function getSiteId(token) {
    const key = "apLeads.siteId." + CFG.sitePath; const cached = localStorage.getItem(key); if (cached) return cached;
    const s = await graph(token, "GET", `/sites/${CFG.sharepointHost}:${CFG.sitePath}?$select=id`);
    localStorage.setItem(key, s.id); return s.id;
  }
  const putFile = (token, siteId, name, blob, type) =>
    graph(token, "PUT", `/sites/${siteId}/drive/root:/${encPath(settings.folder + "/" + name)}:/content`, blob, type);

  async function addExcelRow(token, siteId, lead) {
    const item = await graph(token, "GET", `/sites/${siteId}/drive/root:/${encPath(settings.folder + "/" + CFG.excelFileName)}?$select=id`);
    await graph(token, "POST", `/sites/${siteId}/drive/items/${item.id}/workbook/tables/${encodeURIComponent(CFG.excelTableName)}/rows`,
      JSON.stringify({ values: [rowOf(lead)] }), "application/json");
  }

  async function syncLead(lead) {
    try {
      const token = await getToken(); const siteId = await getSiteId(token);
      const d = new Date(lead.createdAt); const pad = n => String(n).padStart(2, "0");
      const base = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}_${slug(lead.company)}_${slug(lead.name)}_${lead.id.slice(0, 6)}`;
      if (lead.cardImage && !lead.imageUploaded) {
        await putFile(token, siteId, base + "_card.jpg", lead.cardImage, "image/jpeg");
        lead.imageUploaded = true; lead.cardFile = base + "_card.jpg";
      }
      const { cardImage, ...data } = lead;
      data.syncStatus = "synced"; data.syncedAt = new Date().toISOString(); data.appVersion = CFG.version;
      const res = await putFile(token, siteId, base + ".json", new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), "application/json");
      lead.sharepointUrl = res && res.webUrl; lead.syncStatus = "synced"; lead.syncError = ""; lead.syncedAt = data.syncedAt;
      if (CFG.enableExcel && !lead.excelAdded) {
        try { await addExcelRow(token, siteId, lead); lead.excelAdded = true; }
        catch (e) { lead.syncError = t("excelWarn") + e.message; }
      }
      await dbPut(lead); updateBadge(); return true;
    } catch (e) {
      console.error(e); lead.syncStatus = "error"; lead.syncError = e.message || String(e); await dbPut(lead); updateBadge(); return false;
    }
  }
  let syncing = false;
  async function syncPending() {
    if (syncing || !account || !navigator.onLine) return; syncing = true;
    try { for (const l of (await dbAll()).filter(x => x.syncStatus !== "synced")) await syncLead(l); }
    finally { syncing = false; updateBadge(); if ($("#viewList").classList.contains("active")) renderList(); }
  }
  $("#btnSyncAll").onclick = async () => { if (!(await ensureLogin())) return; toast(t("syncing")); await syncPending(); toast(t("syncOk")); };

  // ------------------------------------------------------------------ settings view
  $("#setEvent").value = settings.event; $("#setFolder").value = settings.folder; $("#setUiLang").value = settings.uiLang;
  $("#setCollector").value = settings.collector; $("#appVersion").textContent = CFG.version;
  $("#btnSaveSettings").onclick = () => {
    settings.event = $("#setEvent").value.trim() || CFG.defaultEvent; settings.folder = $("#setFolder").value.trim() || CFG.defaultFolderPath;
    settings.uiLang = $("#setUiLang").value; settings.collector = $("#setCollector").value.trim();
    saveSettings(); $("#eventLabel").textContent = settings.event; applyI18n(); toast(t("settingsSaved"));
  };
  $("#btnPurge").onclick = async () => {
    if (!confirm(t("confirmPurge"))) return;
    for (const l of await dbAll()) if (l.syncStatus === "synced") await dbDel(l.id);
    renderList(); updateBadge();
  };

  // ------------------------------------------------------------------ start
  $("#eventLabel").textContent = settings.event;
  buildEngineChips(); applyI18n(); updateBadge(); initAuth();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(console.error);
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
})();
