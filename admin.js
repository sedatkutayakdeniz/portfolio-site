const SETTINGS_KEY = "kutay_admin_github_settings_v1";
const INFO_PATH = "assets/resources/info.json";

const AUTH_PROFILE_KEY = "kutay_admin_auth_profile_v1";
const AUTH_SESSION_KEY = "kutay_admin_auth_session_v1";

const authCard = document.getElementById("authCard");
const adminPanel = document.getElementById("adminPanel");
const authForm = document.getElementById("authForm");
const authHint = document.getElementById("authHint");
const authUsernameInput = document.getElementById("authUsername");
const authPasswordInput = document.getElementById("authPassword");
const authPasswordConfirmWrap = document.getElementById("authConfirmWrap");
const authPasswordConfirmInput = document.getElementById("authPasswordConfirm");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authStatus = document.getElementById("authStatus");
const logoutBtn = document.getElementById("logoutBtn");

const settingsForm = document.getElementById("settingsForm");
const ghTokenInput = document.getElementById("ghToken");
const ghOwnerInput = document.getElementById("ghOwner");
const ghRepoInput = document.getElementById("ghRepo");
const ghBranchInput = document.getElementById("ghBranch");
const testConnectionBtn = document.getElementById("testConnectionBtn");
const settingsStatus = document.getElementById("settingsStatus");

