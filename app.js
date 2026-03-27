const content = document.getElementById("content");
const menuLinks = [...document.querySelectorAll(".menu a")];

const lightbox = document.getElementById("lightbox");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxDescription = document.getElementById("lightboxDescription");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxCategoryLink = document.getElementById("lightboxCategoryLink");

const categoryMeta = {
  illustrasyon: { title: "İllüstrasyon", color: "#cbd57f" },
  "oyun-tasarimi": { title: "Oyun Tasarımı", color: "#efc3ef" },
  "logo-tasarimi": { title: "Logo Tasarımı", color: "#9fd5db" },
  poster: { title: "Poster", color: "#cbd57f" },
  "baski-sanatlari": { title: "Baskı Sanatları", color: "#9fd5db" },
  fotograflarim: { title: "Fotoğraflarım", color: "#efc3ef" },
  "ui-ux": { title: "UI-UX", color: "#cbd57f" },
};

function item(id, { title, category, description, route }) {
  return {
    id,
    src: `assets/resources/${id}.webp`,
    title,
    category,
    description,
    route,
  };
}

const entries = {
  osman: item("13f12aa4207b73b676e70c5ee7ac54f1", {
    title: "Osman Hamdi Bey İllüstrasyonu",
    category: "illustrasyon",
    description: "Geçmişten günümüze sanatın değişimi temalı dijital illüstrasyon.",
  }),
  dodo: item("b27c854953af8f1993c8ca5a51af6d31", {
    title: "Dodo Kuşu Konsept Tasarım",
    category: "illustrasyon",
    description: "Karakter odaklı konsept illüstrasyon çalışması.",
  }),
  cocukTren: item("ded6cd5071b06a4fa01e2be5acd62c9c", {
    title: "Çocuk Kitabı Resimleme",
    category: "illustrasyon",
    description: "Çocuk kitabı için hazırlanan sahne illüstrasyonu.",
  }),
  kadinPortre: item("62d38530f4aeac906d0a9233cc0e8bdc", {
    title: "Portre İllüstrasyonu",
    category: "illustrasyon",
    description: "Karakter ve atmosfer odaklı dijital çizim.",
  }),
  sokakKarakter: item("cb687f65eba00824f4a495a23980dbcd", {
    title: "Sokak Karakteri",
    category: "illustrasyon",
    description: "Kompozisyon merkezli illüstrasyon denemesi.",
  }),
  siyahBeyaz: item("9ab614a5521afca56cb9b7b888db0e9c", {
    title: "Siyah Beyaz Çalışma",
    category: "illustrasyon",
    description: "Yüksek kontrastlı çizim diliyle üretilen çalışma.",
  }),
  mantar: item("52650ade44c23a41a7300709b05fb1a3", {
    title: "Mantar Kompozisyonu",
    category: "illustrasyon",
    description: "Renk ve doku ilişkisine odaklanan çalışma.",
  }),
  kule: item("6d13bceb68030de4ba849de97daa0b1a", {
    title: "Kule İllüstrasyonu",
    category: "illustrasyon",
    description: "Mimari ve tipografi birleşimi deneysel kompozisyon.",
  }),
  sahne1: item("6b5b8c1e707525fce6f553265ab3bc99", {
    title: "Sahne Çalışması 1",
    category: "illustrasyon",
    description: "Anlatım odaklı sahne tasarımı.",
  }),
  sahne2: item("92c53d9bce22584fe952c429591e311a", {
    title: "Sahne Çalışması 2",
    category: "illustrasyon",
    description: "Diyalog anı üzerine kurulu sahne illüstrasyonu.",
  }),
  ucus: item("1537ffcd34507c9077a39bef7e78664d", {
    title: "Uçuş Temalı Çalışma",
    category: "illustrasyon",
    description: "Hareket hissini ön plana alan kompozisyon.",
  }),
  harfA: item("a0268a86b6e210d2367b8fb645cadd9c", {
    title: "A Harfi Karakter Tasarımı",
    category: "illustrasyon",
    description: "Tipografi tabanlı karakter denemesi.",
  }),
  harfB: item("4b5e263d6a019947c578d14158e44d41", {
    title: "B Harfi Karakter Tasarımı",
    category: "illustrasyon",
    description: "Harf formundan üretilmiş karakter tasarımı.",
  }),
  harfC: item("3efa65ade995ab98cd6f8e5fc9190a81", {
    title: "C Harfi Karakter Tasarımı",
    category: "illustrasyon",
    description: "Çocuk odaklı tipografik karakter çalışması.",
  }),
  robotKiz: item("6e38537642a714c3e0aedbbd87e8b4de", {
    title: "Robot Kız Konsept Sanatı",
    category: "oyun-tasarimi",
    description: "Oyun evreni için üretilen karakter konsepti.",
  }),
  utuZirh: item("5532fd8e1679b39a1ca61a0e42b19098", {
    title: "Eski Demir Ütü Zırhı Şövalye",
    category: "oyun-tasarimi",
    description: "Fantezi temalı karakter tasarımı.",
  }),
  gazLambasi: item("eb69bfcbc5a8ddb3f660c20c156aecd3", {
    title: "Gaz Lambası Karakter Tasarımı",
    category: "oyun-tasarimi",
    description: "Ortamla bütünleşen karakter tasarımı.",
  }),
  karanlikMekan: item("f50a59e49b0a1fd91608fc071f141cf2", {
    title: "Karanlık Mekan Konsepti",
    category: "oyun-tasarimi",
    description: "Atmosfer ağırlıklı çevre konsept çalışması.",
  }),
  matruska: item("031eb89c29d2fd939702e967c079094c", {
    title: "Matauşka Logo",
    category: "logo-tasarimi",
    description: "Kırtasiye & kafe markası için logo tasarımı.",
  }),
  koru: item("ac8a38b7e1628e6823e015b7198e117a", {
    title: "Koru Motor Logo",
    category: "logo-tasarimi",
    description: "Tipografik ve ikon birleşimli logo tasarımı.",
  }),
  unimuseumLogo: item("8e979a6e9daf22a3395a43b14c560556", {
    title: "Unimuseum Logo",
    category: "logo-tasarimi",
    description: "Dergi kimliği için logo çözümü.",
  }),
  idolPoster: item("60f4f04c156f6f38135b55541d158f7f", {
    title: "The Idol Poster",
    category: "poster",
    description: "Müzik posteri kompozisyonu.",
  }),
  truva: item("2f63d1e815b59887abff3c8f1ee5ccdd", {
    title: "Truva Film Afişi",
    category: "poster",
    description: "Film afişi yeniden yorumlama çalışması.",
  }),
  stiSpider: item("f6d5771a8eba46280b510bdb514643b0", {
    title: "STI Spider Konsept Infografik",
    category: "poster",
    description: "Teknik infografik ve konsept araç sunumu.",
  }),
  ruzgarKitap: item("0413f47b4db4d57c7baa8581c9ec9d5b", {
    title: "Rüzgarı Dizginleyen Çocuk Kapak Tasarımı",
    category: "baski-sanatlari",
    description: "Kitap kapağı ve mockup uygulaması.",
  }),
  unimuseumKapak: item("bd3e7846b1b4815d1b7d2a364a446f3d", {
    title: "Unimuseum Kapak Tasarımı",
    category: "baski-sanatlari",
    description: "Dergi kapak tasarımı.",
  }),
  plak: item("10fc55d1ef25c4f1b864dd08dc86c338", {
    title: "Plak Kapağı Tasarımı",
    category: "baski-sanatlari",
    description: "Müzik albümü için kapak tasarımı.",
  }),
  foto1: item("7e0e3000b2f73e065708bf84deb40d75", {
    title: "Fotoğraf 1",
    category: "fotograflarim",
    description: "Siyah beyaz fotoğraf çalışması.",
  }),
  foto2: item("bb641be684fb6a6d52825450e564e8a7", {
    title: "Fotoğraf 2",
    category: "fotograflarim",
    description: "Deneysel tonlamalı fotoğraf.",
  }),
  foto3: item("c6e3e276698073d5b38a9ee9cae6bce0", {
    title: "Fotoğraf 3",
    category: "fotograflarim",
    description: "Mekansal ışık ve doku çalışması.",
  }),
  motionIcon: item("51a663d6a96f016509e14b9b7550912f", {
    title: "Hareketli Grafik Demo",
    category: "illustrasyon",
    description: "Hareketli içerik önizleme kartı.",
    route: "#/hareketli-goruntuler",
  }),
  contactVisual: item("8f0545dd694ef57f58ca53f028a0b0f2", {
    title: "İletişim Görseli",
    category: "illustrasyon",
    description: "İletişim bölümünde kullanılan görsel.",
    route: "#/iletisim",
  }),
  profile: item("8948cc1b48bdc5d18efe10cc7d5a6ca7", {
    title: "Sedat Kutay Akdeniz",
    category: "illustrasyon",
    description: "Portfolyo profil görseli.",
    route: "#/hakkimda",
  }),
};

