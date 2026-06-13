
# Machine - Cave 
![img](https://raw.githubusercontent.com/zams-putra/my-boot2root/refs/heads/main/cave/img.png)

# Attack Surfaces

## Reconnaissance
- Nmap scan → port 80 (HTTP), port 22 (SSH) terbuka
- Web enumeration → register/login page, roasting wall, admin panel
- Hint di roasting page: "admin always visiting this page silently"

## Web Application
- XSS Stored via dangerouslySetInnerHTML pada roasting wall (r.comment tidak disanitasi)
- Bot admin otomatis visit /roasting tiap 1 menit → cookie hijack via XSS
- Cookie admin didapat → akses admin panel sebagai admin
- LFI pada /api/admin/logs?file= (authenticated admin)
- LFI hardening bypass: ....// → residual ../ setelah ReplaceAll
- /etc/passwd leak → enumerate users (cave_man, tribe_leader)
- id_rsa leak via LFI → /home/cave_man/.ssh/id_rsa
- SSH passphrase cracking (ssh2john + john + rockyou → "teamo")

## Pivoting
- Login SSH as cave_man → discover port 6060 (localhost only)
- SSH local port forwarding: ssh -L 6060:127.0.0.1:6060
- Internal Drupal 7.57 → CVE-2018-7600 (Drupalgeddon2) unauthenticated RCE
- www-data shell → read settings.php → tribe_leader password leak

## Privilege Escalation
- Lateral move: www-data → tribe_leader (password reuse dari settings.php)
- SUID binary enum: find / -perm -u=s -type f
- /usr/local/bin/bash_suid dengan SUID bit + group tribe_leader
- bash_suid -p → root shell
# .

![img](../img/attack_chain/attack_chain7.svg)


# 1. Creds

![img](https://raw.githubusercontent.com/zams-putra/portfolio/refs/heads/main/public/img/cave.png)

### SSH :
- cave_man:cave123man
- tribe_leader:rahasiainimah (ini yang deket root)

# 2.  Foothold

## LFI

- set di hardening buat replace semua ../
```go
package handlers
import (
    "net/http"
    "os"
    "strings"
    "github.com/zams-putra/my-boot2root/cave/cave/server/internal/middlewares"
    "github.com/zams-putra/my-boot2root/cave/cave/server/internal/models"
)
var logDir = "logs/"
func SetLogDir(dir string) {
    logDir = dir
}
func AdminLogs(w http.ResponseWriter, r *http.Request) {
    claims, ok := r.Context().Value(middlewares.ClaimsKey).(*models.Claims)
    if !ok || !claims.IsAdmin {
        http.Error(w, "Forbidden lau sape mpruy", http.StatusForbidden)
        return
    }
    filename := r.URL.Query().Get("file")
    if filename == "" {
        filename = "app.log"
    }
    clean := strings.ReplaceAll(filename, "../", "")
    fullpath := logDir + clean
    content, err := os.ReadFile(fullpath)
    if err != nil {
        http.Error(w, "File not found", http.StatusNotFound)
        return
    }
    w.Header().Set("Content-Type", "text/plain")
    w.Write(content)
}
```
- especially here
```go
clean := strings.ReplaceAll(filename, "../", "")
fullpath := logDir + clean
```
- so kalo bypass with
```rb
....//....//....//....//....//etc/passwd
```
- doi masih tersisa ../
```lua
....//, di replace menjadi -> ../
- soalnya bagian ini di ilangin 
..[../]/ -> nah itu di cut kan menjadi ../
```
- untuk case ini hardening with
```go
clean := filepath.Clean(filename)
```
- untuk LFI nya sendiri itu vuln disini 
```go
fullpath := logDir + clean
```
- and for hardening, should be like this
```go
fullpath := filepath.Join(logDir, clean)
```


## XSS Steal Cookie

- di file roasting.jsx untuk page roasting emang di set vuln
```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import styles from './Roasting.module.css'


function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

  

function initials(name) {
  return name?.slice(0, 2).toUpperCase() || '??'
}


const AVATAR_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#2b2d42', '#3d405b', '#264653', '#2a9d8f'
]

function avatarColor(name) {
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

  

export default function Roasting() {
  const { user } = useAuth()
  const [roastings, setRoastings] = useState([])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const fetchRoastings = async () => {
    try {
      const data = await api.getRoastings()
      setRoastings(Array.isArray(data) ? data.reverse() : [])
    } catch {
      setError('Failed to load roastings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoastings()
    const interval = setInterval(fetchRoastings, 15000)
    return () => clearInterval(interval)
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitError('')
    setSubmitting(true)
    try {
      await api.addRoasting(comment)
      setComment('')
      await fetchRoastings()
    } catch (err) {
      setSubmitError(err.message || 'Failed to post')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Roasting Wall</h1>
          <p className={styles.sub}>
            {roastings.length} roast{roastings.length !== 1 ? 's' : ''} and counting
          </p>
          <p className={styles.sub}>
            Note: admin always visiting this page silently 😜
          </p>
        </div>
        {user ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div
                className={styles.formAvatar}
                style={{ background: avatarColor(user.username) }}
              >
                {initials(user.username)}
              </div>
              <div className={styles.formRight}>
                <textarea
                  className={styles.textarea}
                  placeholder="Drop your roast here..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
                <div className={styles.formFooter}>
                  <span className={styles.charCount}>{comment.length}/500</span>
                  {submitError && <span className={styles.submitError}>{submitError}</span>}
                  <button
                    type="submit"
                    className={styles.postBtn}
                    disabled={submitting || !comment.trim()}
                  >
                    {submitting ? 'Posting...' : 'Post Roast'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className={styles.loginPrompt}>
            <Link to="/login" className={styles.loginLink}>Sign in</Link> to drop a roast
          </div>
        )}
        <div className={styles.feed}>
          {loading ? (
            <div className={styles.empty}>Loading...</div>
          ) : error ? (
            <div className={styles.empty}>{error}</div>
          ) : roastings.length === 0 ? (
            <div className={styles.empty}>No roasts yet. Be the first.</div>
          ) : (
            roastings.map(r => (
              <div key={r.id} className={styles.item}>
                <div
                  className={styles.itemAvatar}
                  style={{ background: avatarColor(r.roaster) }}
                >
                  {initials(r.roaster)}
                </div>
                <div className={styles.itemBody}>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemUser}>{r.roaster}</span>
                    <span className={styles.itemTime}>{timeAgo(r.created_at)}</span>
                  </div>
                  <p
                    className={styles.itemText}
                    dangerouslySetInnerHTML={{ __html: r.comment }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```
- especially in here
```jsx
<p
	className={styles.itemText}
	dangerouslySetInnerHTML={{ __html: r.comment }}
/>
```
- kalau doi pakai ini mah aman cuk harusnya
```jsx
<p>{r.comment}</p>
```
- anyway kenapa bisa ada admin yang dateng ke page yg vuln xss
- itu dateng dari bot, visiting localhost:80  path roasting, 1 menit sekali kalau ga salah




# 3. Services

## HTTP

### Frontend

- build frontend vite nya
```bash
npm run build
[zip file distnya lewat file explorer]
python -m http.server
```
- get filenya dari mesin ubuntu
```bash
wget [ip]:8000/frontend.zip
```

- download unzip buat unzip code webnya
```bash
sudo apt install unzip
```
- download apache2 buat deploy frontend
```bash
sudo apt install apache2
```

- pindahin file frontend nya
```bash
unzip frontend.zip
sudo cp -r dist/ /var/www/cave
```
- config apache2 for /var/www/cave 
```rb
sudo nano /etc/apache2/sites-available/cave.conf

--------------------------- di isi
<VirtualHost *:80>
    ServerName 127.0.0.1
    DocumentRoot /var/www/cave

    ProxyPass /api http://127.0.0.1:8080/api
    ProxyPassReverse /api http://127.0.0.1:8080/api

    <Directory /var/www/cave>
        Options -Indexes
        AllowOverride All
        Require all granted
        RewriteEngine On
        RewriteBase /
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^ index.html [L]
    </Directory>
</VirtualHost>
```
- restart apache2 and reconf apache2 config
```bash
sudo a2enmod rewrite proxy proxy_http
sudo a2ensite cave.conf
sudo a2dissite 000-default.conf
sudo systemctl restart apache2
```
- open web frontend nya di device attacker
```bash
curl http://ip
```


### Backend
- build go server nya dengan os linux and arch amd64
- soalnya ini build nya di windows
```bash
$env:GOOS="linux"; $env:GOARCH="amd64"; go build -o cave_server ./cmd/app/
```
- nyalain python server buat dikirim ke ubuntu
```bash
python -m http.server
```
- wget file binary server nya, and file db nya
```bash
wget ip:8000/cave_server
wget ip:8000/data.db
```
- hosting backend biar bisa run terus
```bash
sudo nano /etc/systemd/system/cave.service
```
- isi config service nya begini
```bash
[Unit]
Description=Cave Web Service
After=network.target

[Service]
Type=simple
User=cave_man # ini bisa di isi sesuai run as siapa
WorkingDirectory=/home/cave_man
EnvironmentFile=/home/cave_man/.env
ExecStart=/home/cave_man/cave_server
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```
- enable service and start
```bash
sudo systemctl daemon-reload
sudo systemctl enable cave
sudo systemctl start cave
sudo systemctl status cave
```

### Error
- sqlite3 error btw
```ruby
Binary was compiled with 'CGO_ENABLED=0', go-sqlite3 requires cgo to work
```
- so i changed my config.go from this
```go
package configs  

import (
    "database/sql"
    "log"
    _ "github.com/mattn/go-sqlite3"
)

func InitDB() *sql.DB {
    db, err := sql.Open("sqlite3", "./data.db")
    if err != nil {
        log.Fatal(err)
    }
    return db
}
```

- to this
```go
package configs

import (
    "database/sql"
    "log"
    _ "modernc.org/sqlite"
)

  

func InitDB() *sql.DB {
    db, err := sql.Open("sqlite", "./data.db")
    if err != nil {
        log.Fatal(err)
    }
    return db
}
```

### Error
- bot chrome error soalnya gada aplikasi chrome di ubuntu server
```txt
2026/04/21 12:24:30 [bot] admin visiting comment page 
2026/04/21 12:24:30 [bot] Error adalah: exec: "google-chrome": executable file not found in $PATH
```
- jadi download and install dulu aja
```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb

```


## Error
- ini jwt masih bisa di forge anyway
- kalau gini situasinya xss steal cookie gabisa berlaku
- attacker tinggal gonta ganti octat ke 2 dari jwt token
```json
{"id":1,"username":"smithman","isAdmin":false,"exp":1777002454,"iat":1776916054}

// set ke

{"id":1,"username":"smithman","isAdmin":true,"exp":1777002454,"iat":1776916054}

// then encode base64 and replace

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[replace output in here].EAlfQ6pTT_0fwNaxOWsh2QHQ8XwQ_AUAaLB4vzzhvDU

// done jadi admin sekarang gaperlu xss xss an
```
- ternyata masalah ada di auth_middleware.go
```go
type contextkey string
const ClaimsKey contextkey = "claims"
type AuthResponse struct {
    Messages string `json:"messages"`
    Token    string `json:"token,omitempty"`
}

func AuthMiddleware(jwtsecret string, next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        cookie, err := r.Cookie("kuki")
        if err != nil {
            helper.WriteJSON(w, http.StatusUnauthorized, AuthResponse{
                Messages: "Unauthorized gabole masuk",
            })
            return
        }
        claims := &models.Claims{}
        token, err := jwt.ParseWithClaims(cookie.Value, claims, func(t *jwt.Token) (any, error) {
            return []byte(jwtsecret), nil
        })
        if err != nil || !token.Valid {
            helper.WriteJSON(w, http.StatusUnauthorized, AuthResponse{
                Messages: "Unauthorized gabole masuk",
            })
            return
        }
        ctx := context.WithValue(r.Context(), ClaimsKey, claims)
        next(w, r.WithContext(ctx))
    }
}[]byte(jwtsecret), nil
})
```
- especially in here, change from this
```go
token, err := jwt.ParseWithClaims(cookie.Value, claims, func(t *jwt.Token) (any, error) {
	return []byte(jwtsecret), nil
})
```
- to this

```go
token, err := jwt.ParseWithClaims(cookie.Value, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(jwtsecret), nil
	})
```
- lalu di main.go tambahin endpoint baru
```go
mux.HandleFunc("GET /api/me", middlewares.AuthMiddleware(jwtSecret, func(w http.ResponseWriter, r *http.Request) { claims := r.Context().Value(middlewares.ClaimsKey).(*models.Claims) helper.WriteJSON(w, http.StatusOK, claims) }))
```
- lalu di frontend, lib/auth.jsx
```jsx
import { createContext, useContext, useState, useEffect } from 'react'
const AuthCtx = createContext(null)
function parseJWT(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(claims => { if (claims) setUser(claims) })
      .catch(() => {})
  }, [])
  const login = (claims) => setUser(claims)
  const logout = () => {
    document.cookie = 'kuki=; Max-Age=0; path=/'
    setUser(null)
  }
  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
```
- login.jsx
```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import styles from './Auth.module.css'
export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    await api.login(form.username, form.password)
    const res = await fetch('/api/me', { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to get user')
    const user = await res.json()
    login(user)
    navigate('/roasting')
  } catch (err) {
    setError(err.message || 'Login failed')
  } finally {
    setLoading(false)
  }
}
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Sign in</h1>
          <p className={styles.sub}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.link}>Register</Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              placeholder="your_username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoComplete="username"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <div className={styles.error}>{error}</div>
          )}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>
      </div>
    </div>
  )
}
```


### Attack with
- awalan login register dulu
- next cari xss, nanti steal cookie soalnya baca di webnya tulisannya begini
```rb
admin web ini rutin bakal datengin page ini lah pokoknya mah
```
- jadi bisa inject xss steal cookie admin
- daoet cookie  admin, ganti cookie nya dah jadi admin
- ada page khusus admin yang vuln lfi
- lfi dah di hardening biar ga vuln sama ../ doang, bypass with ....//
- next cari /etc/passwd, biar tau usernya siapa aja
- cek2 id_rsa di user2 tersebut, dan cobalah login with id_rsa
- kudu crack juga nanti buat dapetin passphrase


## SSH

- setup id_rsa to ssh
### generate ssh key with passphrase
- setup nya user yang sekarang yaitu cave_man
```bash
sudo -u cave_man ssh-keygen -t rsa -b 2048 -f /home/cave_man/.ssh/id_rsa
```
- setup passphrasenya pake pass yang ada di rockyou biar bisa di crack
```bash
sed -n '69p' /usr/share/wordlists/rockyou.txt

[output: teamo]
```
### Enable ssh login with key
- biar bisa langsung connect kalau udah masukin phrase
- tanpa password gitulah ya
```bash
sudo -u cave_man bash -c 'cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys'
sudo -u cave_man chmod 600 ~/.ssh/authorized_keys
```

### Attack with
- crack pass nanti kalau dah dapet id_rsa dari lfi
```bash
ssh2john id_rsa > id_rsa.hash 
john id_rsa.hash --wordlist=/usr/share/wordlists/rockyou.txt
```
- login with id_rsa and passphrase
```bash
chmod 600 id_rsa
ssh -i id_rsa cave_user@[ip]
```




# 4.  Pivoting

- buat user 2 nya, yang run web ke 2 buat pivoting nantinya
```bash
sudo useradd -m tribe_leader
```
- set password buat user barusan
```bash
sudo passwd tribe_leader # set: rahasiainimah
```
- biar user barusan bisa sudo 
```bash
sudo usermod -aG sudo tribe_leader
```
- biar usernya masuk bash, daripada sh kan ya
```bash
cat /etc/passwd | grep tribe
# cek apakah si tribe masuk shell bash atau sh
```

### Turunin Priv user 1
- biar gabisa sudo dia user 1 nya
```bash
groups cave_man
sudo deluser cave_man sudo
```

## Services HTTP Pivoting 
- disini pake cms aja

### CVE-2018-7600 (Drupalgeddon2) — RCE unauthenticated
- install deps
```bash
sudo apt install apache2 php php-mysql php-xml php-gd php-curl php-mbstring php-zip mysql-server -y
```
- setup db
```bash
sudo mysql -u root
```
- made db
```sql
CREATE DATABASE drupal;
CREATE USER 'drupal'@'localhost' IDENTIFIED BY 'drupalpass';
GRANT ALL PRIVILEGES ON drupal.* TO 'drupal'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
- download drupal and setting
```bash
cd /var/www
sudo wget https://ftp.drupal.org/files/projects/drupal-7.57.tar.gz
sudo tar -xzf drupal-7.57.tar.gz
```
- ganti nama, config drupal biar dipegang ama si tribe_leader
```bash
sudo mv drupal-7.57 internal
sudo chown -R www-data:www-data /var/www/internal
```
- setup file config apache conf buat service web yang ini
```bash
sudo nano /etc/apache2/sites-available/internal.conf
```
- setup begini
```go
<VirtualHost 127.0.0.1:6060>
    ServerName internal.cave.local
    DocumentRoot /var/www/internal

    <Directory /var/www/internal>
        Options -Indexes
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/internal_error.log
    CustomLog ${APACHE_LOG_DIR}/internal_access.log combined
</VirtualHost>
```
- setup port ke local
```bash
sudo nano /etc/apache2/ports.conf
```
- tambahin ini
```bash
Listen 127.0.0.1:6060
```
- begini kira kira
```bash
root@nolep:/var/www# cat /etc/apache2/ports.conf
# If you just change the port or add more ports here, you will likely also
# have to change the VirtualHost statement in
# /etc/apache2/sites-enabled/000-default.conf

Listen 80
Listen 127.0.0.1:6060

<IfModule ssl_module>
        Listen 443
</IfModule>

<IfModule mod_gnutls.c>
        Listen 443
</IfModule>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet

```
- enable site nya
```bash
sudo a2enmod rewrite
sudo a2ensite internal.conf
sudo systemctl restart apache2
```
- buka webnya pake ssh local port forwarding
- di mesin lain, misal kali linux attacker
```bash
ssh -L 6060:127.0.0.1:6060 cave_man@[ip_ubuntu_server]
```
- di browser attacker buka aja 127.0.0.1:6060

### Setup CMS di browser
- nanti setup aja begini
```rb
- Choose profile: pilih standard
- Choose language: english built in
```
- di bagian verify requirements nya belum centang semua, err disini
```txt
|Web server|Apache/2.4.29 (Ubuntu)|
|OK|PHP|7.2.24-0ubuntu0.18.04.17|
|OK|PHP register globals|Disabled|
|OK|PHP extensions|Enabled|
|OK|Database support|Enabled|
|OK|PHP memory limit|128M|


|Error|File system||
|The directory _sites/default/files_ does not exist. An automated attempt to create this directory failed, possibly due to a permissions problem. To proceed with the installation, either create the directory and modify its permissions manually or ensure that the installer has the permissions to create it automatically. For more information, see INSTALL.txt or the [online handbook](http://drupal.org/server-permissions).|   |   |

|OK|Unicode library|PHP Mbstring Extension|


|Error|Settings file|The settings file does not exist.|
|The Drupal installer requires that you create a settings file as part of the installation process. Copy the _./sites/default/default.settings.php_ file to _./sites/default/settings.php_. More details about installing Drupal are available in [INSTALL.txt](http://127.0.0.1:6060/INSTALL.txt).|   |   |
```
- solve with :
```bash
sudo mkdir -p /var/www/internal/sites/default/files
sudo chown www-data:www-data /var/www/internal/sites/default/files
sudo chmod 755 /var/www/internal/sites/default/files
```
- dan ini :
```bash
sudo cp /var/www/internal/sites/default/default.settings.php /var/www/internal/sites/default/settings.php

sudo chown www-data:www-data /var/www/internal/sites/default/settings.php
sudo chmod 666 /var/www/internal/sites/default/settings.php
```
- next lanjut config
```rb
- Set up database:
  
	Database name: drupal
	Database username: drupal
	Database password: drupalpass
	Host: localhost
	Port: 3306
- Install profile: ditunggu aja
- Configure site:
	Site name: Internal Cave Portal
	Site e-mail: admin@cave.local
	Username: admin
	E-mail: admin@cave.local
	Password: admin2026!
	Confirm password: admin2026!
```
- done, cek di browser 127.0.0.1:6060


## Test exploit
- udah ssh -L ke target, and check webnya
- lanjut exploit pakai msf
```bash
msfconsole
search CVE-2018-7600
set set aja
exploit
```
- nah ternyata ada error, as www-data kita bisa masuk folder home user2 disitu
```bash
ls -la /home
drwxr-xr-x  8 cave_man     cave_man     4096 May  3 11:50 cave_man
drwxr-xr-x  2 tribe_leader tribe_leader 4096 Apr 24 14:55 tribe_leader
```
- nah dia begini makanya bisa di read
```bash
drwxr-xr-x 
```
- set permission aja 
```bash
chmod 700 /home/cave_man
chmod 700 /home/tribe_leader

drwx------  8 cave_man     cave_man     4096 May  3 11:50 cave_man
drwx------  2 tribe_leader tribe_leader 4096 Apr 24 14:55 tribe_leader

```

### Setup permission
- kan doi jadi www-data ya after exploit tuh
- kira2 gimana ya setup privesc www-data ke tribe_leader
- baca config di ini aja nanti attackernya
```bash
cat /var/www/internal/sites/default/settings.php | grep password
```
- sengaja kasih comment ke creds disitu buat password asli nya
- tapi root gabisa edit permission nya gini
```bash
root@nolep:/home/cave_man ls -la  /var/www/internal/sites/default/settings.php
-r--r--r-- 1 www-data www-data 26559 May  2 16:12 /var/www/internal/sites/default/settings.php
```
- yauda edit dulu 
```bash
chmod 644 /var/www/internal/sites/default/settings.php 
vim /var/www/internal/sites/default/settings.php
```
- kasih beginian 
```php
$databases = array (
  'default' =>
  array (
    'default' =>
    array (
      'database' => 'drupal',
      'username' => 'drupal',
      # 'password' => 'rahasiainimah',
      'password' => 'drupalpass',
      'host' => 'localhost',
      'port' => '3306',
      'driver' => 'mysql',
      'prefix' => '',
    ),
  ),
);

```
- balikin biar readonly
```bash
chmod 444 /var/www/internal/sites/default/settings.php

root@nolep:/home/cave_man ls -la  /var/www/internal/sites/default/settings.php
-r--r--r-- 1 www-data www-data 26598 May  3 12:19 /var/www/internal/sites/default/settings.php

```
- isolasi path /var/www/internal biar gabisa di akses cave_man
```bash
sudo chmod 750 /var/www/internal
```

## Privilege Escalation

### SUID binary
- setup dulu begini 
- sudo su ke root dulu as root aja run nya
```bash
cp /bin/bash /usr/local/bin/bash_suid
chown root:root /usr/local/bin/bash_suid
chmod u+s /usr/local/bin/bash_suid

ls -la /usr/local/bin/bash_suid
```
- error, bisa di run as cave_man jir,  harusnya bisa as tribe_leader aja
- gini in aja
```bash
chown root:tribe_leader /usr/local/bin/bash_suid
chmod 4750 /usr/local/bin/bash_suid

ls -la /usr/local/bin/bash_suid
```
- nanti attacker enum gini as tribe_leader
```bash
find / -perm -u=s -type f 2>/dev/null
```
- nice tinggal turunin tribe_leader biar gabisa sudo su
```bash
sudo deluser tribe_leader sudo
```



# 5. Specs and Detail VM

## Name :
- ubuntu-18.04.6-live-server-amd64
## Spek :

- ram: 1024mb
- cpu: 1core
- memory: 10,59 GB

## Flags :
- user.txt: FLAG{a323e8117e4fffd8f9c7db240eebf9ea}
- root.txt: FLAG{6147e882471ffb950f0520bc028ca2c8}

## walkthrough - video

- https://youtu.be/YJdd1gI92lk

## Repository
- https://github.com/zams-putra/my-boot2root/tree/main/cave