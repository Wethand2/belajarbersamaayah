# 🚀 Petualangan Perkalian

Web app belajar perkalian 1–10 berbasis kurikulum 5 fase (CRA → hapalan strategis dengan spaced repetition Leitner).
**Stack:** GitHub Pages (frontend statis) · Google Apps Script (backend GET-only) · Google Sheets (database).

Aplikasi **offline-first**: seluruh permainan berjalan tanpa internet; Google Sheets hanya untuk backup progres & dashboard orang tua (opsional).

## Struktur

```
index.html          SPA shell
css/style.css       Desain (mobile-first, ramah anak)
js/
  config.js         ← isi WEBAPP_URL di sini (opsional)
  state.js          state manager + localStorage + aturan mastery
  leitner.js        mesin spaced repetition 5 kotak
  generator.js      generator soal Fase 2, 3, 5
  render.js         visual: array, kelompok emoji, garis bilangan, heatmap
  screens.js        peta, misi konkret, mesin sesi soal
  screens2.js       Fase 4 (Leitner), Fase 5, dashboard ortu, sertifikat
  sync.js           antrean sinkronisasi GET + chunking
  app.js            router
data/               kurikulum, 49 kartu + strategi, misi, soal cerita
apps-script/Code.gs backend (tempel ke Apps Script)
```

## Cara Deploy

### 1. Frontend (GitHub Pages)
1. Buat repo baru (mis. `petualangan-perkalian`), upload seluruh isi folder ini.
2. Settings → Pages → Source: `Deploy from a branch` → branch `main`, folder `/ (root)`.
3. Buka `https://<username>.github.io/petualangan-perkalian/` — aplikasi langsung jalan (mode offline).

> Untuk mencoba di komputer, cukup buka `index.html` di browser — tidak perlu server.

### 2. Backend (opsional — untuk backup & dashboard)
1. Buat Google Spreadsheet baru → salin **ID**-nya.
2. Extensions → **Apps Script** → tempel isi `apps-script/Code.gs`.
3. Project Settings → **Script properties** → tambah `SPREADSHEET_ID` = ID tadi.
4. Jalankan fungsi `setupSheets()` sekali (tombol Run) → 5 sheet dibuat otomatis.
5. **Deploy → New deployment → Web app**: Execute as **Me**, Who has access **Anyone** → salin URL `/exec`.
6. Tempel URL ke `js/config.js` → `WEBAPP_URL`, commit & push.

Uji: buka `URL/exec?action=ping` di browser → harus muncul `{"ok":true,...}`.

> **Catatan re-deploy:** kalau kode Apps Script diubah, gunakan *Manage deployments → Edit → Version: New* agar URL tidak berubah.

## Aturan Belajar Penting

- **Mastery:** level lulus jika ≥90% benar pada **2 sesi di hari berbeda** (sengaja — memastikan ingatan menetap, bukan hoki).
- **Mode Uji Coba** (dashboard Orang Tua): cukup 1 sesi per level, untuk mencoba seluruh alur aplikasi. Matikan saat anak belajar sungguhan.
- **Leitner:** benar → kartu naik kotak (interval 0/1/3/7/14 hari); salah → kembali ke Kotak 1 + strategi ditampilkan.
- Fase 1 dikerjakan dengan **benda nyata** didampingi orang tua; website hanya memandu dan mencatat.

## Privasi

Tidak ada data pribadi selain nama panggilan anak. Semua data tersimpan di perangkat (localStorage) dan di spreadsheet milik keluarga sendiri. Tanpa analytics pihak ketiga.