const illustrationItems = [
  entries.osman,
  entries.dodo,
  entries.cocukTren,
  entries.kadinPortre,
  entries.sokakKarakter,
  entries.siyahBeyaz,
  entries.mantar,
  entries.kule,
  entries.sahne1,
  entries.sahne2,
  entries.ucus,
  entries.harfA,
  entries.harfB,
  entries.harfC,
];

const gameItems = [entries.robotKiz, entries.utuZirh, entries.gazLambasi, entries.karanlikMekan];
const logoItems = [entries.matruska, entries.koru, entries.unimuseumLogo];
const posterItems = [entries.idolPoster, entries.truva, entries.stiSpider];
const printItems = [entries.ruzgarKitap, entries.unimuseumKapak, entries.plak, entries.idolPoster];
const photoItems = [entries.foto1, entries.foto2, entries.foto3];
const motionItems = [
  { ...entries.motionIcon, id: `${entries.motionIcon.id}-1`, title: "Motion Demo 1" },
  { ...entries.motionIcon, id: `${entries.motionIcon.id}-2`, title: "Motion Demo 2" },
  { ...entries.motionIcon, id: `${entries.motionIcon.id}-3`, title: "Motion Demo 3" },
];

const categoryConfig = {
  illustrasyon: { ...categoryMeta.illustrasyon, items: illustrationItems },
  "oyun-tasarimi": { ...categoryMeta["oyun-tasarimi"], items: gameItems },
  "logo-tasarimi": { ...categoryMeta["logo-tasarimi"], items: logoItems },
  poster: { ...categoryMeta.poster, items: posterItems },
  "baski-sanatlari": { ...categoryMeta["baski-sanatlari"], items: printItems },
  fotograflarim: { ...categoryMeta.fotograflarim, items: photoItems },
  "ui-ux": { ...categoryMeta["ui-ux"], items: [] },
};

