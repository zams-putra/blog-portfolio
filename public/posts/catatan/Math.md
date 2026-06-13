# Math 

- entah ini mau di isi rumus atau apa y
- tapi beberapa ada note buat ngebantu leetcode ku kedepannya nanti
- disini aku buatnya pake Go lang
- soon mungkin akan ada func2 lain yang berhubungan ama math

## Abs number - function
- fungsi yang ngereturn angka absolute
- misal (1 - 4), return nya kan -3 yak
- nah beberapa soal tuh ada yang nyuruh kita nyari gap nya berapa 
- di case ini gap nya 3
- daripada ribet pakai max(1, 4) - min(1, 4), mending pake abs func

```go 
func AbsNum(n int) int {
	if n < 0 {
		return -n
	}
	return n
}
```


## It is prime number - function
- buat deteksi angka prima
- di soal2 leetcode kadang juga ada yg disuruh nyari prime num 
- doi nge return boolean

```go
func isItPrime(n int) bool {
	if n <= 1 {
		return false
	}
	for i := 2; i*i <= n; i++ {
		if n%i == 0 {
			return false
		}
	}
	return true
}
```


## Factorial - function 
- ini pernah dapet juga di leetcode
- misal 5! 
- factorial 5, dia bakal ngitung  5 * 4 * 3 * 2 * 1
```go
func factorial(n int) int {
	x := 1
	for n > 1 {
		x *= n
		n--
	}
	return x
}
```

# Cryptography
- ya koleksi2 kriptografiku lah ya

## Membuat fungsi Caesar Cipher
- jadi ini di ciptakan julius caesar di tahun 100sm - 44sm (kata google)
- ini tuh fungsinya dia ngegeser huruf aja sih
- misal nih: a -> d, b -> e, z -> c, tinggal +3 aja dari huruf2 nya
- jadi kalau kalimat: rat -> udw
- kita bakal buat encode dan decode nya
- encode: kalimat murni (pesan asli kalian) ke acak
- decode: kalimat acak ke murni (pesan asli kalian)
- oiya, ini semua nanti cuman work di huruf kecil (lowercase) tanpa sign2 lain (!, ?, dll)

### Caesar Cipher Encode
- nah sekarang kita buat fungsi encode nya dulu
- anggap lah kalian mau kasih pesan2 rahasia dengan teknik pengamanan pesan ini
- misal biar ga ketauan sirkel lain lah hhhhh
- nah pertama kita perlu tau offset nya dulu
```go
fmt.Println('z', 'a', 'z'-'a')
output akan: 122, 97, 25
```
- nah ini ASCII number kalau ga salah, jadi z - a tuh 25 ternyata
- so untuk sesuai abjad abcdefg..., kita perlu tambahin 1 dulu
```go
offset := int('z'-'a') + 1
```
- nah ini tuh buat apa, ini tuh buat kalau nanti misal hurufnya melebihi z
- kan z + 3 tuh harusnya, z -> a, b, c
- kalau +3 mentah mentah ASCII num nya kan bakal 122 + 3 -> 125
- dan itu bukan huruf c, so kita perlu - 26 in dulu
- 125 - 26 -> 99
- ingat huruf a tadi?, dia kan 97 ya, b jadi 98, c 99
- begitulah kira2 logicnya, yo kita buat func nya dulu kalau gitu
```go
func CaesarCipherEncode(text string) (r string) {
	// fmt.Println('z', 'a', 'z'-'a') //122 97 25
	offset := int('z'-'a') + 1
	for i := 0; i < len(text); i++ {
		if text[i] >= 'a' && text[i] <= 'z' {
			if int(text[i])+3 > int('z') {
				r += string(rune((int(text[i]) + 3) - offset))
			} else {
				r += string(rune(int(text[i]) + 3))
			}
		} else {
			r += string(text[i])
		}
	}
	return
}
```
- so aku disini memanfaatkan rune number dari golang
- biar gampang ngitungnya dan jadiin string nya
- also kita kasih kondisi disini 
```go
if int(text[i])+3 > int('z')

-> use this: string(rune((int(text[i]) + 3) - offset))
```
- kalau huruf saat ini + 3 itu melebihi angka ASCII dari Z
- kita perlu kurangin 26 kek tadi 
### Caesar Cipher Decode
- sama kayak yang encode, bedanya disini kita kurangin
- engga geser ke kanan tapi ke kiri, dari d -3, geser jadi a 
- gitu lah ya sebaliknya dari si encode tadi
```go
func CaesarCipherDecode(text string) (r string) {
	offset := int('z'-'a') + 1
	for i := 0; i < len(text); i++ {
		if text[i] >= 'a' && text[i] <= 'z' {
			if int(text[i])-3 < int('a') {
				r += string(rune((int(text[i]) - 3) + offset))
			} else {
				r += string(rune(int(text[i]) - 3))
			}
		} else {
			r += string(text[i])
		}
	}
	return
}
```
- also disini beda juga pengkondisian nya, kalau dia -3 lebih kecil dari ASCII a maka pakai +26 tadi 
```go
if int(text[i])+3 < int('a') 
-> use this: string(rune((int(text[i]) - 3) + offset))
```
### Try Caesar Cipher Function
- udah sih tinggal kita coba aja
- misal kita pakai begini, output akan begini 
```go
fmt.Println(CaesarCipherEncode("bro jangan kasih tau siapa siapa kalau gw fanatik nasi goreng"))

output: eur mdqjdq ndvlk wdx vldsd vldsd ndodx jz idqdwln qdvl jruhqj
```
- nah karna outputnya bakal gabisa dibaca begitu, tinggal kita decode aja
```go
fmt.Println(CaesarCipherDecode("eur mdqjdq ndvlk wdx vldsd vldsd ndodx jz idqdwln qdvl jruhqj"))

output: bro jangan kasih tau siapa siapa kalau gw fanatik nasi goreng
```
- udah, silahkan mencoba 

