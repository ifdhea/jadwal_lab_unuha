# Panduan Deployment Laravel + React di CyberPanel

## 🚀 Langkah-Langkah Deployment

### 1. Persiapan File Lokal

```bash
# Build production assets
npm install
npm run build

# Install composer dependencies
composer install --optimize-autoloader --no-dev
```

### 2. Upload File ke Server

**Struktur Upload:**
```
/home/username/public_html/           ← Root project Laravel
/home/username/public_html/public_html/  ← Isi folder public/
```

**File yang harus diupload:**
- Semua folder: app, bootstrap, config, database, resources, routes, storage, vendor
- File: .env, artisan, composer.json, composer.lock, package.json
- Isi folder `public/` → upload ke `/home/username/public_html/public_html/`

### 3. Konfigurasi di CyberPanel

#### A. Set Document Root
1. Login CyberPanel
2. Websites → List Websites
3. Pilih domain Anda → Modify
4. **Document Root:** `/home/username/public_html/public_html`
5. Save

#### B. Konfigurasi PHP
1. PHP → Setup PHP
2. Pastikan PHP version ≥ 8.2
3. Enable extensions: pdo, mbstring, openssl, tokenizer, xml, ctype, json, bcmath

### 4. Konfigurasi File di Server (via SSH/Terminal)

```bash
# Masuk ke direktori project
cd /home/username/public_html

# Set permissions
chmod -R 755 storage bootstrap/cache
chown -R username:username storage bootstrap/cache

# Install dependencies (jika belum)
composer install --optimize-autoloader --no-dev
php artisan optimize

# Konfigurasi Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Migrate database
php artisan migrate --force

# Link storage
php artisan storage:link
```

### 5. File .env untuk Production

Edit `/home/username/public_html/.env`:

```env
APP_NAME="Jadwal Lab"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# Cache & Queue
CACHE_STORE=file
QUEUE_CONNECTION=database
SESSION_DRIVER=file

# Filesystem
FILESYSTEM_DISK=public

# Mail (sesuaikan dengan SMTP Anda)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### 6. Update index.php

Edit `/home/username/public_html/public_html/index.php`:

Ganti path pada line:
```php
require __DIR__.'/../bootstrap/app.php';
```

Pastikan path mengarah ke root project dengan benar.

### 7. File .htaccess

Pastikan file `/home/username/public_html/public_html/.htaccess` ada dan berisi:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Handle Front Controller
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

## 🔧 Troubleshooting

### Error 404 Not Found
✅ **Solusi:**
- Pastikan Document Root = `/home/username/public_html/public_html`
- Cek file `index.php` dan `.htaccess` ada di document root
- Aktifkan mod_rewrite di Apache

### Error 500
✅ **Solusi:**
```bash
chmod -R 755 storage bootstrap/cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### CSS/JS tidak load
✅ **Solusi:**
- Cek folder `build/` ada di `public_html/`
- Pastikan APP_URL di .env sesuai domain
- Run: `php artisan storage:link`

### Database Connection Error
✅ **Solusi:**
- Cek kredensial database di .env
- Pastikan database sudah dibuat di CyberPanel → Databases
- Test koneksi: `php artisan migrate`

## 📝 Checklist Deployment

- [ ] Upload semua file ke `/home/username/public_html/`
- [ ] Upload isi folder public ke `/home/username/public_html/public_html/`
- [ ] Set Document Root ke `public_html/`
- [ ] Konfigurasi .env dengan data production
- [ ] Set permissions: `chmod -R 755 storage bootstrap/cache`
- [ ] Run: `composer install --no-dev`
- [ ] Run: `php artisan key:generate` (jika APP_KEY kosong)
- [ ] Run: `php artisan migrate --force`
- [ ] Run: `php artisan optimize`
- [ ] Run: `php artisan storage:link`
- [ ] Test website di browser

## 🔐 Security Checklist

- [ ] APP_DEBUG=false di production
- [ ] APP_ENV=production
- [ ] Semua credentials aman di .env
- [ ] File .env tidak accessible dari browser
- [ ] Permissions storage & cache sudah benar

## 📞 Perintah Berguna

```bash
# Clear all cache
php artisan optimize:clear

# Rebuild cache
php artisan optimize

# Cek route list
php artisan route:list

# Cek konfigurasi
php artisan config:show

# Maintenance mode
php artisan down
php artisan up
```