const projectCategories = [
  { slug: "illustrasyon", label: "İllüstrasyon", tone: "is-olive" },
  { slug: "oyun-tasarimi", label: "Oyun Tasarımı", tone: "is-pink" },
  { slug: "logo-tasarimi", label: "Logo Tasarımı", tone: "is-teal" },
  { slug: "poster", label: "Poster", tone: "is-olive" },
  { slug: "baski-sanatlari", label: "Baskı Sanatları", tone: "is-teal" },
  { slug: "fotograflarim", label: "Fotoğraflarım", tone: "is-pink" },
  { slug: "ui-ux", label: "UI-UX", tone: "is-olive" },
];

const homeItems = [
  entries.osman,
  entries.robotKiz,
  entries.cocukTren,
  entries.idolPoster,
  entries.utuZirh,
  entries.gazLambasi,
  entries.unimuseumKapak,
  entries.dodo,
  entries.siyahBeyaz,
  entries.kadinPortre,
  entries.sokakKarakter,
  entries.unimuseumLogo,
  entries.ruzgarKitap,
  entries.stiSpider,
  entries.mantar,
  entries.karanlikMekan,
  entries.kule,
  entries.sahne1,
  entries.sahne2,
  entries.ucus,
  entries.harfA,
  entries.harfB,
  entries.harfC,
  entries.foto1,
  entries.foto2,
  entries.foto3,
];