## Membuat fungsi Rot13
- sebenernya ini sama aja kayak caesar cipher, bedanya kita geser 13, bukan 3 lagi
- ini versi modern nya caesar cipher gitu lah ya kira kira
- so langsung kita coba aja yak
### Rot13 Encode
- yo langsung buat aja, sebenernya cuman edit aja sih bagian +3 tadi ganti 13
```go
func Rot13Encode(text string) (r string) {
	offset := int('z'-'a') + 1
	for i := 0; i < len(text); i++ {
		if text[i] >= 'a' && text[i] <= 'z' {
			if int(text[i])+13 > int('z') {
				r += string(rune((int(text[i]) + 13) - offset))
			} else {
				r += string(rune(int(text[i]) + 13))
			}
		} else {
			r += string(text[i])
		}
	}
	return
}
```
### Rot13 Decode
- funfact, kalau kita pakai func Rot13Encode bisa sih buat decode
- soalnya kan dia 13 ya which is dia 26/2, setengah dari alphabet kita
- otomatis dia muter setengah, tapi ya karena aku gatau fun fact itu sebelumnya
- jadi ya aku buat func decodenya lagi
```go
func Rot13Decode(text string) (r string) {
	offset := int('z'-'a') + 1
	for i := 0; i < len(text); i++ {
		if text[i] >= 'a' && text[i] <= 'z' {
			if int(text[i])-13 < int('a') {
				r += string(rune((int(text[i]) - 13) + offset))
			} else {
				r += string(rune(int(text[i]) - 13))
			}
		} else {
			r += string(text[i])
		}
	}
	return
}
```
### Try Rot13 Function
- udah sih tinggal kita coba aja
- misal kita pakai begini, output akan begini 
```go
fmt.Println(Rot13Encode("bro jangan kasih tau siapa siapa kalau gw fanatik nasi goreng"))


output: oeb wnatna xnfvu gnh fvncn fvncn xnynh tj snangvx anfv tberat
```
- nah karna outputnya bakal gabisa dibaca begitu, tinggal kita decode aja
- kita bisa cuy pakai func si encode tadi juga, tinggal masukin inputnya beda aja
```go
fmt.Println(Rot13Encode("oeb wnatna xnfvu gnh fvncn fvncn xnynh tj snangvx anfv tberat"))
fmt.Println(Rot13Decode("oeb wnatna xnfvu gnh fvncn fvncn xnynh tj snangvx anfv tberat"))

output: bro jangan kasih tau siapa siapa kalau gw fanatik nasi goreng
```
- udah, silahkan mencoba 



## Membuat fungsi Omke Gams Cipher