const contentForm = document.getElementById("contentForm");
const contentFormTitle = document.getElementById("contentFormTitle");
const contentFormHint = document.getElementById("contentFormHint");
const contentFileInput = document.getElementById("contentFile");
const contentTitleInput = document.getElementById("contentTitle");
const contentCategoryInput = document.getElementById("contentCategory");
const contentDescriptionInput = document.getElementById("contentDescription");
const contentRouteInput = document.getElementById("contentRoute");
const publishBtn = document.getElementById("publishBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const contentStatus = document.getElementById("contentStatus");

const itemsContainer = document.getElementById("itemsContainer");

let cachedInfo = { items: [], overrides: {} };
let editingItemIndex = null;
let editingOriginalFile = "";
let authMode = "login";
let isAuthenticated = false;

function setStatus(target, message, isError = false) {
  target.textContent = message;
  target.classList.toggle("error", isError);
}

function readJsonStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_error) {
    return null;
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readSettings() {
  return readJsonStorage(SETTINGS_KEY);
}

function writeSettings(settings) {
  writeJsonStorage(SETTINGS_KEY, settings);
}

function maskToken(token) {
  if (!token || token.length < 8) return "********";
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

function fillSettingsForm(settings) {
  if (!settings) return;
  ghTokenInput.value = settings.token || "";
  ghOwnerInput.value = settings.owner || "";
  ghRepoInput.value = settings.repo || "";
  ghBranchInput.value = settings.branch || "main";
}

function getSettingsFromForm() {
  return {
    token: ghTokenInput.value.trim(),
    owner: ghOwnerInput.value.trim(),
    repo: ghRepoInput.value.trim(),
    branch: ghBranchInput.value.trim() || "main",
  };
}

function validateSettings(settings) {
  return Boolean(settings && settings.token && settings.owner && settings.repo && settings.branch);
}

function encodeRepoPath(path) {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

async function githubRequest(settings, path, options = {}) {
  const response = await fetch(`https://api.github.com/repos/${settings.owner}/${settings.repo}${path}`, {
    method: options.method || "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `token ${settings.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
    body: options.body || undefined,
  });
  return response;
}

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToUtf8(base64Text) {
  const cleaned = base64Text.replace(/\s+/g, "");
  const binary = atob(cleaned);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function getRepoFile(settings, filePath) {
  const encodedPath = encodeRepoPath(filePath);
  const response = await githubRequest(
    settings,
    `/contents/${encodedPath}?ref=${encodeURIComponent(settings.branch)}`
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Dosya okunamadı (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    sha: data.sha,
    path: data.path,
    contentBase64: data.content || "",
    contentText: data.content ? base64ToUtf8(data.content) : "",
  };
}

async function putRepoFile(settings, filePath, contentBase64, message, sha) {
  const encodedPath = encodeRepoPath(filePath);
  const payload = {
    message,
    branch: settings.branch,
    content: contentBase64,
  };

  if (sha) payload.sha = sha;

  const response = await githubRequest(settings, `/contents/${encodedPath}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Yazma hatası (${response.status}): ${errorText}`);
  }

  return response.json();
}

async function deleteRepoFile(settings, filePath, sha, message) {
  const encodedPath = encodeRepoPath(filePath);
  const response = await githubRequest(settings, `/contents/${encodedPath}`, {
    method: "DELETE",
    body: JSON.stringify({
      message,
      branch: settings.branch,
      sha,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Silme hatası (${response.status}): ${errorText}`);
  }

  return response.json();
}

function normalizeInfo(raw) {
  const normalized = raw && typeof raw === "object" ? raw : {};
  const items = Array.isArray(normalized.items) ? normalized.items : [];
  const overrides =
    normalized.overrides && typeof normalized.overrides === "object" && !Array.isArray(normalized.overrides)
      ? normalized.overrides
      : {};
  return {
    _docs: normalized._docs || "Bu dosya yönetim paneli tarafından güncellenir.",
    items,
    overrides,
  };
}

function safeFileName(name) {
  const dotIndex = name.lastIndexOf(".");
  const ext = dotIndex > -1 ? name.slice(dotIndex + 1).toLowerCase() : "webp";
  const base = (dotIndex > -1 ? name.slice(0, dotIndex) : name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

  const validExt = ["png", "jpg", "jpeg", "webp", "avif", "gif"].includes(ext) ? ext : "webp";
  const stamp = new Date().toISOString().slice(0, 10);
  return `${base || "gorsel"}-${stamp}.${validExt}`;
}

function renderItems(infoData) {
  const items = Array.isArray(infoData.items) ? infoData.items : [];
  itemsContainer.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Henüz panelden eklenmiş içerik yok.";
    itemsContainer.append(empty);
    return;
  }

  [...items].reverse().forEach((entry, reverseIndex) => {
    const realIndex = items.length - 1 - reverseIndex;
    const row = document.createElement("div");
    row.className = "item-row";

    const meta = document.createElement("div");
    meta.className = "item-meta";
    meta.innerHTML = `
      <p class="item-title">${entry.title || "Başlıksız"}</p>
      <p class="item-desc">${entry.description || "-"}</p>
      <span class="item-pill">${entry.category || "-"}</span>
      <span class="item-pill">${entry.file || "-"}</span>
    `;

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "ghost";
    editBtn.textContent = "Düzenle";
    editBtn.addEventListener("click", () => startEditItem(realIndex));

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "ghost";
    removeBtn.textContent = "Sil";
    removeBtn.addEventListener("click", () => removeItem(realIndex));

    actions.append(editBtn, removeBtn);
    row.append(meta, actions);
    itemsContainer.append(row);
  });
}

async function fetchInfoData(settings) {
  const file = await getRepoFile(settings, INFO_PATH);
  if (!file) return { info: normalizeInfo({}), sha: null };
  return { info: normalizeInfo(JSON.parse(file.contentText || "{}")), sha: file.sha };
}

async function saveInfoData(settings, infoData, currentSha, message) {
  const payload = `${JSON.stringify(infoData, null, 2)}\n`;
  const contentBase64 = utf8ToBase64(payload);
  const response = await putRepoFile(settings, INFO_PATH, contentBase64, message, currentSha || undefined);
  return response.content && response.content.sha ? response.content.sha : currentSha;
}

function requireAuth() {
  if (isAuthenticated) return true;
  setStatus(authStatus, "Önce giriş yapmalısın.", true);
  return false;
}

async function refreshItems() {
  if (!requireAuth()) return;
  const settings = readSettings();
  if (!validateSettings(settings)) {
    renderItems({ items: [] });
    return;
  }

  try {
    const { info } = await fetchInfoData(settings);
    cachedInfo = info;
    renderItems(info);
  } catch (error) {
    renderItems({ items: [] });
    setStatus(contentStatus, `Liste alınamadı: ${error.message}`, true);
  }
}

function resetContentFormMode() {
  editingItemIndex = null;
  editingOriginalFile = "";
  contentForm.reset();
  contentFileInput.required = true;
  publishBtn.textContent = "Yayınla";
  contentFormTitle.textContent = "2) Yeni İçerik Ekle";
  contentFormHint.textContent = "Yeni bir çalışma eklemek için formu doldur.";
  cancelEditBtn.classList.add("hidden");
}

function startEditItem(index) {
  const items = Array.isArray(cachedInfo.items) ? cachedInfo.items : [];
  const entry = items[index];
  if (!entry) return;

  editingItemIndex = index;
  editingOriginalFile = entry.file || "";

  contentTitleInput.value = entry.title || "";
  contentCategoryInput.value = entry.category || "illustrasyon";
  contentDescriptionInput.value = entry.description || "";
  contentRouteInput.value = entry.route || "";
  contentFileInput.value = "";
  contentFileInput.required = false;

  publishBtn.textContent = "Güncellemeyi Kaydet";
  contentFormTitle.textContent = "2) İçerik Düzenle";
  contentFormHint.textContent =
    "Dosya seçmezsen mevcut görsel korunur. Yeni dosya seçersen görsel güncellenir.";
  cancelEditBtn.classList.remove("hidden");

  setStatus(contentStatus, `"${entry.title || entry.file}" düzenleme modunda.`);
  contentForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function testConnection() {
  if (!requireAuth()) return;
  const settings = getSettingsFromForm();
  if (!validateSettings(settings)) {
    setStatus(settingsStatus, "Lütfen tüm ayar alanlarını doldur.", true);
    return;
  }

  setStatus(settingsStatus, "Bağlantı test ediliyor...");
  try {
    const response = await githubRequest(settings, "");
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`${response.status} ${text}`);
    }
    const repo = await response.json();
    setStatus(settingsStatus, `Bağlantı başarılı: ${repo.full_name}`);
  } catch (error) {
    setStatus(settingsStatus, `Bağlantı başarısız: ${error.message}`, true);
  }
}

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireAuth()) return;

  const settings = getSettingsFromForm();
  if (!validateSettings(settings)) {
    setStatus(settingsStatus, "Lütfen tüm ayar alanlarını doldur.", true);
    return;
  }

  writeSettings(settings);
  setStatus(settingsStatus, `Ayarlar kaydedildi (${maskToken(settings.token)})`);
  refreshItems();
});

testConnectionBtn.addEventListener("click", testConnection);

contentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireAuth()) return;

  const settings = readSettings();
  if (!validateSettings(settings)) {
    setStatus(contentStatus, "Önce üstteki bağlantı ayarlarını kaydet.", true);
    return;
  }

  const file = contentFileInput.files && contentFileInput.files[0];
  const title = contentTitleInput.value.trim();
  const category = contentCategoryInput.value;
  const description = contentDescriptionInput.value.trim();
  const route = contentRouteInput.value.trim();

  if (!title || !description) {
    setStatus(contentStatus, "Başlık ve açıklama zorunlu.", true);
    return;
  }

  if (editingItemIndex === null && !file) {
    setStatus(contentStatus, "Lütfen bir görsel seç.", true);
    return;
  }

  publishBtn.disabled = true;
  setStatus(contentStatus, editingItemIndex === null ? "Görsel yükleniyor..." : "Kayıt güncelleniyor...");

  try {
    const { info, sha } = await fetchInfoData(settings);
    const items = Array.isArray(info.items) ? [...info.items] : [];

    if (editingItemIndex === null) {
      const normalizedName = safeFileName(file.name);
      const filePath = `assets/resources/${normalizedName}`;
      const fileBuffer = await file.arrayBuffer();
      const fileBase64 = arrayBufferToBase64(fileBuffer);

      const existingImage = await getRepoFile(settings, filePath);
      await putRepoFile(
        settings,
        filePath,
        fileBase64,
        `Yeni görsel eklendi: ${normalizedName}`,
        existingImage ? existingImage.sha : undefined
      );

      items.push({
        file: normalizedName,
        title,
        category,
        description,
        ...(route ? { route } : {}),
      });

      const nextInfo = { ...info, items };
      await saveInfoData(settings, nextInfo, sha, `İçerik eklendi: ${title}`);
      cachedInfo = nextInfo;
      renderItems(nextInfo);
      resetContentFormMode();
      setStatus(contentStatus, "Başarıyla yayına alındı.");
      return;
    }

    const current = items[editingItemIndex];
    if (!current) throw new Error("Düzenlenecek kayıt bulunamadı.");

    let nextFileName = current.file || "";
    if (file) {
      const normalizedName = safeFileName(file.name);
      const filePath = `assets/resources/${normalizedName}`;
      const fileBuffer = await file.arrayBuffer();
      const fileBase64 = arrayBufferToBase64(fileBuffer);
      const existingImage = await getRepoFile(settings, filePath);

      await putRepoFile(
        settings,
        filePath,
        fileBase64,
        `Görsel güncellendi: ${normalizedName}`,
        existingImage ? existingImage.sha : undefined
      );
      nextFileName = normalizedName;
    }

    const updatedEntry = {
      ...current,
      file: nextFileName,
      title,
      category,
      description,
    };
    if (route) updatedEntry.route = route;
    else delete updatedEntry.route;

    items[editingItemIndex] = updatedEntry;

    const nextInfo = { ...info, items };
    await saveInfoData(settings, nextInfo, sha, `İçerik güncellendi: ${title}`);
    cachedInfo = nextInfo;
    renderItems(nextInfo);

    if (editingOriginalFile && nextFileName !== editingOriginalFile) {
      const shouldDeleteOld = confirm(
        "Yeni görsel yüklendi. Eski görsel dosyasını repodan da silmek ister misin?"
      );
      if (shouldDeleteOld) {
        const oldPath = `assets/resources/${editingOriginalFile}`;
        const oldFile = await getRepoFile(settings, oldPath);
        if (oldFile) {
          await deleteRepoFile(
            settings,
            oldPath,
            oldFile.sha,
            `Eski görsel silindi: ${editingOriginalFile}`
          );
        }
      }
    }

    resetContentFormMode();
    setStatus(contentStatus, "Kayıt güncellendi.");
  } catch (error) {
    setStatus(contentStatus, `İşlem hatası: ${error.message}`, true);
  } finally {
    publishBtn.disabled = false;
  }
});

cancelEditBtn.addEventListener("click", () => {
  resetContentFormMode();
  setStatus(contentStatus, "Düzenleme iptal edildi.");
});

async function removeItem(index) {
  if (!requireAuth()) return;
  const settings = readSettings();
  if (!validateSettings(settings)) {
    setStatus(contentStatus, "Önce bağlantı ayarlarını kaydet.", true);
    return;
  }

  const items = Array.isArray(cachedInfo.items) ? [...cachedInfo.items] : [];
  const target = items[index];
  if (!target) return;

  const approve = confirm(`"${target.title || target.file}" kaydını silmek istiyor musun?`);
  if (!approve) return;

  setStatus(contentStatus, "Kayıt siliniyor...");
  try {
    const { info, sha } = await fetchInfoData(settings);
    const currentItems = Array.isArray(info.items) ? [...info.items] : [];
    const currentTarget = currentItems[index];
    if (!currentTarget) throw new Error("Silinecek kayıt bulunamadı.");

    const nextItems = currentItems.filter((_, currentIndex) => currentIndex !== index);
    const nextInfo = { ...info, items: nextItems };
    await saveInfoData(
      settings,
      nextInfo,
      sha,
      `İçerik kaydı silindi: ${currentTarget.title || currentTarget.file}`
    );

    let fileDeleteMessage = "";
    const fileName = currentTarget.file || "";
    if (fileName) {
      const stillUsed = nextItems.some((entry) => entry.file === fileName);
      if (stillUsed) {
        fileDeleteMessage = " Görsel dosyası başka kayıtlarda kullanıldığı için korunuyor.";
      } else {
        const deleteFileToo = confirm("İlgili görsel dosyasını repodan da silmek ister misin?");
        if (deleteFileToo) {
          const filePath = `assets/resources/${fileName}`;
          const existingFile = await getRepoFile(settings, filePath);
          if (existingFile) {
            await deleteRepoFile(settings, filePath, existingFile.sha, `Görsel silindi: ${fileName}`);
            fileDeleteMessage = " Görsel dosyası da silindi.";
          }
        }
      }
    }

    cachedInfo = nextInfo;
    renderItems(nextInfo);
    if (editingItemIndex === index) resetContentFormMode();
    setStatus(contentStatus, `Kayıt silindi.${fileDeleteMessage}`);
  } catch (error) {
    setStatus(contentStatus, `Silme hatası: ${error.message}`, true);
  }
}

function readAuthProfile() {
  return readJsonStorage(AUTH_PROFILE_KEY);
}

function writeAuthProfile(profile) {
  writeJsonStorage(AUTH_PROFILE_KEY, profile);
}

function setAuthSession(active) {
  if (active) sessionStorage.setItem(AUTH_SESSION_KEY, "1");
  else sessionStorage.removeItem(AUTH_SESSION_KEY);
}

function hasAuthSession() {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === "1";
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(hashBuffer));
  return bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function setAuthMode(mode) {
  authMode = mode;
  if (mode === "setup") {
    authHint.textContent =
      "İlk kullanım: yönetim paneli için bir kullanıcı adı ve şifre oluştur.";
    authSubmitBtn.textContent = "Hesabı Oluştur";
    authPasswordConfirmWrap.classList.remove("hidden");
    authPasswordConfirmInput.required = true;
    authPasswordInput.autocomplete = "new-password";
    authUsernameInput.autocomplete = "username";
  } else {
    authHint.textContent = "Paneli açmak için kullanıcı adı ve şifreni gir.";
    authSubmitBtn.textContent = "Giriş Yap";
    authPasswordConfirmWrap.classList.add("hidden");
    authPasswordConfirmInput.required = false;
    authPasswordConfirmInput.value = "";
    authPasswordInput.autocomplete = "current-password";
    authUsernameInput.autocomplete = "username";
  }
}

function lockPanel() {
  isAuthenticated = false;
  adminPanel.classList.add("hidden");
  authCard.classList.remove("hidden");
}

async function unlockPanel() {
  isAuthenticated = true;
  authCard.classList.add("hidden");
  adminPanel.classList.remove("hidden");

  const savedSettings = readSettings();
  if (savedSettings) {
    fillSettingsForm(savedSettings);
    setStatus(settingsStatus, "Kayıtlı ayarlar yüklendi.");
  } else {
    setStatus(settingsStatus, "Önce bağlantı ayarlarını gir ve kaydet.");
  }

  resetContentFormMode();
  await refreshItems();
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = authUsernameInput.value.trim();
  const password = authPasswordInput.value;
  const passwordConfirm = authPasswordConfirmInput.value;

  if (username.length < 3) {
    setStatus(authStatus, "Kullanıcı adı en az 3 karakter olmalı.", true);
    return;
  }
  if (password.length < 6) {
    setStatus(authStatus, "Şifre en az 6 karakter olmalı.", true);
    return;
  }

  if (authMode === "setup") {
    if (password !== passwordConfirm) {
      setStatus(authStatus, "Şifreler eşleşmiyor.", true);
      return;
    }
    const passwordHash = await sha256(password);
    writeAuthProfile({ username, passwordHash });
    setAuthSession(true);
    setStatus(authStatus, "Hesap oluşturuldu. Panel açılıyor...");
    await unlockPanel();
    return;
  }

  const profile = readAuthProfile();
  if (!profile || !profile.username || !profile.passwordHash) {
    setAuthMode("setup");
    setStatus(authStatus, "Kayıtlı hesap bulunamadı. Önce yeni hesap oluştur.", true);
    return;
  }

  const hash = await sha256(password);
  if (username !== profile.username || hash !== profile.passwordHash) {
    setStatus(authStatus, "Kullanıcı adı veya şifre yanlış.", true);
    return;
  }

  setAuthSession(true);
  setStatus(authStatus, "Giriş başarılı. Panel açılıyor...");
  await unlockPanel();
});

logoutBtn.addEventListener("click", () => {
  setAuthSession(false);
  lockPanel();
  const hasProfile = Boolean(readAuthProfile());
  setAuthMode(hasProfile ? "login" : "setup");
  authForm.reset();
  setStatus(authStatus, "Çıkış yapıldı.");
});

(function init() {
  const profile = readAuthProfile();
  if (!profile) setAuthMode("setup");
  else setAuthMode("login");

  if (profile && hasAuthSession()) {
    unlockPanel();
  } else {
    lockPanel();
    if (profile) setStatus(authStatus, "Giriş yaparak devam et.");
    else setStatus(authStatus, "İlk kurulum: kullanıcı hesabı oluştur.");
  }
})();