const allKnownItems = uniqueItems([
  ...illustrationItems,
  ...gameItems,
  ...logoItems,
  ...posterItems,
  ...printItems,
  ...photoItems,
  ...homeItems,
]);

let dynamicFlowItems = [...homeItems];
let dynamicFlowSignature = "";
let dynamicCategoryItems = {};
let externalContentItems = [];
let activeLightboxItems = [];
let activeLightboxIndex = 0;

function uniqueItems(items) {
  const seen = new Set();
  const out = [];
  items.forEach((entry) => {
    const key = `${entry.id}|${entry.src}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(entry);
  });
  return out;
}

function itemFileName(entry) {
  return entry.src.split("/").pop() || "";
}

function normalizeCategory(category) {
  return categoryMeta[category] ? category : "illustrasyon";
}

function applyOverrideToItem(entry, overrides = {}) {
  const byId = overrides[entry.id];
  const byFile = overrides[itemFileName(entry)];
  const meta =
    (byId && typeof byId === "object" && !Array.isArray(byId) ? byId : null) ||
    (byFile && typeof byFile === "object" && !Array.isArray(byFile) ? byFile : null);

  if (!meta) return entry;

  return {
    ...entry,
    title: meta.title || entry.title,
    description: meta.description || entry.description,
    category: normalizeCategory(meta.category || entry.category),
    route: typeof meta.route === "string" ? meta.route : entry.route,
  };
}

function applyOverrides(items, overrides = {}) {
  return items.map((entry) => applyOverrideToItem(entry, overrides));
}

function clearContent() {
  content.innerHTML = "";
}

function createTitle(text, color) {
  const heading = document.createElement("h1");
  heading.className = "page-title";
  heading.textContent = text;
  heading.style.setProperty("--title-color", color);
  return heading;
}

function normalizeImageUrl(url) {
  if (typeof url !== "string") return "";
  return encodeURI(url.trim());
}

function uniqueStrings(list) {
  return [...new Set(list.filter(Boolean))];
}

function buildImageCandidates(src) {
  if (typeof src !== "string" || !src.trim()) return [];
  const raw = src.trim();
  if (/^https?:\/\//iu.test(raw) || raw.startsWith("data:")) {
    return [normalizeImageUrl(raw)];
  }

  const [pathOnly] = raw.split(/[?#]/u);
  const dotIndex = pathOnly.lastIndexOf(".");
  const hasExt = dotIndex > pathOnly.lastIndexOf("/");
  const basePath = hasExt ? pathOnly.slice(0, dotIndex) : pathOnly;
  const ext = hasExt ? pathOnly.slice(dotIndex + 1).toLowerCase() : "";
  const variants = ["webp", "jpg", "jpeg", "png", "avif"];
  const ordered = uniqueStrings([ext, ...variants]).filter(Boolean);

  if (!hasExt) {
    return ordered.map((candidateExt) => normalizeImageUrl(`${basePath}.${candidateExt}`));
  }

  return [
    normalizeImageUrl(raw),
    ...ordered
      .filter((candidateExt) => candidateExt !== ext)
      .map((candidateExt) => normalizeImageUrl(`${basePath}.${candidateExt}`)),
  ];
}

function setImageWithFallback(imageEl, src) {
  const candidates = buildImageCandidates(src);
  if (!candidates.length) return;

  let index = 0;
  imageEl.src = candidates[index];
  imageEl.onerror = () => {
    index += 1;
    if (index >= candidates.length) {
      imageEl.onerror = null;
      return;
    }
    imageEl.src = candidates[index];
  };
}

function createGallery(items) {
  const gallery = document.createElement("div");
  gallery.className = "gallery";

  items.forEach((entry) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card";

    const image = document.createElement("img");
    image.className = "gallery-image";
    setImageWithFallback(image, entry.src);
    image.alt = entry.title;
    image.loading = "lazy";
    image.decoding = "async";

    card.append(image);
    card.addEventListener("click", () => openLightbox(entry, items));
    gallery.append(card);
  });

  return gallery;
}

function ensureMinimumItems(items, minimum) {
  if (items.length === 0) return [];
  if (items.length >= minimum) return [...items];
  const result = [...items];
  while (result.length < minimum) result.push(...items);
  return result.slice(0, minimum);
}

function splitIntoColumns(items, count) {
  const columns = Array.from({ length: count }, () => []);
  items.forEach((entry, index) => {
    columns[index % count].push(entry);
  });
  return columns;
}

function createFlowCard(entry, contextItems) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "flow-card";

  const image = document.createElement("img");
  image.className = "flow-image";
  setImageWithFallback(image, entry.src);
  image.alt = entry.title;
  image.loading = "lazy";
  image.decoding = "async";

  card.append(image);
  card.addEventListener("click", () => openLightbox(entry, contextItems));
  return card;
}

function createFlowWall(items) {
  const streamItems = ensureMinimumItems(uniqueItems(items), 18);
  const columns = splitIntoColumns(streamItems, 3);

  const wall = document.createElement("section");
  wall.className = "flow-wall";

  columns.forEach((colItems, index) => {
    const column = document.createElement("div");
    column.className = "flow-column";

    const track = document.createElement("div");
    track.className = "flow-track";
    const baseItems = ensureMinimumItems(colItems, 8);
    const loopItems = [...baseItems, ...baseItems];
    const duration = 84 + index * 12 + baseItems.length * 2.4;
    track.style.setProperty("--flow-duration", `${duration}s`);

    loopItems.forEach((entry) => track.append(createFlowCard(entry, streamItems)));
    column.append(track);
    wall.append(column);
  });

  return wall;
}

function getFlowItems() {
  return dynamicFlowItems.length ? dynamicFlowItems : homeItems;
}

function getCategoryItems(slug) {
  if (Array.isArray(dynamicCategoryItems[slug])) return dynamicCategoryItems[slug];
  const category = categoryConfig[slug];
  return category ? category.items : [];
}

function renderCalismalarim() {
  clearContent();
  content.append(createFlowWall(getFlowItems()));
}

function renderProjeler() {
  clearContent();
  content.append(createTitle("Projeler", "#cbd57f"));

  const list = document.createElement("div");
  list.className = "projects-list";

  projectCategories.forEach((project) => {
    const link = document.createElement("a");
    link.className = `projects-link ${project.tone}`;
    link.href = `#/projeler/${project.slug}`;
    link.textContent = project.label;
    list.append(link);
  });

  content.append(list);
}

