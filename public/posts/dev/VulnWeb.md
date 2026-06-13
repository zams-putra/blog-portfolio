# Intro
- jadi disini mau buat docs beberapa vuln web
- mulai dari cara buat, sama cara attacknya
- sama cara hardening nya

# SQL Injection
- kita buat ini dulu aja pakai php ama go, mungkin ama js nanti


## SQLI - Login Bypass
- firstly bikin db dulu, disini pakai laragon kebetulan
- so open terminalnya aja and login mysql, make sure nyala itu mysql
```bash
mysql -u root -p 
[enter]
```
- we create DB and table first, insert dummy data also
```sql
CREATE DATABASE vuln;
USE vuln;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, password) VALUES
('atmin', 'batagor123'),
('atmin2', 'batagor321');
```
- done, lets check our data first
```bash
mysql> show tables;
mysql> select * from users;
```
### PHP - Built SQLI login labs
- aight, data nya ada next kita bikin webnya
- as always, we made 'koneksi.php' seperti para lambo enjoyer lainnya
```php
<!-- koneksi.php -->
<?php
$host = 'localhost';
$db = 'vuln';
$uname = 'root';
$pass = '';
mysqli_report(MYSQLI_REPORT_OFF); // biar gada err message yang panjang kalo pas inject2 pelod
$conn = mysqli_connect($host, $uname, $pass, $db);
if(!$conn) {
    die("Failed to connect cuy: " . mysqli_connect_error());
}
?>
```
- next we made login.php, make it index.php instead buat page yg vuln sqli nya
```php
<!-- index.php -->
<?php 
session_start();
if(isset($_SESSION['user'])) { // kalo ada session gausa login lagi
    header('Location: dashboard.php');
    exit;
}
$error = '';
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    require 'koneksi.php';
    $uname = $_POST['username'];
    $pass = $_POST['password'];
    $q = "SELECT * FROM users WHERE username = '$uname' AND password = '$pass'";
    $result = mysqli_query($conn, $q);
    if($result && mysqli_num_rows($result) > 0){
        $user = mysqli_fetch_assoc($result);
        $_SESSION['user'] = $user['username']; // set value session user ke username nya si user coy
        header('Location: dashboard.php');
        exit;
    } else {
        $error = "Invalid username or password.";
    }
}
?>
```
- di atas logic login nya btw, next we made html nya also dibawahnya aja
```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Batagor</title>
</head>
<body>
    <h1>Login kang</h1>
    <form method="POST" action="">
        <label>Username</label>
        <input
            type="text"
            name="username"
            placeholder="admin"
            autocomplete="off"
            value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>"
        />

        <label>Password</label>
        <input
            type="password"
            name="password"
            placeholder="••••••••"
        />
        <button type="submit">logon</button>
    </form>

        <?php if ($error): ?>
            <div class="error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
</body>
</html>
```
- then dashboard.php
```php
<?php
session_start();
if(!isset($_SESSION['user'])) { // biar balik ke login kalo gada session user lau sape
    header('Location: index.php');
    exit;
}
$uname = $_SESSION['user'];
if(isset($_GET['logout'])) { // buat logout
    session_destroy();
    header('Location: index.php');
    exit;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
</head>
<body>
    <h1>Welcome home <?= htmlspecialchars($uname); ?> </h1>
    <p>Lau dah login cuy</p>
    <a href="dashboard.php?logout=1">Logout</a>
</body>
</html>
```
- worked payload 
```bash
1:
username: ' or 1=1--
pass: ' or 1=1--

2:
username: ' or 1=1-- -
pass: [kosongin aja]

```
### PHP - Hardening SQLI login labs
- so login logic tadi begini kan yak
```php
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    require 'koneksi.php';
    $uname = $_POST['username'];
    $pass = $_POST['password'];
    $q = "SELECT * FROM users WHERE username = '$uname' AND password = '$pass'";
    $result = mysqli_query($conn, $q);
    if($result && mysqli_num_rows($result) > 0){
        $user = mysqli_fetch_assoc($result);
        $_SESSION['user'] = $user['username']; // set value session user ke username nya si user coy
        header('Location: dashboard.php');
        exit;
    } else {
        $error = "Invalid username or password.";
    }
}
```
- kita hardening pakai prepare statement
```php
    $stmt = $conn -> prepare("SELECT * FROM users WHERE username = ? AND password = ?");
    $stmt -> bind_param("ss", $uname, $pass); // ss = string string
    $stmt -> execute();
    $result = $stmt -> get_result();
```
- mengingatkanku dengan ORM anyway
- yangg udah di hardening jadi begini
```php
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    require 'koneksi.php';
    $uname = $_POST['username'];
    $pass = $_POST['password'];
    // $q = "SELECT * FROM users WHERE username = '$uname' AND password = '$pass'";
    // $result = mysqli_query($conn, $q);
    $stmt = $conn -> prepare("SELECT * FROM users WHERE username = ? AND password = ?");
    $stmt -> bind_param("ss", $uname, $pass); // ss = string string
    $stmt -> execute();
    $result = $stmt -> get_result();

    if($result && mysqli_num_rows($result) > 0){
        $user = mysqli_fetch_assoc($result);
        $_SESSION['user'] = $user['username']; // set value session user ke username nya si user coy
        header('Location: dashboard.php');
        exit;
    } else {
        $error = "Invalid username or password.";
    }
}
```

