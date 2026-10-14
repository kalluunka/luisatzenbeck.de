/* =========================================================
   HAUS ATZENBECK — drafting logic
   ========================================================= */
(() => {
  "use strict";

  const COLS = 5, ROWS = 5, S = 100;          // grid, cell size (svg units)
  const ENTRANCE = (ROWS - 1) * COLS + 2, R46 = 2;   // bottom-centre, top-centre
  const P = 5, G = 30;                        // wall inset, door width
  const STORE = "hausAtzenbeck.v4";

  const CATS = {
    core: { c: "var(--ink)",    de: "Halle",            en: "Hall" },
    know: { c: "var(--c-know)", de: "Schule & Wissen",  en: "School & knowledge" },
    work: { c: "var(--c-work)", de: "Arbeit & Praxis",  en: "Work & experience" },
    vol:  { c: "var(--c-vol)",  de: "Ehrenamt",         en: "Volunteering" },
    proj: { c: "var(--c-proj)", de: "Projekte",         en: "Projects" },
    pass: { c: "var(--c-pass)", de: "Leidenschaften",   en: "Passions" },
    story:{ c: "var(--c-story)",de: "Geschichten",      en: "Stories" },
    red:  { c: "var(--c-red)",  de: "Rätsel",           en: "Puzzle" },
    gold: { c: "var(--gold)",   de: "Ziel",             en: "Destination" },
  };

  const ROOMS = {
    entrance:   { cat: "core", name: { de: "Eingangshalle", en: "Entrance Hall" },   tag: { de: "Wer hier wohnt", en: "Who lives here" },
                  flavor: { de: "Die Tür fällt hinter dir ins Schloss. Es riecht nach Holz, Druckertinte und ein bisschen nach Abenteuer.", en: "The door clicks shut behind you. It smells of wood, printer ink and a little bit of adventure." } },
    classroom:  { cat: "know", name: { de: "Klassenzimmer", en: "Classroom" },       tag: { de: "Schule & Abitur", en: "School & Abitur" },
                  flavor: { de: "Kreide, Tafel, dreizehn Jahre. Irgendwo hier liegt noch ein Matheheft.", en: "Chalk, blackboard, thirteen years. There's a maths notebook in here somewhere." } },
    commissary: { cat: "work", name: { de: "Kiosk", en: "Commissary" },              tag: { de: "Pausenverkauf", en: "Break-time sales" }, perk: { de: "+1 Würfel", en: "+1 die" },
                  flavor: { de: "Ein kleiner Laden mitten im Haus. In der großen Pause klingelt hier die Kasse.", en: "A little shop in the middle of the house. At break time, the till starts ringing." } },
    tutoring:   { cat: "work", name: { de: "Studierzimmer", en: "Study" },           tag: { de: "Nachhilfe", en: "Tutoring" },
                  flavor: { de: "Zwei Stühle, ein Tisch, viele Fragen – und der Moment, in dem es Klick macht.", en: "Two chairs, one desk, lots of questions – and the moment it clicks." } },
    boiler:     { cat: "work", name: { de: "Technikraum", en: "Boiler Room" },       tag: { de: "Leitung Technik-Team", en: "Leading the tech team" },
                  flavor: { de: "Es brummt. Irgendwo blinkt eine Lampe. Ohne diesen Raum bleibt das ganze Haus still und dunkel.", en: "It hums. A lamp blinks somewhere. Without this room the whole house goes dark and silent." } },
    office:     { cat: "work", name: { de: "Büro", en: "Office" },                   tag: { de: "Praktikum MotionTools", en: "Internship at MotionTools" },
                  flavor: { de: "Ein Schreibtisch, ein Besucherausweis, ein Bildschirm voller Code.", en: "A desk, a visitor badge, a screen full of code." } },
    kitchen:    { cat: "work", name: { de: "Küche", en: "Kitchen" },                 tag: { de: "Praktikum in Schottland", en: "Internship in Scotland" },
                  flavor: { de: "Es riecht nach Toast und Nordseewind. Die Uhr hier geht eine Stunde nach.", en: "It smells of toast and North Sea wind. The clock in here runs an hour behind." } },
    courtyard:  { cat: "vol",  name: { de: "Hof", en: "Courtyard" },                 tag: { de: "Ehrenamt", en: "Volunteering" },
                  flavor: { de: "Frische Luft, ein Lagerfeuerplatz und ein Haufen Kinder mit mehr Energie als du.", en: "Fresh air, a campfire spot and a bunch of kids with more energy than you." } },
    library:    { cat: "pass", name: { de: "Bibliothek", en: "Library" },            tag: { de: "Lieblingsbücher", en: "Favourite books" },
                  flavor: { de: "Drei Bücher stehen etwas weiter vorn als die anderen. Als wollten sie gefunden werden.", en: "Three books stick out a little further than the rest. As if they wanted to be found." } },
    parlor:     { cat: "red",  name: { de: "Salon", en: "Parlor" },                  tag: { de: "Drei Kisten, ein Schlüssel", en: "Three boxes, one key" },
                  flavor: { de: "Drei Kisten auf einem Tisch. Mindestens eine sagt die Wahrheit. Mindestens eine lügt.", en: "Three boxes on a table. At least one tells the truth. At least one lies." } },
    drafting:   { cat: "pass", name: { de: "Entwurfsstudio", en: "Drafting Studio" }, tag: { de: "Blue Prince & Rätsel", en: "Blue Prince & riddles" },
                  flavor: { de: "Auf dem Zeichentisch liegt ein Grundriss. Er sieht diesem Haus verdächtig ähnlich.", en: "A floor plan lies on the drafting table. It looks suspiciously like this house." } },
    workshop:   { cat: "proj", name: { de: "Werkstatt", en: "Workshop" },            tag: { de: "Eigene Spiele", en: "My own games" },
                  flavor: { de: "Zwei Bildschirme, ein Godot-Logo und eine Warteschlange, die niemals endet.", en: "Two screens, a Godot logo and a queue that never ends." } },
    laboratory: { cat: "proj", name: { de: "Labor", en: "Laboratory" },              tag: { de: "Elektronik & ESP32", en: "Electronics & ESP32" },
                  flavor: { de: "Kabelsalat auf Eiche. Eine LED wartet darauf, zu leuchten.", en: "Cable salad on oak. An LED is waiting to light up." } },
    den:        { cat: "pass", name: { de: "Arbeitszimmer", en: "Den" },             tag: { de: "Mein Setup", en: "My setup" },
                  flavor: { de: "Ein Schreibtisch, eine Lampe, viele Nächte. Hier entsteht das meiste.", en: "A desk, a lamp, many nights. This is where most things happen." } },
    gallery:    { cat: "pass", name: { de: "Galerie", en: "Gallery" },               tag: { de: "Ahnengalerie", en: "Portrait gallery" },
                  flavor: { de: "Alle Porträts zeigen denselben jungen Mann. Er wirkt jedes Mal ein bisschen anders.", en: "Every portrait shows the same young man. He looks slightly different every time." } },
    archives:   { cat: "know", name: { de: "Archiv", en: "Archives" },               tag: { de: "Sprachen & Skills", en: "Languages & skills" },
                  flavor: { de: "Akten, Karteikarten und eine penibel geführte Stückliste.", en: "Files, index cards and a meticulously kept parts list." } },
    bookshop:   { cat: "story", name: { de: "Buchhandlung", en: "Bookshop" },        tag: { de: "Mein Roman: Ash Grey", en: "My novel: Ash Grey" },
                  flavor: { de: "Ein Laden mit genau einem Buch im Sortiment. Es ist noch nicht fertig – der Besitzer ist trotzdem sehr stolz.", en: "A shop that stocks exactly one book. It isn't finished yet – the owner is very proud anyway." } },
    ballroom:   { cat: "story", name: { de: "Ballsaal", en: "Ballroom" },            tag: { de: "Illustrationen zu Ash Grey", en: "Ash Grey illustrations" },
                  flavor: { de: "Ein Saal, der auf keinem Grundriss steht. Kerzenlicht, Musik – und an den Wänden die Figuren eines Buches, das noch geschrieben wird.", en: "A hall that appears on no floor plan. Candlelight, music – and on the walls, the characters of a book still being written." } },
    dungeon:    { cat: "story", name: { de: "Verlies", en: "Dungeon" },              tag: { de: "Dungeons & Dragons", en: "Dungeons & Dragons" },
                  flavor: { de: "Fackeln, eine Würfelschale und ein Schirm, hinter dem jemand sehr leise lacht.", en: "Torches, a dice tray and a screen behind which someone is chuckling very quietly." } },
    drawing:    { cat: "pass", name: { de: "Zeichenzimmer", en: "Drawing Room" },    tag: { de: "Alle meine Zeichnungen", en: "All my drawings" },
                  flavor: { de: "Ein Kartentisch und ein verdeckter Stapel. Jede Zeichnung in diesem Haus wartet darauf, gezogen zu werden. Wortwörtlich.", en: "A card table and a face-down deck. Every drawing in this house is waiting to be drawn. Literally." } },
    terrace:    { cat: "pass", name: { de: "Terrasse", en: "Terrace" },              tag: { de: "Unterwegs & draußen", en: "Out and about" },
                  flavor: { de: "Frische Luft. Von hier sieht man Berge, Wasser und Bahngleise bis zum Horizont.", en: "Fresh air. From here you can see mountains, water and railway tracks all the way to the horizon." } },
    lounge:     { cat: "pass", name: { de: "Fernsehzimmer", en: "Lounge" },          tag: { de: "Lieblings-YouTuber", en: "Favourite YouTubers" },
                  flavor: { de: "Ein alter Röhrenfernseher. Zwei Kanäle. Beide gut.", en: "An old CRT television. Two channels. Both good." } },
    room46:     { cat: "gold", name: { de: "Raum 46", en: "Room 46" },               tag: { de: "", en: "" },
                  flavor: { de: "Du hast ihn gefunden.", en: "You found it." } },
  };
  // the Ballroom is never drafted: it hides behind a secret door in the Bookshop
  const SECRET = "ballroom";
  const POOL = Object.keys(ROOMS).filter(id => id !== "entrance" && id !== "room46" && id !== SECRET);
  const TOTAL = POOL.length + 2;   // the secret Ballroom is a bonus, not counted

  const T = {
    de: {
      cell: "Feld", sheet: "Blatt", open: "Tür öffnen", locked46: "Raum 46 – verschlossen",
      noKey: "Verschlossen. Irgendwo in diesem Haus liegt ein Schlüssel …",
      noPath: "Du hast den Schlüssel – aber noch keinen Weg. Entwirf einen Raum direkt unter Raum 46.",
      shopDie: "Im Kiosk gibt's Würfel. +1 Würfel!",
      noDice: "Keine Würfel mehr.",
      reset: "Neuer Tag? Der Grundriss wird gelöscht – genau wie in Mount Holly.",
      newDay: "Ein neuer Tag. Das Haus hat sich verändert.",
      roomsEmpty: "Noch nichts entworfen.",
      full: "Das Haus ist komplett. Alle Räume entworfen!",
      led: "Einmal neugierig – für immer an.",
      cipher: "Entschlüsselt!",
      calm: ["Nö. Ruhe bleibt auf Anschlag.", "Netter Versuch.", "Der Regler ist festgeschraubt.", "Panik ist nicht im Lieferumfang."],
      boxWin: "Klick. Darin liegt ein Messingschlüssel mit einer eingravierten 46. Er passt zu einer Tür ganz oben im Haus.",
      boxHave: "Die Kisten sind leer – den Schlüssel hast du schon.",
      boxEmpty: ["Leer. Nur Staub und ein Zettel: „Denk nochmal nach.“", "Auch leer. Die Kisten schauen dich vorwurfsvoll an."],
      boxHint: "Tipp: Stell dir für jede Kiste vor, der Schlüssel läge darin. Würde dann wirklich mindestens eine lügen – und mindestens eine die Wahrheit sagen?",
      why: "Warum die weiße?",
      whyText: "Läge der Schlüssel in der blauen Kiste, wären alle drei Aussagen wahr – aber eine muss lügen. Läge er in der schwarzen, wären alle drei falsch – aber eine muss die Wahrheit sagen. Bleibt nur: weiß.",
      keyGot: "Schlüssel gefunden! Jetzt nach oben zu Raum 46.",
      roll: n => n === 20 ? "Natürliche 20! Kritischer Erfolg. (Du solltest mich wirklich zum Gespräch einladen.)"
        : n === 1 ? "Natürliche 1. Der DM lächelt. Das ist nie ein gutes Zeichen."
        : n >= 15 ? "Stark. Die Tür springt auf." : n >= 10 ? "Knapp geschafft. Die Wache ist … abgelenkt."
        : "Hm. Irgendwo kichert ein Goblin.",
      rollLog: (k, best) => `Würfe: ${k} · bester Wurf: ${best}`,
      deckLeft: n => n ? `Noch ${n} ${n === 1 ? "Karte" : "Karten"} im Stapel.` : "Der Stapel ist leer. Alles gezogen!",
      deckDone: "Komplett! Du hast jede Zeichnung im Haus gezogen.",
      secret: "Ein Geheimraum! Der Ballsaal steht jetzt im Raumbuch.",
      doorsOpen: "Die Türen sind offen. Klick auf ein Feld mit + und entwirf deinen ersten Raum.",
    },
    en: {
      cell: "Cell", sheet: "Sheet", open: "Open door", locked46: "Room 46 – locked",
      noKey: "Locked. Somewhere in this house there's a key …",
      noPath: "You've got the key – but no way up yet. Draft a room directly below Room 46.",
      shopDie: "The commissary sells dice. +1 die!",
      noDice: "No dice left.",
      reset: "A new day? The floor plan will be wiped – just like at Mount Holly.",
      newDay: "A new day. The house has changed.",
      roomsEmpty: "Nothing drafted yet.",
      full: "The house is complete. Every room drafted!",
      led: "Once curious – always on.",
      cipher: "Decrypted!",
      calm: ["Nope. Calm stays maxed out.", "Nice try.", "This fader is bolted down.", "Panic is not included."],
      boxWin: "Click. Inside lies a brass key engraved with 46. It fits a door at the very top of the house.",
      boxHave: "The boxes are empty – you already have the key.",
      boxEmpty: ["Empty. Just dust and a note: “Think again.”", "Empty too. The boxes look at you reproachfully."],
      boxHint: "Hint: for each box, imagine the key is inside. Would at least one box then lie – and at least one tell the truth?",
      why: "Why the white one?",
      whyText: "If the key were in the blue box, all three statements would be true – but one has to lie. If it were in the black box, all three would be false – but one has to tell the truth. That leaves: white.",
      keyGot: "Key found! Now head up to Room 46.",
      roll: n => n === 20 ? "Natural 20! Critical success. (You really should invite me to an interview.)"
        : n === 1 ? "Natural 1. The DM smiles. That's never a good sign."
        : n >= 15 ? "Nice. The door swings open." : n >= 10 ? "Just made it. The guard is … distracted."
        : "Hm. Somewhere, a goblin giggles.",
      rollLog: (k, best) => `Rolls: ${k} · best roll: ${best}`,
      deckLeft: n => n ? `${n} ${n === 1 ? "card" : "cards"} left in the deck.` : "The deck is empty. Everything drawn!",
      deckDone: "Complete! You've drawn every drawing in the house.",
      secret: "A secret room! The Ballroom is now in your room schedule.",
      doorsOpen: "The doors are open. Click a square with a + and draft your first room.",
    },
  };

  /* the Drawing Room deck: every drawing is a card */
  const KINDS = {
    char:   { c: "var(--c-story)", sym: "●", de: "Held", en: "Hero" },
    item:   { c: "var(--gold)",    sym: "◆", de: "Beute", en: "Loot" },
    future: { c: "var(--c-proj)",  sym: "▲", de: "Zukunft", en: "Future" },
    sealed: { c: "#9aa3b5",        sym: "✖", de: "Versiegelt", en: "Sealed" },
    pixel:  { c: "#6fe3d1",        sym: "■", de: "Pixel", en: "Pixel" },
  };
  const N = (de, en = de) => ({ de, en });
  const CARDS = [
    { id: "spike", img: "spike.jpg", kind: "char", name: N("Spike"), type: N("Charakter — Mensch, Schurke", "Character — Human Rogue"),
      text: N("Mein allererster D&D-Charakter. Naiv genug, um jedem zu vertrauen. Charmant genug, um damit durchzukommen.", "My very first D&D character. Naive enough to trust anyone. Charming enough to get away with it.") },
    { id: "duo", img: "spike-yelqen.jpg", kind: "char", name: N("Spike & Yelqen"), type: N("Charaktere — beste Freunde", "Characters — Best Friends"),
      text: N("Yelqen wird von David gespielt, einem meiner besten Freunde. Liegen beide aus: +2 auf alles. Gilt auch im echten Leben.", "Yelqen is played by David, one of my best friends. With both in play: +2 to everything. Works in real life, too.") },
    { id: "bill", img: "bill.jpg", kind: "char", name: N("Butcher Bill"), type: N("Charakter — Eimer auf dem Kopf", "Character — Bucket on Head"),
      text: N("Mein zweiter Charakter. Sieht aus wie dein schlimmster Albtraum. Bringt dir Suppe, wenn du krank bist.", "My second character. Looks like your worst nightmare. Brings you soup when you're ill.") },
    { id: "billclose", img: "bill-close.jpg", kind: "char", name: N("Butcher Bill, ganz nah", "Butcher Bill, Up Close"), type: N("Charakter — Herz aus Gold", "Character — Heart of Gold"),
      text: N("Zu nah. Viel zu nah. Keine Sorge, er will nur Hallo sagen.", "Too close. Way too close. Don't worry, he just wants to say hi.") },
    { id: "billsketch", img: "bill-sketch.jpg", kind: "char", name: N("Butcher Bill, Prototyp", "Butcher Bill, Prototype"), type: N("Skizze — Bleistift auf Papier", "Sketch — Pencil on Paper"),
      text: N("Bevor er Farbe bekam, war er nur eine Idee mit Hackbeil.", "Before he got colour, he was just an idea with a cleaver.") },
    { id: "clock", img: "item-clock.jpg", kind: "item", name: N("Timestop Clock"), type: N("Gegenstand — für die Gruppe gezeichnet", "Item — Drawn for the Party"),
      text: N("Hält die Zeit an. Funktioniert leider nicht bei Klassenarbeiten.", "Stops time. Sadly doesn't work during exams.") },
    { id: "bracers", img: "item-bracers.jpg", kind: "item", name: N("Warhammer Bracers"), type: N("Gegenstand — für die Gruppe gezeichnet", "Item — Drawn for the Party"),
      text: N("Verleiht jedem Schlag ein dramatisches KLONK.", "Adds a dramatic CLONK to every hit.") },
    { id: "gauntlets", img: "item-gauntlets.jpg", kind: "item", name: N("???"), type: N("Gegenstand — unidentifiziert", "Item — Unidentified"),
      text: N("Was sie können? Weiß nur der DM. Und der DM grinst.", "What do they do? Only the DM knows. And the DM is grinning.") },
    { id: "pendant", img: "item-pendant.jpg", kind: "item", name: N("???"), type: N("Gegenstand — unidentifiziert", "Item — Unidentified"),
      text: N("Hübsch. Verdächtig hübsch. Wirf auf Arkane Kunde.", "Pretty. Suspiciously pretty. Roll Arcana.") },
    { id: "amulet", img: "item-amulet.jpg", kind: "item", name: N("???"), type: N("Gegenstand — unidentifiziert", "Item — Unidentified"),
      text: N("Unidentifiziert. Bitte nicht ablecken.", "Unidentified. Please do not lick.") },
    { id: "suita", img: "suit-a.jpg", kind: "future", name: N("Der Mann im Anzug", "The Man in the Suit"), type: N("Charakter — wartet auf sein Spiel", "Character — Awaiting His Game"),
      text: N("Hat sich extra schick gemacht. Für ein Spiel, das es noch nicht gibt.", "Dressed up specially. For a game that doesn't exist yet.") },
    { id: "suitb", img: "suit-b.jpg", kind: "future", name: N("Der Mann im Anzug (Remaster)", "The Man in the Suit (Remaster)"), type: N("Charakter — neuer Zeichenstil", "Character — New Art Style"),
      text: N("Gleicher Mann, neuer Stil. Gefragt hat ihn niemand.", "Same man, new style. Nobody asked him.") },
    { id: "greyhair", img: "greyhair.jpg", kind: "future", name: N("Der Grauhaarige", "The Grey-Haired Man"), type: N("Charakter — wartet auf sein Spiel", "Character — Awaiting His Game"),
      text: N("Schaut, als wüsste er genau, was du letzten Sommer getan hast.", "Looks like he knows exactly what you did last summer.") },
    { id: "lollipop", img: "lollipop.jpg", kind: "future", name: N("Der mit dem Lolli", "The One with the Lollipop"), type: N("Charakter — Handzeichnung", "Character — Hand-drawn"),
      text: N("Wartet auf sein Spiel. Lolli: ja. Erklärung: nein.", "Awaiting his game. Lollipop: yes. Explanation: no.") },
    { id: "blue1", img: "blue-1.jpg", kind: "sealed", name: N("Der Blauhaarige", "The Blue-Haired Guy"), type: N("Charakter — Akte versiegelt", "Character — File Sealed"),
      text: N("Hat sehr viel Geschichte. Die ist aber nicht für heute.", "Has a lot of history. But that's not for today.") },
    { id: "blue2", img: "blue-2.jpg", kind: "sealed", name: N("Der Blauhaarige, schon wieder", "The Blue-Haired Guy, Again"), type: N("Charakter — Akte immer noch versiegelt", "Character — File Still Sealed"),
      text: N("Siehe vorherige Karte. Immer noch nicht heute.", "See previous card. Still not today.") },
    { id: "cave", img: "sub-bg.jpg", kind: "pixel", fit: "cover", name: N("Die Höhle", "The Cave"), type: N("Pixel-Art — Substrata Unlinked", "Pixel Art — Substrata Unlinked"),
      text: N("640 × 360 Pixel Atmosphäre. Fackeln inklusive, Ausgang nicht.", "640 × 360 pixels of atmosphere. Torches included, exit not.") },
  ];

  /* first lines of Ash Grey, for the Bookshop's table of contents */
  const CHAPTERS = [
    "The problem with executions is that no one ever considers how uncomfortable the ropes are.",
    "Before we continue with my story, I should probably talk a bit about myself.",
    "The tavern I entered, The Grinning Rat, was exactly like I hoped it would be.",
    "Morning people are suspicious.",
    "Poets and Politicians always claim that Tidesreach smells like freedom.",
    "If I ever meet the guy that thought velvet would be an appropriate fabric for mountain travel, I'm going to stab him.",
    "The Iron Gates of Draghur didn't open for merchants.",
    "If there is one thing worse than sitting at a feast where everyone treats you like a ticking bomb, it is sitting at a feast where everyone tries to engage you in small talk while treating you like a ticking bomb.",
    "I woke up in total terror, drenched in sweat, like almost every night.",
  ];

  const CIPHER = { de: "DER SCHLUESSEL LIEGT IM SALON", en: "THE KEY IS IN THE PARLOR", key: 7 };

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const bi = o => `<span class="de">${o.de}</span><span class="en">${o.en}</span>`;
  const L = () => state.lang;
  const t = k => T[L()][k];
  const rc = i => ({ r: Math.floor(i / COLS), c: i % COLS });
  const code = i => { const { r, c } = rc(i); return "ABCDE"[c] + (r + 1); };
  const pad = n => String(n).padStart(2, "0");
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function neighbor(i, dir) {
    const { r, c } = rc(i);
    if (dir === "n") return r > 0 ? i - COLS : -1;
    if (dir === "s") return r < ROWS - 1 ? i + COLS : -1;
    if (dir === "w") return c > 0 ? i - 1 : -1;
    return c < COLS - 1 ? i + 1 : -1;
  }
  // Room 46 is only reachable through its south wall.
  function hasDoor(i, dir) {
    const nb = neighbor(i, dir);
    if (nb < 0) return i === ENTRANCE && dir === "s";
    if (nb === R46) return dir === "n";
    return true;
  }

  /* ---------- state ---------- */
  const fresh = (lang, day = 1) => ({
    lang, day, placed: { [ENTRANCE]: "entrance" }, order: ["entrance"],
    dice: 2, key: false, found46: false, shopDie: false, parlorFails: 0, cards: [], ballroom: false, entered: false,
  });
  const defaultLang = () => ((navigator.language || "de").toLowerCase().startsWith("de") ? "de" : "en");
  let state;
  try { state = JSON.parse(localStorage.getItem(STORE)); } catch (e) { state = null; }
  if (!state || !state.placed || !state.order) state = fresh(defaultLang());
  if (!Array.isArray(state.cards)) state.cards = [];
  if (typeof state.entered !== "boolean") state.entered = state.order.length > 1;
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* private mode */ } };

  const isPlaced = id => state.order.includes(id);
  const remaining = () => POOL.filter(id => !isPlaced(id));
  const cellOf = id => Number(Object.keys(state.placed).find(k => state.placed[k] === id));
  const sheetNo = id => (id === "room46" ? "46" : id === SECRET ? "✦" : pad(state.order.indexOf(id) + 1));
  const reach46 = () => !!state.placed[R46 + COLS] || remaining().length === 0;
  function isAvail(i) {
    if (!state.entered || state.placed[i] || i === R46 || !remaining().length) return false;
    return ["n", "s", "e", "w"].some(d => { const nb = neighbor(i, d); return nb >= 0 && state.placed[nb] && hasDoor(i, d); });
  }

  /* ---------- floor plan ---------- */
  const plan = $("#plan");
  const narrow = window.matchMedia("(max-width: 640px)");
  narrow.addEventListener("change", () => renderPlan());
  plan.setAttribute("viewBox", `-74 -74 648 ${ROWS * S + 168}`);

  function wallPath(x0, y0, x1, y1, d) {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, h = G / 2;
    let p = "";
    p += d.n ? `M${x0} ${y0}H${mx - h}M${mx + h} ${y0}H${x1}` : `M${x0} ${y0}H${x1}`;
    p += d.e ? `M${x1} ${y0}V${my - h}M${x1} ${my + h}V${y1}` : `M${x1} ${y0}V${y1}`;
    p += d.s ? `M${x1} ${y1}H${mx + h}M${mx - h} ${y1}H${x0}` : `M${x1} ${y1}H${x0}`;
    p += d.w ? `M${x0} ${y1}V${my + h}M${x0} ${my - h}V${y0}` : `M${x0} ${y1}V${y0}`;
    return p;
  }

  function roomSVG(i, id, isFresh) {
    const { r, c } = rc(i), m = ROOMS[id];
    const x = c * S, y = r * S, x0 = x + P, y0 = y + P, x1 = x + S - P, y1 = y + S - P;
    const mx = x + S / 2, my = y + S / 2, h = G / 2;
    const d = { n: hasDoor(i, "n"), e: hasDoor(i, "e"), s: hasDoor(i, "s"), w: hasDoor(i, "w") };
    let swing = "", thresh = "";
    const nN = neighbor(i, "n"), nW = neighbor(i, "w"), nE = neighbor(i, "e"), nS = neighbor(i, "s");
    // doors swing into the southern / eastern room of each pair
    if (d.n && (state.placed[nN] || (nN === R46 && state.found46)))
      swing += `M${mx - h} ${y0}v${G}M${mx - h} ${y0 + G}A${G} ${G} 0 0 0 ${mx + h} ${y0}`;
    if (d.w && state.placed[nW])
      swing += `M${x0} ${my - h}h${G}M${x0 + G} ${my - h}A${G} ${G} 0 0 1 ${x0} ${my + h}`;
    if (i === ENTRANCE)
      swing += `M${mx - h} ${y1}v${-G}M${mx - h} ${y1 - G}A${G} ${G} 0 0 1 ${mx + h} ${y1}`;
    // dashed thresholds toward undiscovered cells
    const open = (dir, nb) => d[dir] && nb >= 0 && nb !== R46 && !state.placed[nb];
    if (open("n", nN)) thresh += `M${mx - h} ${y0}H${mx + h}`;
    if (open("s", nS)) thresh += `M${mx - h} ${y1}H${mx + h}`;
    if (open("w", nW)) thresh += `M${x0} ${my - h}V${my + h}`;
    if (open("e", nE)) thresh += `M${x1} ${my - h}V${my + h}`;

    const name = m.name[L()], iz = narrow.matches ? 54 : 38;
    const knock = id === "entrance" && !state.entered;
    const knockMarks = knock ? `<rect class="knock-ring" x="${x0}" y="${y0}" width="${S - 2 * P}" height="${S - 2 * P}"/>
      <text class="knock-txt" x="${mx}" y="${y - 16}">${L() === "de" ? "hier eintreten ↓" : "come in here ↓"}</text>` : "";
    return `${knockMarks}<g class="cell room${isFresh ? " fresh" : ""}${knock ? " knock" : ""}" data-i="${i}" data-id="${id}" tabindex="0" role="button"
      aria-label="${esc(name)} – ${t("sheet")} ${sheetNo(id)}" style="--c:${CATS[m.cat].c}">
      <rect class="floor" x="${x0}" y="${y0}" width="${S - 2 * P}" height="${S - 2 * P}"/>
      <rect class="band" x="${x1 - 14}" y="${y0 + 6}" width="8" height="8" transform="rotate(45 ${x1 - 10} ${y0 + 10})"/>
      <path class="walls" pathLength="1" d="${wallPath(x0, y0, x1, y1, d)}"/>
      ${swing ? `<path class="swing" pathLength="1" d="${swing}"/>` : ""}
      ${thresh ? `<path class="thresh" d="${thresh}"/>` : ""}
      <use class="ico" href="#i-${id}" x="${mx - iz / 2}" y="${narrow.matches ? my - iz / 2 : my - 27}" width="${iz}" height="${iz}"/>
      <text class="lbl" x="${mx}" y="${y1 - 11}">${esc(name)}</text>
      <text class="no" x="${x0 + 6}" y="${y0 + 13}">${sheetNo(id)}</text>
      <rect class="focus" x="${x0 - 3}" y="${y0 - 3}" width="${S - 2 * P + 6}" height="${S - 2 * P + 6}"/>
    </g>`;
  }

  function room46SVG() {
    const x = 2 * S, y = 0, x0 = x + P, y0 = y + P, x1 = x + S - P, y1 = y + S - P, mx = x + S / 2, h = G / 2;
    const ready = state.key && reach46() && !state.found46;
    const cls = state.found46 ? "open" : ready ? "ready" : "locked";
    const walls = `M${x0} ${y1}V${y0}H${x1}V${y1}H${mx + h}M${mx - h} ${y1}H${x0}`;
    const inner = `M${x0 + 6} ${y1 - 6}V${y0 + 6}H${x1 - 6}V${y1 - 6}H${mx + h}M${mx - h} ${y1 - 6}H${x0 + 6}`;
    const label = state.found46 ? ROOMS.room46.name[L()] : t("locked46");
    return `<g class="cell r46 ${cls}" data-i="${R46}" tabindex="0" role="button" aria-label="${esc(label)}" style="--c:var(--gold)">
      <rect class="floor" x="${x0}" y="${y0}" width="${S - 2 * P}" height="${S - 2 * P}"/>
      ${state.found46 ? "" : `<rect class="hatchfill" fill="url(#hatch)" x="${x0 + 6}" y="${y0 + 6}" width="${S - 2 * P - 12}" height="${S - 2 * P - 12}"/>`}
      <path class="walls" d="${walls}"/><path class="walls inner" d="${inner}"/>
      <text class="num46" x="${mx}" y="${y + 58}">46</text>
      ${state.found46 ? "" : `<use class="ico" href="#i-room46" x="${mx - 9}" y="${y + 64}" width="18" height="18"/>`}
      <rect class="focus" x="${x0 - 3}" y="${y0 - 3}" width="${S - 2 * P + 6}" height="${S - 2 * P + 6}"/>
    </g>`;
  }

  function renderPlan(freshCell = -1) {
    let h = "";
    for (let c = 0; c < COLS; c++) {
      const x = c * S + S / 2;
      h += `<g class="axis"><line x1="${x}" y1="-34" x2="${x}" y2="-14"/><circle cx="${x}" cy="-50" r="15"/><text x="${x}" y="-50">${"ABCDE"[c]}</text></g>`;
    }
    for (let r = 0; r < ROWS; r++) {
      const y = r * S + S / 2;
      h += `<g class="axis"><line x1="-34" y1="${y}" x2="-14" y2="${y}"/><circle cx="-50" cy="${y}" r="15"/><text x="-50" y="${y}">${r + 1}</text></g>`;
    }
    // outer walls with a gap for the front door
    const gx0 = 2 * S + S / 2 - G / 2 - 4, gx1 = gx0 + G + 8;
    for (const [o, cls] of [[-10, "outer"], [-4, "outer thin"]]) {
      const a = o, w = COLS * S - o, b = ROWS * S - o;
      h += `<path class="${cls}" d="M${gx1} ${b}H${w}V${a}H${a}V${b}H${gx0}"/>`;
    }
    for (let i = 0; i < COLS * ROWS; i++) {
      const { r, c } = rc(i);
      if (i === R46) { h += room46SVG(); continue; }
      const id = state.placed[i];
      if (id) { h += roomSVG(i, id, i === freshCell); continue; }
      if (isAvail(i)) {
        const x = c * S, y = r * S;
        h += `<g class="cell avail" data-i="${i}" tabindex="0" role="button" aria-label="${t("open")} – ${t("cell")} ${code(i)}">
          <rect class="slot" x="${x + P + 4}" y="${y + P + 4}" width="${S - 2 * P - 8}" height="${S - 2 * P - 8}"/>
          <text class="plus" x="${x + S / 2}" y="${y + S / 2 - 4}">+</text>
          <text class="q" x="${x + S / 2}" y="${y + S - 22}">${t("open").toUpperCase()}</text>
          <rect class="focus" x="${x + P}" y="${y + P}" width="${S - 2 * P}" height="${S - 2 * P}"/>
        </g>`;
      } else {
        h += `<rect class="ghost" x="${c * S + P + 4}" y="${r * S + P + 4}" width="${S - 2 * P - 8}" height="${S - 2 * P - 8}"/><circle class="dot" cx="${c * S + S / 2}" cy="${r * S + S / 2}" r="1.6"/>`;
      }
    }
    // entry arrow
    const ex = 2 * S + S / 2, ey = ROWS * S;
    h += `<path class="entry-arrow" d="M${ex} ${ey + 52}V${ey + 18}M${ex - 7} ${ey + 26}L${ex} ${ey + 16}L${ex + 7} ${ey + 26}"/>`;
    plan.innerHTML = h;
    const hint = $("#planHint");
    hint.classList.toggle("knock", !state.entered);
    document.body.classList.toggle("entered", state.entered);
    hint.innerHTML = state.entered
      ? bi({ de: "↑ Du bist hier. Wähle eine offene Tür.", en: "↑ You are here. Pick an open door." })
      : bi({ de: "↑ Klick auf die Eingangshalle, um einzutreten.", en: "↑ Click the Entrance Hall to come in." });
    plan.setAttribute("aria-label", L() === "de" ? "Grundriss" : "Floor plan");
  }

  /* ---------- sidebar ---------- */
  function renderStats() {
    $("#statDay").textContent = state.day;
    $("#statRooms").textContent = state.order.length + (state.found46 ? 1 : 0);
    $$(".rooms-total").forEach(e => (e.textContent = TOTAL));
    $("#statDice").textContent = state.dice;
    const k = $("#statKey");
    k.textContent = state.found46 ? "46 ✓" : state.key ? "1 ✓" : "–";
    k.classList.toggle("has-key", state.key);

    const ol = $("#roomBook");
    const ids = state.order.concat(state.ballroom ? [SECRET] : [], state.found46 ? ["room46"] : []);
    ol.innerHTML = ids.map(id => `<li><button type="button" data-open="${id}" style="--c:${CATS[ROOMS[id].cat].c}">
      <span class="rb-no">${sheetNo(id)}</span>${bi(ROOMS[id].name)}</button></li>`).join("");
  }
  function renderAll(freshCell) { renderPlan(freshCell); renderStats(); }

  /* ---------- overlays ---------- */
  const stack = [];
  function openOverlay(el) {
    if (!stack.some(s => s.el === el)) stack.push({ el, back: document.activeElement });
    el.hidden = false;
    document.body.classList.add("locked");
  }
  function closeOverlay(el) {
    el.hidden = true;
    const idx = stack.findIndex(s => s.el === el);
    let back = null;
    if (idx >= 0) { back = stack[idx].back; stack.splice(idx, 1); }
    if (!stack.length) document.body.classList.remove("locked");
    if (back && back.isConnected && back.focus) back.focus({ preventScroll: true });
  }

  let toastTimer;
  function toast(msg, ms = 3800) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), ms);
  }

  /* ---------- drafting ---------- */
  let draftCell = -1, draftOpts = [];
  function pick3(avoid = []) {
    let pool = remaining();
    let fresh = shuffle(pool.filter(id => !avoid.includes(id)));
    if (fresh.length < Math.min(3, pool.length)) fresh = fresh.concat(shuffle(pool.filter(id => avoid.includes(id))));
    let opts = fresh.slice(0, 3);
    // keep the path to Room 46 alive: after a few rooms, the Parlor shows up for sure
    if (state.order.length >= 5 && pool.includes("parlor") && !opts.includes("parlor") && !avoid.includes("parlor")) opts[opts.length - 1] = "parlor";
    return opts;
  }
  function renderDraft() {
    $("#draftCell").textContent = `${t("cell")} ${code(draftCell)} · ${remaining().length} ${L() === "de" ? "Räume übrig" : "rooms left"}`;
    $("#draftCards").innerHTML = draftOpts.map(id => {
      const m = ROOMS[id], cat = CATS[m.cat];
      return `<button type="button" class="dcard" data-pick="${id}" style="--c:${cat.c}">
        <span class="dc-band"></span>
        <span class="dc-cat">${bi(cat)}</span>
        ${m.perk && !state.shopDie ? `<span class="dc-perk">${bi(m.perk)}</span>` : ""}
        <span class="dc-plan"><svg><use href="#i-${id}"/></svg></span>
        <span class="dc-name">${bi(m.name)}</span>
        <span class="dc-tag">${bi(m.tag)}</span>
      </button>`;
    }).join("");
    $("#diceLeft").textContent = state.dice;
    $("#rerollBtn").disabled = state.dice < 1 || remaining().length <= 3;
  }
  function openDraft(i) {
    draftCell = i;
    draftOpts = pick3();
    renderDraft();
    openOverlay($("#draftOverlay"));
    const first = $(".dcard", $("#draftOverlay"));
    first && first.focus({ preventScroll: true });
  }
  function choose(id) {
    state.placed[draftCell] = id;
    state.order.push(id);
    save();
    closeOverlay($("#draftOverlay"));
    renderAll(draftCell);
    if (!remaining().length) setTimeout(() => toast(t("full")), 1400);
    const cellEl = $(`.cell[data-i="${draftCell}"]`, plan);
    setTimeout(() => openRoom(id, cellEl), 950);
  }

  /* ---------- room 46 ---------- */
  function try46(el) {
    if (state.found46) return openRoom("room46", el);
    if (!state.key) return toast(t("noKey"));
    if (!reach46()) return toast(t("noPath"));
    state.found46 = true;
    save();
    renderAll();
    openRoom("room46", $(`.cell[data-i="${R46}"]`, plan));
  }

  /* ---------- room sheets ---------- */
  let currentRoom = null;
  let justEntered = false;
  function openRoom(id, opener) {
    const m = ROOMS[id], cat = CATS[m.cat];
    if (id === "entrance" && !state.entered) {
      state.entered = true; justEntered = true; save(); renderPlan();
    }
    currentRoom = id;
    const sheet = $("#sheet");
    sheet.style.setProperty("--c", cat.c);
    $("#roomIcon").setAttribute("href", `#i-${id}`);
    const cell = id === "room46" ? R46 : cellOf(id);
    const where = id === SECRET ? bi({ de: "hinter der Buchhandlung", en: "behind the Bookshop" }) : `${bi({ de: "Feld", en: "Cell" })} ${code(cell)}`;
    $("#roomMeta").innerHTML = `${bi({ de: "Blatt", en: "Sheet" })} ${sheetNo(id)} · <span class="cat">${bi(cat)}</span> · ${where}`;
    $("#roomTitle").innerHTML = bi(m.name);
    $("#roomFlavor").innerHTML = bi(m.flavor);
    $("#roomTb1").innerHTML = `${bi({ de: "Blatt", en: "Sheet" })} ${sheetNo(id)}/46`;
    $("#sheetNo").textContent = sheetNo(id);
    const body = $("#roomBody");
    body.innerHTML = "";
    body.appendChild($(`#tpl-${id}`).content.cloneNode(true));
    initRoom(id, body);
    const ov = $("#roomOverlay");
    if (opener && opener.focus) opener.focus({ preventScroll: true });
    openOverlay(ov);
    ov.scrollTop = 0;
    $("#roomClose").focus({ preventScroll: true });
  }
  function closeRoom() {
    currentRoom = null;
    $("#sheetNo").textContent = "00";
    closeOverlay($("#roomOverlay"));
    if (justEntered) {
      justEntered = false;
      renderPlan(-1);
      $$(".cell.avail", plan).forEach(g => g.classList.add("reveal"));
      setTimeout(() => toast(t("doorsOpen"), 5200), 250);
    }
  }

  /* ---------- per-room interactivity ---------- */
  function initRoom(id, root) {
    switch (id) {
      case "classroom": {
        const dl = $(".dimline", root);
        const from = +dl.dataset.from, to = +dl.dataset.to;
        const d = new Date();
        const now = d.getFullYear() + d.getMonth() / 12 + d.getDate() / 365;
        dl.style.setProperty("--now", Math.max(0, Math.min(1, (now - from) / (to - from))).toFixed(3));
        const cd = $("[data-countdown]", root);
        const days = Math.ceil((new Date(cd.dataset.countdown) - d) / 864e5);
        cd.textContent = Math.max(0, days);
        break;
      }
      case "commissary":
        if (!state.shopDie) {
          state.shopDie = true; state.dice++; save(); renderStats();
          setTimeout(() => toast(t("shopDie")), 600);
        }
        break;
      case "boiler": {
        const note = $(".mixer-note", root);
        let n = 0;
        $$("input[data-stubborn]", root).forEach(inp => {
          let timer;
          inp.addEventListener("input", () => {
            if (+inp.value >= 10) return;
            clearTimeout(timer);
            timer = setTimeout(() => {
              inp.value = 10;
              note.textContent = t("calm")[n++ % t("calm").length];
            }, 260);
          });
        });
        break;
      }
      case "library": {
        const spines = $$("button.spine", root), books = $$(".book", root);
        const select = key => {
          spines.forEach(s => s.setAttribute("aria-selected", s.dataset.book === key));
          books.forEach(b => (b.hidden = b.dataset.book !== key));
        };
        spines.forEach(s => s.addEventListener("click", () => select(s.dataset.book)));
        select("pb");
        break;
      }
      case "parlor": {
        const msg = $(".parlor-msg", root);
        const boxes = $$(".box", root);
        const win = () => {
          const w = $('.box[data-box="white"]', root);
          w.classList.add("opened", "win");
          msg.className = "hand center parlor-msg";
          msg.innerHTML = `${bi({ de: T.de.boxWin, en: T.en.boxWin })}`;
          const det = document.createElement("details");
          det.className = "parlor-why";
          det.innerHTML = `<summary>${bi({ de: T.de.why, en: T.en.why })}</summary><p>${bi({ de: T.de.whyText, en: T.en.whyText })}</p>`;
          msg.after(det);
        };
        if (state.key) {
          win();
          msg.innerHTML = bi({ de: T.de.boxHave, en: T.en.boxHave });
          break;
        }
        boxes.forEach(b => b.addEventListener("click", () => {
          if (state.key || b.classList.contains("opened")) return;
          b.classList.add("opened");
          if (b.dataset.box === "white") {
            state.key = true; save(); renderAll();
            win();
            setTimeout(() => toast(t("keyGot")), 700);
          } else {
            b.classList.add("empty");
            state.parlorFails++; save();
            const lines = state.parlorFails >= 2 ? { de: T.de.boxHint, en: T.en.boxHint }
              : { de: T.de.boxEmpty[0], en: T.en.boxEmpty[0] };
            msg.className = "hand center parlor-msg bad";
            msg.innerHTML = bi(lines);
            // after two misses, close the lids again so the visitor can retry
            if (boxes.filter(x => x.classList.contains("empty")).length >= 2) {
              setTimeout(() => boxes.forEach(x => x.classList.remove("opened", "empty")), 2200);
            }
          }
        }));
        break;
      }
      case "drafting": {
        const box = $(".cipher", root), out = $(".cipher-text", root), range = $(".cipher-range", root), o = $(".cipher-out", root);
        const shift = (s, k) => s.replace(/[A-Z]/g, ch => String.fromCharCode(((ch.charCodeAt(0) - 65 + k) % 26 + 26) % 26 + 65));
        let solvedOnce = false;
        const draw = () => {
          const s = +range.value;
          o.textContent = s;
          out.innerHTML = bi({ de: shift(CIPHER.de, CIPHER.key - s), en: shift(CIPHER.en, CIPHER.key - s) });
          const ok = s === CIPHER.key;
          box.classList.toggle("solved", ok);
          if (ok && !solvedOnce) { solvedOnce = true; toast(t("cipher")); }
        };
        range.addEventListener("input", draw);
        draw();
        break;
      }
      case "laboratory": {
        const led = $(".led", root), btn = $(".push", root), n = $("#curN", root);
        let curiosity = 0;
        const press = () => {
          curiosity++;
          n.textContent = curiosity;
          led.classList.add("on", "pulse");
          btn.classList.add("down");
          if (curiosity === 1) toast(t("led"));
        };
        const release = () => { led.classList.remove("pulse"); btn.classList.remove("down"); };
        btn.addEventListener("pointerdown", press);
        ["pointerup", "pointerleave", "pointercancel"].forEach(e => btn.addEventListener(e, release));
        btn.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); press(); } });
        btn.addEventListener("keyup", release);
        break;
      }
      case "den": {
        const frame = $(".lampframe", root), cord = $(".pullcord", root);
        cord.addEventListener("click", e => {
          e.stopPropagation();
          const off = frame.classList.toggle("off");
          cord.setAttribute("aria-pressed", String(!off));
          cord.classList.remove("tug"); void cord.offsetWidth; cord.classList.add("tug");
        });
        break;
      }
      case "bookshop": {
        const toc = $(".toc", root), peek = $(".chap-peek", root), secret = $(".secret", root), chaps = $$(".chap", root);
        const reveal = () => { secret.hidden = false; };
        chaps.forEach(b => b.addEventListener("click", () => {
          const n = +b.dataset.ch;
          chaps.forEach(x => x.classList.toggle("on", x === b));
          peek.textContent = `“${CHAPTERS[n - 1]}”`;
          if (n === 8 && !state.ballroom) {
            state.ballroom = true; save(); renderStats();
            toc.classList.remove("shake"); void toc.offsetWidth; toc.classList.add("shake");
            setTimeout(() => { reveal(); secret.scrollIntoView({ behavior: "smooth", block: "center" }); toast(t("secret")); }, 550);
          }
        }));
        $(".to-ballroom", root).addEventListener("click", () => { closeRoom(); openRoom(SECRET); });
        if (state.ballroom) reveal();
        break;
      }
      case "dungeon": {
        const die = $(".d20", root), num = $(".d20-n", root), msg = $(".roll-msg", root), log = $(".roll-log", root);
        let rolls = 0, best = 0, busy = false;
        die.addEventListener("click", () => {
          if (busy) return;
          busy = true;
          die.classList.remove("rolling"); void die.offsetWidth; die.classList.add("rolling");
          let k = 0;
          const tick = setInterval(() => { num.textContent = 1 + Math.floor(Math.random() * 20); if (++k > 10) done(); }, 55);
          const done = () => {
            clearInterval(tick);
            const n = 1 + Math.floor(Math.random() * 20);
            num.textContent = n;
            rolls++; best = Math.max(best, n);
            die.classList.toggle("crit", n === 20);
            die.classList.toggle("fumble", n === 1);
            msg.innerHTML = bi({ de: T.de.roll(n), en: T.en.roll(n) });
            log.innerHTML = bi({ de: T.de.rollLog(rolls, best), en: T.en.rollLog(rolls, best) });
            busy = false;
          };
        });
        break;
      }
      case "lounge": {
        const screen = $(".tv-screen", root), btns = $$(".tv-btn", root), chans = $$(".channel", root);
        btns.forEach(b => b.addEventListener("click", () => {
          if (b.getAttribute("aria-pressed") === "true") return;
          btns.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
          screen.classList.add("static");
          setTimeout(() => {
            chans.forEach(c => (c.hidden = c.dataset.ch !== b.dataset.ch));
            screen.classList.remove("static");
          }, 380);
        }));
        break;
      }
      case "drawing": {
        const spot = $(".spot", root), album = $(".album", root), deck = $(".deck", root);
        const left = $(".deck-left", root), count = $(".album-count", root), allBtn = $(".draw-all", root);
        const total = CARDS.length, byId = id => CARDS.find(c => c.id === id);
        const no = c => `${pad(CARDS.indexOf(c) + 1)}/${total}`;
        const cardHTML = c => {
          const k = KINDS[c.kind];
          return `<div class="tcard k-${c.kind}" style="--tc:${k.c}">
            <div class="tc-top"><span class="tc-name">${bi(c.name)}</span><span class="tc-sym" title="${k[L()]}">${k.sym}</span></div>
            <div class="tc-art${c.fit === "cover" ? " cover" : ""}"><img src="img/${c.img}" alt="${esc(c.name[L()])}" data-zoom>${c.kind === "sealed" ? `<span class="tc-seal">${bi({ de: "Versiegelt", en: "Sealed" })}</span>` : ""}</div>
            <div class="tc-type">${bi(c.type)}</div>
            <div class="tc-text">${bi(c.text)}</div>
            <div class="tc-foot"><span>Illustr. L. Atzenbeck</span><span>${no(c)}</span></div>
          </div>`;
        };
        const show = (c, animate) => {
          spot.innerHTML = cardHTML(c);
          if (animate) spot.firstElementChild.classList.add("enter");
          $$(".mini", album).forEach(m => m.classList.toggle("on", m.dataset.card === c.id));
        };
        const renderAlbum = () => {
          album.innerHTML = CARDS.map(c => {
            const got = state.cards.includes(c.id);
            return got
              ? `<button type="button" class="mini" data-card="${c.id}" style="--tc:${KINDS[c.kind].c}"><img src="img/${c.img}" alt=""><span>${bi(c.name)}</span></button>`
              : `<span class="mini back" aria-hidden="true"><b>?</b><span>${no(c)}</span></span>`;
          }).join("");
          const n = state.cards.length, rest = total - n;
          count.textContent = `${n}/${total}`;
          left.innerHTML = bi({ de: T.de.deckLeft(rest), en: T.en.deckLeft(rest) });
          deck.dataset.left = rest;
          deck.disabled = allBtn.disabled = $(".draw-one", root).disabled = rest === 0;
        };
        const draw = () => {
          const pool = CARDS.filter(c => !state.cards.includes(c.id));
          if (!pool.length) return;
          const c = pool[Math.floor(Math.random() * pool.length)];
          state.cards.push(c.id); save();
          renderAlbum(); show(c, true);
          deck.classList.remove("pulled"); void deck.offsetWidth; deck.classList.add("pulled");
          if (state.cards.length === total) setTimeout(() => toast(t("deckDone")), 700);
        };
        deck.addEventListener("click", draw);
        $(".draw-one", root).addEventListener("click", draw);
        allBtn.addEventListener("click", () => {
          CARDS.forEach(c => { if (!state.cards.includes(c.id)) state.cards.push(c.id); });
          save(); renderAlbum(); show(byId(state.cards[state.cards.length - 1]), true);
          toast(t("deckDone"));
        });
        album.addEventListener("click", e => { const m = e.target.closest(".mini[data-card]"); if (m) show(byId(m.dataset.card), true); });
        renderAlbum();
        if (state.cards.length) show(byId(state.cards[state.cards.length - 1]), false);
        break;
      }
      case "room46": {
        $$(".cert-day", root).forEach(e => (e.textContent = state.day));
        $$(".cert-rooms", root).forEach(e => (e.textContent = state.order.length));
        const inp = $(".cert-name", root);
        try { inp.value = localStorage.getItem(STORE + ".name") || ""; } catch (e) { /* ignore */ }
        inp.addEventListener("input", () => { try { localStorage.setItem(STORE + ".name", inp.value); } catch (e) { /* ignore */ } });
        break;
      }
    }
  }

  /* ---------- lightbox ---------- */
  function openLightbox(img) {
    const lb = $("#lightbox");
    const big = $("#lbImg");
    const lamp = img.closest(".lampframe");
    const src = lamp ? $(lamp.classList.contains("off") ? ".lf-off" : ".lf-on", lamp) : img;
    big.src = src.src;
    big.alt = src.alt;
    const fig = img.closest("figure");
    const cap = fig && fig.querySelector("figcaption");
    $("#lbCap").innerHTML = cap ? cap.innerHTML : "";
    openOverlay(lb);
  }

  /* ---------- language ---------- */
  function setLang(l) {
    state.lang = l;
    document.documentElement.lang = l;
    $("#langToggle").setAttribute("aria-label", l === "de" ? "Sprache: Deutsch – zu Englisch wechseln" : "Language: English – switch to German");
    save();
    renderPlan();
    if (stack.some(s => s.el.id === "draftOverlay")) renderDraft();
  }

  /* ---------- events ---------- */
  function activateCell(g) {
    const i = +g.dataset.i;
    if (i === R46) return try46(g);
    if (g.classList.contains("room")) return openRoom(g.dataset.id, g);
    if (g.classList.contains("avail")) return openDraft(i);
  }
  plan.addEventListener("click", e => { const g = e.target.closest(".cell"); if (g) activateCell(g); });
  plan.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const g = e.target.closest(".cell");
    if (g) { e.preventDefault(); activateCell(g); }
  });

  $("#draftCards").addEventListener("click", e => { const b = e.target.closest("[data-pick]"); if (b) choose(b.dataset.pick); });
  $("#rerollBtn").addEventListener("click", () => {
    if (state.dice < 1) return toast(t("noDice"));
    state.dice--; save(); renderStats();
    draftOpts = pick3(draftOpts);
    renderDraft();
  });
  $("#draftCancel").addEventListener("click", () => closeOverlay($("#draftOverlay")));
  $("#draftOverlay").addEventListener("click", e => { if (e.target.id === "draftOverlay") closeOverlay(e.currentTarget); });

  $("#roomClose").addEventListener("click", closeRoom);
  $("#roomBack").addEventListener("click", closeRoom);
  $("#roomOverlay").addEventListener("click", e => { if (e.target.id === "roomOverlay") closeRoom(); });
  $("#roomBody").addEventListener("click", e => {
    const img = e.target.closest("img[data-zoom]");
    if (img) return openLightbox(img);
    const act = e.target.closest("[data-action]");
    if (!act) return;
    closeRoom();
    if (act.dataset.action === "quick") $("#quickBtn").click();
  });

  $("#quickBtn").addEventListener("click", () => { openOverlay($("#quickOverlay")); $("#quickOverlay").scrollTop = 0; $("#quickClose").focus({ preventScroll: true }); });
  $("#quickClose").addEventListener("click", () => closeOverlay($("#quickOverlay")));
  $("#quickBack").addEventListener("click", () => closeOverlay($("#quickOverlay")));
  $("#quickPrint").addEventListener("click", () => window.print());
  $("#quickOverlay").addEventListener("click", e => { if (e.target.id === "quickOverlay") closeOverlay(e.currentTarget); });

  $("#lightbox").addEventListener("click", () => closeOverlay($("#lightbox")));

  $("#roomBook").addEventListener("click", e => {
    const b = e.target.closest("[data-open]");
    if (!b) return;
    const id = b.dataset.open;
    openRoom(id, b);
  });

  $("#langToggle").addEventListener("click", () => setLang(state.lang === "de" ? "en" : "de"));

  $("#resetBtn").addEventListener("click", () => {
    if (!window.confirm(t("reset"))) return;
    state = fresh(state.lang, (state.day || 1) + 1);
    state.entered = true;
    save();
    renderAll();
    toast(t("newDay"));
  });

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape" || !stack.length) return;
    const top = stack[stack.length - 1].el;
    if (top.id === "roomOverlay") closeRoom(); else closeOverlay(top);
  });

  /* ---------- boot ---------- */
  setLang(state.lang);
  renderAll();
})();