function renderCategory(slug) {
  const category = categoryConfig[slug];
  if (!category) {
    renderCalismalarim();
    return;
  }

  clearContent();
  content.append(createTitle(category.title, category.color));

  const items = getCategoryItems(slug);
  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Bu bölüm için henüz paylaşılan çalışma bulunmuyor.";
    content.append(empty);
    return;
  }

  content.append(createGallery(items));
}

function renderHareketli() {
  clearContent();
  content.append(createTitle("Hareketli Grafik", "#9fd5db"));

  const grid = document.createElement("div");
  grid.className = "motion-grid";
  motionItems.forEach((entry) => {
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "gallery-card";

    const image = document.createElement("img");
    setImageWithFallback(image, entry.src);
    image.alt = entry.title;
    image.loading = "lazy";
    image.decoding = "async";

    trigger.append(image);
    trigger.addEventListener("click", () => openLightbox(entry, motionItems));
    grid.append(trigger);
  });

  content.append(grid);
}

function renderHakkimda() {
  clearContent();
  content.append(createTitle("Sedat Kutay Akdeniz", "#cbd57f"));

  const wrapper = document.createElement("section");
  wrapper.className = "about";

  const image = document.createElement("img");
  image.className = "about-image";
  image.src = entries.profile.src;
  image.alt = "Sedat Kutay Akdeniz";
  wrapper.append(image);

  const intro = document.createElement("p");
  intro.textContent =
    "Merhaba, ben Sedat Kutay Akdeniz. 2000 yılında doğdum ve lisans eğitimimi Güzel Sanatlar Bölümü Resim Bölümü'nde tamamladım. İllüstrasyon, karakter tasarımı, kapak/poster işleri ve görsel hikaye anlatımı odaklı çalışıyorum.";
  wrapper.append(intro);

  const detail = document.createElement("p");
  detail.textContent =
    "Farklı disiplinlerden beslenerek hem dijital hem de baskıya uygun üretimler yapıyorum. Hikayesi güçlü, görsel dili net ve özgün çalışmalar üretmeyi hedefliyorum.";
  wrapper.append(detail);

  const columns = document.createElement("div");
  columns.className = "about-columns";

  const left = document.createElement("div");
  left.innerHTML = `
    <h3>Eğitim</h3>
    <ul>
      <li>2021 - 2025 | Sinop Üniversitesi, Güzel Sanatlar Fakültesi</li>
      <li>2017 - 2021 | Vakfıkebir Güzel Sanatlar Lisesi</li>
    </ul>
  `;

  const right = document.createElement("div");
  right.innerHTML = `
    <h3>Kullandığım Araçlar</h3>
    <ul>
      <li>Adobe Illustrator</li>
      <li>Adobe Photoshop</li>
      <li>Adobe Lightroom</li>
      <li>XD / Figma</li>
    </ul>
  `;

  columns.append(left, right);
  wrapper.append(columns);
  content.append(wrapper);
}