### Deploy our SQLI - Login Bypass labs 
- deploy di linux, implement dari laragon tadi ada mysql, php, apache buat server nanti
```bash
sudo apt install apache2 mysql-server php libapache2-mod-php php-mysql -y
[bikin db kek tadi atau export kalau bisa]
sudo cp dashboard.php index.php koneksi.php data.db /var/www/html
sudo systemctl start apache2
sudo systemctl start mysql
```
- dah coba akses aja dari mesin lain yg 1 jaringan http://[ip]


### Implement with Go: SQLI - Login Bypass labs 
- layered architecture
```bash
│   go.mod
│   go.sum
│   
├───cmd
│       main.go
│       
├───configs
│       db.go
│       
├───helpers
│       help.go
│       
├───internals
│   ├───domain
│   │       auth.go
│   │       
│   ├───handler
│   │       auth.go
│   │       
│   ├───repository
│   │       auth.go
│   │       
│   └───service
│           auth.go
│           
└───middlewares
        middleware.go
```
- /cmd/main.go
```go
func main() {
	db := configs.InitDB()
	authRepo := repository.NewAuthRepository(db)
	authService := service.NewAuthService(authRepo)
	authHandler := handler.NewAuthHandler(authService)
	mux := http.NewServeMux()
	mux.HandleFunc("/login", authHandler.Login)
	mux.HandleFunc("/dashboard", middlewares.RequireAuth(authService, authHandler.Dashboard))
	mux.HandleFunc("/logout", middlewares.RequireAuth(authService, authHandler.Logout))
	log.Println("Run on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

```
- /configs/db.go
```go
func InitDB() *sql.DB {
	var err error
	dsn := "root:@tcp(127.0.0.1:3306)/vuln"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Failed open db: %v", err)
	}
	if err = db.Ping(); err != nil {
		log.Fatalf("Gagal ping db: %v ", err)
	}
	log.Println("DB connected")
	return db
}

```
- /helpers/help.go
```go
type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	User    string `json:"user"`
}

func WriteJSON(w http.ResponseWriter, status int, payload Response) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}

func GetTokenFromReq(r *http.Request) string {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		return ""
	}
	return cookie.Value
}

```
- /middlewares/middleware.go
```go
func RequireAuth(svc domain.AuthService, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := helpers.GetTokenFromReq(r)
		if token == "" {
			helpers.WriteJSON(w, http.StatusUnauthorized, helpers.Response{
				Message: "Unauthorized: login dulu sono",
			})
			return
		}
		_, ok := svc.GetSession(token)
		if !ok {
			helpers.WriteJSON(w, http.StatusUnauthorized, helpers.Response{
				Message: "Unauthorized: session invalid or expired",
			})
			return
		}
		next(w, r)

	}
}
```
- /internals/domain/auth.go
```go
type User struct {
	ID       string
	Username string
	Password string
}
type Session struct {
	Username  string
	ExpiresAt time.Time
}
type AuthRepository interface {
	FindByCreds(username, password string) (*User, error)
}
type AuthService interface {
	Login(username, password string) (sessToken string, err error)
	Logout(sessToken string)
	GetSession(sessToken string) (*Session, bool)
}
```
- /internals/handler/auth.go
```go
type AuthHandler struct {
	service domain.AuthService
}

func NewAuthHandler(service domain.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		helpers.WriteJSON(w, http.StatusMethodNotAllowed, helpers.Response{
			Message: "method not allowed",
		})
	}

	token := helpers.GetTokenFromReq(r)
	if token != "" {
		if _, ok := h.service.GetSession(token); ok {
			helpers.WriteJSON(w, http.StatusBadRequest, helpers.Response{
				Message: "dah login, logout dulu sono",
			})
			return
		}
	}

	var creds struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		helpers.WriteJSON(w, http.StatusBadRequest, helpers.Response{
			Message: "invalid json body",
		})
	}

	newToken, err := h.service.Login(creds.Username, creds.Password)
	if err != nil {
		if err.Error() == "invalid creds" {
			helpers.WriteJSON(w, http.StatusUnauthorized, helpers.Response{
				Success: false,
				Message: err.Error(),
			})
			return
		}
		helpers.WriteJSON(w, http.StatusInternalServerError, helpers.Response{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    newToken,
		Path:     "/",
		HttpOnly: true,
		Expires:  time.Now().Add(1 * time.Hour),
	})

	helpers.WriteJSON(w, http.StatusOK, helpers.Response{
		Success: true,
		Message: "Login success",
	})

}

func (h *AuthHandler) Dashboard(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		helpers.WriteJSON(w, http.StatusMethodNotAllowed, helpers.Response{Message: "method not allowed"})
		return
	}

	token := helpers.GetTokenFromReq(r)
	sess, _ := h.service.GetSession(token)

	helpers.WriteJSON(w, http.StatusOK, helpers.Response{
		Success: true,
		Message: "Welcome home " + sess.Username + " enjoy your meal",
		User:    sess.Username,
	})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		helpers.WriteJSON(w, http.StatusMethodNotAllowed, helpers.Response{Message: "method not allowed"})
		return
	}

	token := helpers.GetTokenFromReq(r)
	h.service.Logout(token)

	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   "",
		Path:    "/",
		Expires: time.Unix(0, 0),
		MaxAge:  -1,
	})

	helpers.WriteJSON(w, http.StatusOK, helpers.Response{
		Success: true,
		Message: "logout success",
	})

}
```
- /internals/repository/auth.go
```go
type authRepository struct {
	db *sql.DB
}
func NewAuthRepository(db *sql.DB) domain.AuthRepository {
	return &authRepository{db: db}
}
func (r *authRepository) FindByCreds(uname, pass string) (*domain.User, error) {
	q := "SELECT id, username, password FROM users WHERE username = '" + uname + "' AND password = '" + pass + "'"
	row := r.db.QueryRow(q)
	var user domain.User
	err := row.Scan(&user.ID, &user.Username, &user.Password)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}
```
- /internals/service/auth.go
```go
type authService struct {
	repo            domain.AuthRepository
	ngestoreSession map[string]domain.Session
	mutek           sync.RWMutex
}

func NewAuthService(repo domain.AuthRepository) domain.AuthService {
	return &authService{
		repo:            repo,
		ngestoreSession: make(map[string]domain.Session),
	}
}

func (s *authService) Login(uname, pass string) (string, error) {
	user, err := s.repo.FindByCreds(uname, pass)
	if err != nil {
		return "", err
	}
	if user == nil {
		return "", errors.New("invalid creds")
	}
	token := uuid.NewString() // buat session
	s.mutek.Lock()
	s.ngestoreSession[token] = domain.Session{
		Username:  user.Username,
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}
	s.mutek.Unlock()
	return token, nil

}

func (s *authService) Logout(token string) {
	s.mutek.Lock()
	delete(s.ngestoreSession, token)
	s.mutek.Unlock()
}

func (s *authService) GetSession(token string) (*domain.Session, bool) {
	s.mutek.RLock()
	sess, ok := s.ngestoreSession[token]
	s.mutek.RUnlock()
	if !ok {
		return nil, false
	}
	if time.Now().After(sess.ExpiresAt) {
		s.mutek.Lock()
		delete(s.ngestoreSession, token)
		s.mutek.Unlock()
		return nil, false
	}
	return &sess, true
}
```
- worked payload 
```json
{
    "username":"'or 1=1-- -",
    "password":""
}

// and
{
    "username":"'or 1=1--",
    "password":"'or 1=1--"
}
```

## Union Select





# File Upload

## .phtml .phar

# (Soon dilanjut)
