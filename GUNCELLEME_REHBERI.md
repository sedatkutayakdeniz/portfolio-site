# En Basit Kullanım (Yönetim Paneli)

Artık dosya/JSON düzenlemene gerek yok.

## Link

- Yönetim paneli: `https://senin-domainin.com/admin.html`

## İlk Kurulum (1 Kez)

### A) Panel Hesabı Oluştur

Panel ilk açıldığında senden kullanıcı adı + şifre ister.
Bu bilgileri girip `Hesabı Oluştur` dersen panel kilidi açılır.

Sonraki girişlerde aynı kullanıcı adı/şifre ile `Giriş Yap` kullanırsın.

### B) GitHub Bağlantısı

Panelde şu 4 alanı doldur:

1. GitHub Token
2. GitHub Kullanıcı/Organizasyon
3. Repo Adı
4. Branch (`main`)

Sonra `Ayarları Kaydet` ve `Bağlantıyı Test Et`.

## İçerik Ekleme (Her Seferinde)

1. Görsel dosyasını seç.
2. Başlık yaz.
3. Kategori seç.
4. Açıklama yaz.
5. `Yayınla` butonuna bas.

Bitti. Panel:

- görseli repoya yükler (`assets/resources`)
- kaydını otomatik olarak `assets/resources/info.json` içine yazar
- siteye yansıtır

## İçerik Düzenleme / Silme

- `Mevcut Eklenen İçerikler` listesinde:
  - `Düzenle` -> kayıt formuna gelir, düzenleyip kaydedersin.
  - `Sil` -> kayıt silinir, istersen görsel dosyası da repodan silinir.

## GitHub Token Nasıl Olmalı?

- Fine-grained Personal Access Token
- Repo erişimi: sadece bu site reposu
- Permission: `Contents` -> `Read and Write`

## Not

- `Mevcut Eklenen İçerikler` bölümündeki `Kayıdı Kaldır` butonu sadece info kaydını kaldırır.
- Görsel dosyası repoda kalır (istersen sonra manuel silebilirsin).