function renderIletisim() {
  clearContent();
  content.append(createTitle("Sedat Kutay Akdeniz", "#cbd57f"));

  const section = document.createElement("section");
  section.className = "contact";

  const grid = document.createElement("div");
  grid.className = "contact-grid";

  const form = document.createElement("form");
  form.className = "contact-form";
  form.innerHTML = `
    <label>
      Ad Soyad
      <input type="text" name="name" required />
    </label>
    <label>
      E-posta
      <input type="email" name="email" required />
    </label>
    <label>
      Mesaj
      <textarea name="message" required></textarea>
    </label>
    <button type="submit">GÖNDER</button>
  `;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Mesajınız için teşekkürler.");
    form.reset();
  });

  const image = document.createElement("img");
  image.className = "contact-image";
  image.src = entries.contactVisual.src;
  image.alt = "İletişim görseli";

  grid.append(form, image);
  section.append(grid);
  content.append(section);
}

function normalizeRoute(hashRoute) {
  const raw = hashRoute.replace(/^#\/?/, "").trim().toLowerCase();
  if (!raw) return "calismalarim";
  if (raw === "hareketli") return "hareketli-goruntuler";
  return raw;
}

function setActiveMenu(route) {
  const root = route.split("/")[0];
  const target = root === "projeler" ? "projeler" : root;

  menuLinks.forEach((link) => {
    const isActive = link.dataset.route === target;
    link.classList.toggle("active", isActive);
  });
}

function renderRoute() {
  const route = normalizeRoute(location.hash);
  setActiveMenu(route);

  if (route === "calismalarim") {
    renderCalismalarim();
    return;
  }
  if (route === "projeler") {
    renderProjeler();
    return;
  }
  if (route.startsWith("projeler/")) {
    const slug = route.split("/")[1] || "";
    renderCategory(slug);
    return;
  }
  if (route === "hareketli-goruntuler") {
    renderHareketli();
    return;
  }
  if (route === "hakkimda") {
    renderHakkimda();
    return;
  }
  if (route === "iletisim") {
    renderIletisim();
    return;
  }

  location.hash = "#/calismalarim";
}

function updateLightboxContent() {
  const entry = activeLightboxItems[activeLightboxIndex];
  if (!entry) return;

  lightboxTitle.textContent = entry.title || "Çalışma";
  setImageWithFallback(lightboxImage, entry.src);
  lightboxImage.alt = entry.title || "Çalışma";

  const category = categoryMeta[entry.category];
  lightboxCategory.textContent = category ? category.title : "Çalışmalarım";
  lightboxDescription.textContent =
    entry.description || "Bu görsel için ek bilgi henüz paylaşılmadı.";

  const route = entry.route || (entry.category ? `#/projeler/${entry.category}` : "#/projeler");
  lightboxCategoryLink.href = route;
  lightboxCategoryLink.textContent = entry.route ? "İlgili bölüme git" : "Bu kategoriye git";

  const disableStep = activeLightboxItems.length < 2;
  lightboxPrev.disabled = disableStep;
  lightboxNext.disabled = disableStep;
}

function openLightbox(entry, contextItems = [entry]) {
  activeLightboxItems = uniqueItems(contextItems.length ? contextItems : [entry]);
  activeLightboxIndex = Math.max(
    0,
    activeLightboxItems.findIndex((itemEntry) => itemEntry.id === entry.id)
  );

  updateLightboxContent();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

function stepLightbox(direction) {
  if (activeLightboxItems.length < 2) return;
  const total = activeLightboxItems.length;
  activeLightboxIndex = (activeLightboxIndex + direction + total) % total;
  updateLightboxContent();
}

function titleFromFileName(fileName) {
  const base = fileName.replace(/\.[^/.]+$/u, "");
  return base
    .replace(/[-_]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim()
    .replace(/\b\p{L}/gu, (match) => match.toUpperCase());
}

function fileId(fileName) {
  return fileName.replace(/\.[^/.]+$/u, "");
}

function normalizeExternalFilePath(rawPath) {
  if (typeof rawPath !== "string") return "";
  const trimmed = rawPath.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//iu.test(trimmed) || trimmed.startsWith("data:")) return trimmed;

  const clean = trimmed.replace(/^\/+/u, "");
  if (clean.startsWith("assets/resources/")) return clean;

  return `assets/resources/${clean.replace(/^\.?\/+/u, "")}`;
}

function fileNameFromPath(srcPath) {
  if (!srcPath || typeof srcPath !== "string") return "";
  const normalized = srcPath.split("?")[0].split("#")[0];
  const parts = normalized.split("/");
  return parts[parts.length - 1] || "";
}

function stableIdFromPath(srcPath) {
  return srcPath
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}

function createFallbackItem(filePath, externalMeta = {}) {
  const normalizedSrc = normalizeExternalFilePath(filePath);
  if (!normalizedSrc) return null;

  const fileName = fileNameFromPath(normalizedSrc);
  const id = fileName ? fileId(fileName) : `external-${stableIdFromPath(normalizedSrc)}`;
  const safeCategory = categoryMeta[externalMeta.category] ? externalMeta.category : "illustrasyon";
  return {
    id,
    src: normalizedSrc,
    title: externalMeta.title || titleFromFileName(fileName || id),
    category: safeCategory,
    description:
      externalMeta.description ||
      "Bu görsel akışa yeni eklendi. Kategori bilgisi otomatik olarak varsayılan alana atandı.",
    route: typeof externalMeta.route === "string" ? externalMeta.route : undefined,
  };
}

async function loadExternalInfoMap() {
  try {
    const bust = Date.now();
    const response = await fetch(`assets/resources/info.json?v=${bust}`, { cache: "no-store" });
    if (!response.ok) return {};
    const data = await response.json();
    return data && typeof data === "object" ? data : {};
  } catch (error) {
    return {};
  }
}

function getOverridesMap(infoMap) {
  if (!infoMap || typeof infoMap !== "object") return {};

  const overrides = {};
  if (infoMap.overrides && typeof infoMap.overrides === "object" && !Array.isArray(infoMap.overrides)) {
    Object.assign(overrides, infoMap.overrides);
  }

  const reserved = new Set(["items", "overrides", "_comment", "_docs"]);
  Object.entries(infoMap).forEach(([key, value]) => {
    if (reserved.has(key)) return;
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    overrides[key] = value;
  });

  return overrides;
}

function parseExternalItems(infoMap) {
  if (!infoMap || typeof infoMap !== "object") return [];
  if (!Array.isArray(infoMap.items)) return [];

  const parsed = infoMap.items
    .map((rawItem) => {
      if (typeof rawItem === "string") {
        return createFallbackItem(rawItem, {});
      }
      if (!rawItem || typeof rawItem !== "object") return null;

      const fileCandidate =
        (typeof rawItem.file === "string" && rawItem.file) ||
        (typeof rawItem.src === "string" && rawItem.src) ||
        (typeof rawItem.image === "string" && rawItem.image) ||
        (typeof rawItem.path === "string" && rawItem.path) ||
        "";
      if (!fileCandidate.trim()) return null;

      return createFallbackItem(fileCandidate, rawItem);
    })
    .filter(Boolean);

  return uniqueItems(parsed);
}

function buildCategoryItems(overrides, extraItems) {
  const built = {};
  Object.entries(categoryConfig).forEach(([slug, config]) => {
    const base = applyOverrides(config.items, overrides);
    const extra = extraItems.filter((entry) => entry.category === slug);
    built[slug] = uniqueItems([...base, ...extra]);
  });
  return built;
}

function itemsSignature(items) {
  return items.map((entry) => `${entry.id}|${entry.src}|${entry.title}|${entry.category}`).join(";");
}

async function hydrateFlowItems() {
  const infoMap = await loadExternalInfoMap();
  const overrides = getOverridesMap(infoMap);
  externalContentItems = parseExternalItems(infoMap);

  const homeWithOverrides = applyOverrides(homeItems, overrides);
  dynamicFlowItems = uniqueItems([...homeWithOverrides, ...externalContentItems]);
  dynamicCategoryItems = buildCategoryItems(overrides, externalContentItems);

  const categorySignature = Object.entries(dynamicCategoryItems)
    .map(([slug, items]) => `${slug}:${itemsSignature(items)}`)
    .join("||");
  const nextSignature = `${itemsSignature(dynamicFlowItems)}::${categorySignature}`;
  if (nextSignature === dynamicFlowSignature) return;
  dynamicFlowSignature = nextSignature;

  const route = normalizeRoute(location.hash);
  if (route === "calismalarim" || route.startsWith("projeler/")) {
    renderRoute();
  }
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightboxPrev.addEventListener("click", () => stepLightbox(-1));
lightboxNext.addEventListener("click", () => stepLightbox(1));
lightboxCategoryLink.addEventListener("click", () => closeLightbox());

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "ArrowLeft") stepLightbox(-1);
  if (event.key === "ArrowRight") stepLightbox(1);
});

window.addEventListener("hashchange", () => {
  closeLightbox();
  renderRoute();
});

renderRoute();
hydrateFlowItems();
setInterval(hydrateFlowItems, 45000);
