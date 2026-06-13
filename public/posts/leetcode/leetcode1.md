# Weekly Contest 490

## Title: Check Digitorial Permutation
### Difficult - Medium
#### Link: https://leetcode.com/problems/check-digitorial-permutation/description/

## Answer :

```go
func CheckDigitalPermutation(n int) bool {
	x, s := 0, strconv.Itoa(n)
	for i := 0; i < len(s); i++ {
		num, _ := strconv.Atoi(string(s[i]))
		x += factorial(num)
		fmt.Println(factorial(num))
	}
	sX := strconv.Itoa(x)
	runeSx, sRune := []rune(sX), []rune(s)
	sort.Slice(runeSx, func(i, j int) bool {
		return runeSx[i] < runeSx[j]
	})
	sort.Slice(sRune, func(i, j int) bool {
		return sRune[i] < sRune[j]
	})

	return string(runeSx) == string(sRune)
}

func factorial(n int) int {
	x := 1
	for n > 1 {
		x *= n
		n--
	}
	return x
}

```

## Key Points

### penjumlahan factorial setiap index
#### - setiap index dari n, harus di hitung factorialnya

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

##### contoh gagal: 253
- 2 factorial = 2 * 1 = 2
- 5 factorial = 5 * 4 * 3 * 2 * 1 = 120
- 3 factorial = 3 * 2 * 1 = 6
##### contoh berhasil: 145
- 1 facotrial = 1 return 1 karna kalau 0 doi malah 0 atau 1 * 1 aja kayak trik ku
- 4 factorial = 4 * 3 * 2 * 1 = 24
- 5 factorial = 5 * 4 * 3 * 2 * 1 = 120


#### - jumlahkan masing masing hasil
##### contoh gagal:
- 2 + 120 + 6 = 128
##### contoh berhasil: 
- 1 + 24 + 120 = 145

### di samakan secara sorting dengan sort input dan sort hasil sum factorial
#### - sorting input sort and sum factorial dari yg terkecil
##### contoh gagal:
- sort input 253 -> sort: 235
- sort sum factor 128 -> sort: 128
##### contoh berhasil: 
- sort input 145 -> sort: 145
sort sum factor 145 -> sort: 145


### bandingkan apakah input sama dengan hasil penjumlahan factorial setiap index
##### contoh gagal: 
- 235 != 128 maka return false
##### contoh berhasil: 
- 145 == 14= maka return true


## Title: Find the Score Difference in a Game
### Difficult - Medium
#### Link: https://leetcode.com/problems/find-the-score-difference-in-a-game/description/

## Answer :

```go
func FindTheScoreDiffInAnGame(nums []int) int {
	p1b := true
	p1, p2 := 0, 0
	for i := 0; i < len(nums); i++ {
		if nums[i]%2 != 0 {
			p1b = !p1b
		}
		if (i+1)%6 == 0 {
			p1b = !p1b
		}
		if p1b {
			p1 += nums[i]
		} else {
			p2 += nums[i]
		}
	}

	return p1 - p2
}
```
### My first answer (wrong)
```go 
 func FindTheScoreDiffInAnGame(nums []int) int {
 	p1b := true
 	p1, p2 := 0, 0
 	for i := 0; i < len(nums); i++ {
 		if nums[i]%2 != 0 {
 			if p1b {
 				if (i+1)%6 != 0 {
 					p2 += nums[i]
 					p1b = !p1b
 				} else {
 					p1 += nums[i]
 				}
 			} else {
 				if (i+1)%6 != 0 {
 					p1 += nums[i]
 					p1b = !p1b
 				} else {
 					p2 += nums[i]
 				}
 			}
 		} else {
 			if p1b {
 				p1 += nums[i]
 			} else {
 				p2 += nums[i]
 			}
 		}
 	}
 	return p1 - p2
 }

```


## Key Points
```bash
- ada p1, dan p2
- p1 main duluan
- kalo index 6 doi tuker giliran
- kalo nums[i] ganjil doi tuker giliran
- kalo dalam giliran, doi tambah skor sesuai nums[i]
```

# ___________________________________________________________________________________________


# Weekly Contest 491

## Title: Trim Trailing Vowels
### Difficult - Easy
#### Link: https://leetcode.com/problems/trim-trailing-vowels/

## Answer :

```go
func trimTrailingVowels(s string) string {
	x, vows, m := 0, "aiueo", map[string]bool{}
	for _, v := range vows {
		m[string(v)] = true
	}
	for i := len(s) - 1; i >= 0; i-- {
		if !m[string(s[i])] {
			x = i
			break
		}
		if i == 0 {
			return ""
		}
	}
	return string(s[0 : x+1])
}
```

## Key Points
```bash
- hilangkan vowels: a i u e o, di yang paling belakang
- contoh 1: 
- input: abceuiueiuie
- output: abc -> hilangkan: abc [euiueiuie]
- contoh 2: 
- input: nasigorengia
- output: nasigoreng -> hilangkan: nasigoreng [ia]
```



# ___________________________________________________________________________________________


# Weekly Contest 492

## Title: Minimum Capacity Box
### Difficult - Easy
#### Link: https://leetcode.com/problems/minimum-capacity-box/description/

## Answer :

```go
func MinCapacityBox(capacity []int, itemSize int) int {
	idx, min := -1, itemSize
	for i := 0; i < len(capacity); i++ {
		subs := capacity[i] - itemSize
		if idx == -1 && subs >= 0 {
			idx = i
			min = subs
		}
		if subs < min && subs >= 0 {
			idx = i
			min = subs
		}
	}
	return idx
}
```

## Key Points
```bash
- kalau capacity[x] sangat muat dengan itemSize maka return x
- contoh: 
- arr: [1, 9, 5, 3], itemSize = 3
- A: capacity[x] = 1, itemSize = 3 -> sisa -2 (ga muat skip)
- B: capacity[x] = 9, itemSize = 3 -> sisa 6
- C: capacity[x] = 5, itemSize = 3 -> sisa 2
- D: capacity[x] = 3, itemSize = 3 -> sisa 0
- return yang: muat ga tersisa paling sedikit, yaitu D
- jadi, return index dari D, yaitu 3
```



# ___________________________________________________________________________________________


# Weekly Contest 493

## Title: Count Commas in Range
### Difficult - Easy
#### Link: https://leetcode.com/problems/count-commas-in-range/description/

## Answer :
```go
func CountCommasInRange(n int) int {
	if n-1000 < 0 {
		return 0
	}
	return n - 1000 + 1
}
```
```js 
var countCommas = n => n - 1000 < 0 ? 0 : n - 1000 + 1
```
```ts 
const countCommas = (n: number): number => n - 1000 < 0 ? 0 : n - 1000 + 1
```

## Key Points
- kalau n - 1000 kurang dari 0 return 0
- selain dari itu, return n - 1000 + 1
- misal n = 1002, jadi dia ngeluarin 1000, 1001, 1002
- (1002 - 1000) + 1 = 3



# ___________________________________________________________________________________________


# Weekly Contest 494

## Title: Construct Uniform Parity Array I
### Difficult - Easy
#### Link: https://leetcode.com/problems/construct-uniform-parity-array-i/

## Answer :
```go
func uniformArray(nums1 []int) bool {
    o, e := true, true
    for i := 0; i < len(nums1); i++ {
        d1, d2 := false, false
        if i + 1 < len(nums1){
           if (nums1[i] - nums1[i + 1]) % 2 != 0 {
               d2 = true
           }
        }
        if nums1[i] % 2 != 0 {
            d1 = true
        }

        if !d1 && !d2 {
            o = false
        }
    }


    for i := 0; i < len(nums1); i++ {
        d1, d2 := false, false
        if i + 1 < len(nums1){
           if (nums1[i] - nums1[i + 1]) % 2 == 0 {
               d2 = true
           }
        }
        if nums1[i] % 2 == 0 {
            d1 = true
        }
        if !d1 && !d2 {
            o = false
        }
    }
    if o || e {
        return true
    }
    return false
}
```

## Key Points
```bash
- pakai 2 bool odd dan even
- pakai 2 for loop, dan cari masing masing
- loop1: apakah disini ada genap ?, kalau ada set variabel odd ke false
- loop2: apakah disini ada ganjil ?, kalau ada set variabel even ke false
- cek kedua variabel odd dan even
- kalau salah satu dari mereka ada yang true, return true
- kalau dua duanya false, return false
```

# ___________________________________________________________________________________________


# Weekly Contest 495

## Title: First Matching Character From Both Ends
### Difficult - Easy
#### Link: https://leetcode.com/problems/first-matching-character-from-both-ends/description/

## Answer :
```go
func firstMatchingIndex(s string) int {
	n := len(s)
	for i := 0; i < len(s); i++ {
		if s[i] == s[n-i-1] {
			return i
		}
	}
	return -1
}
```

## Key Points
```bash
- n = panjang dari s
- cek satu satu index
- kalau s[i] == s[n-i-1] return i
- selain itu return -1
```


# ___________________________________________________________________________________________


# Weekly Contest 496

## Title: Mirror Frequency Distance
### Difficult - Medium
#### Link: https://leetcode.com/problems/mirror-frequency-distance/description/

## Answer :
```go
func mirrorFrequency(s string) (r int) {
	appear := map[string]bool{}
	for i := 0; i < len(s); i++ {
		ori, mirror := string(s[i]), ""
		if s[i] >= '0' && s[i] <= '9' {
			mirror = string('9' - (rune(s[i]) - '0'))
		} else if s[i] >= 'a' && s[i] <= 'z' {
			mirror = string('z' - (rune(s[i]) - 'a'))
		}

		if appear[ori] || appear[mirror] {
			continue
		}

		x, y := 0, 0
		for j := 0; j < len(s); j++ {
			if string(s[j]) == mirror {
				y++
			}
			if string(s[j]) == ori {
				x++
			}
		}
		if x > 0 {
			appear[string(s[i])] = true
		}
		if y > 0 {
			appear[mirror] = true
		}
		r += abs(x - y)
	}
	return
}

func abs(n int) int {
	if n < 0 {
		return -n
	}
	return n
}
```

## Key Points
```bash
- bikin map buat cek char ini udah pernah muncul atau belum
- kalau udah, skip
- kalau belum:
- cari mirrornya, yaitu lawan index dari doi
- misal a, mirrornya z
- misal b, mirrornya y
- misal c, mirrornya x
- misal 0, mirrornya 9
- misal 1, mirrornya 8
- buat X untuk nilai si ori, misal a, cari a muncul berapa kali count aja pake increment, misal 1
- buat Y untuk nilai si mirror, misal z, cari z muncul berapa kali count aja pake increment, misal 2
- buat abs function, biar 1 - 2 engga minus
- buat variabel result, buat nampung penjumlahan per sesi nya
- result += abs(x - y)
```


# ___________________________________________________________________________________________


# Weekly Contest 497

## Title: Find the Degree of Each Vertex
### Difficult - Easy
#### Link: https://leetcode.com/problems/find-the-degree-of-each-vertex/description/

## Answer :
```go
func findDegrees(matrix [][]int) (r []int) {
	for i := 0; i < len(matrix); i++ {
		x := 0
		for j := 0; j < len(matrix[i]); j++ {
			if matrix[i][j] == 1 {
				x++
			}
		}
		r = append(r, x)
	}
	return
}
```

## Key Points
```go
- buat x di setiap iterasi matrix
- cek matrix[i], terus itung nilai 1 di dalamnya
- contoh matrix[i] = [1,0,1], jadi x = 2
- nah itung semua nya deh
- contoh matrix = [[1,0,1],[1,1,1], [1,0,0]]
- output harusnya: [2, 3, 1]
```

## Title: Angles of a Triangle
### Difficult - Medium
#### Link: https://leetcode.com/problems/angles-of-a-triangle/description/

## Answer :
```go
func internalAngles(sides []int) []float64 {
	a, b, c := sides[0], sides[1], sides[2]
	if a+b <= c {
		return []float64{}
	}
	if b+c <= a {
		return []float64{}
	}
	if a+c <= b {
		return []float64{}
	}
	aQ, bQ, cQ := a*a, b*b, c*c
	bc2 := 2 * b * c
	ca2 := 2 * c * a
	ab2 := 2 * a * b
	aR := math.Acos(float64((bQ+cQ-aQ))/float64(bc2)) * 180 / math.Pi
	bR := math.Acos(float64((cQ+aQ-bQ))/float64(ca2)) * 180 / math.Pi
	cR := math.Acos(float64((aQ+bQ-cQ))/float64(ab2)) * 180 / math.Pi
	r := []float64{aR, bR, cR}
	sort.Float64s(r)
	return r
}
```

## Key Points
```go
- buat var a b c sesuai sides index 0 - 2
- cek if a + b <= c return array kosong
- begitu juga dengan b + c <= a, a + c <= b
- next buat var aQ, bQ, cQ buat masing2 kuadrat dari a b c
- aQ = a x a, begitu juga dengan b dan c 
- lalu buat variabel xy2, misal a ga di ajak, jadi xy2 menjadi bc2 
- bc2 adalah -> 2 * b * c 
- nah nanti tinggal cek aja siapa yang di ajak siapa yang engga
- btw ini rumus ngitungnya dari AI, jadi aku cuman eksekusi logic code nya 
- math.Acos(float64((bQ+cQ-aQ))/float64(bc2)) * 180 / math.Pi
- then masing2 var buat xR, dan x itu yang ga di ajak nantinya
- float64((bQ+cQ-aQ))/float64(bc2)
- gitulah pokoknya, bingung juga jelasinnya huahaha
- then append and sorting dari yang terkecil and return arr nya
```

# ___________________________________________________________________________________________


# Weekly Contest 498

## Title: Smallest Stable Index I
### Difficult - Easy
#### Link: https://leetcode.com/problems/smallest-stable-index-i/description/

## Answer :
```go
func firstStableIndex(nums []int, k int) int {
	for i := 0; i < len(nums); i++ {
		left, right := nums[:i+1], nums[i:]
		h, l := 0, 0
		for j := 0; j < len(left); j++ {
			if j == 0 {
				h = left[j]
			}
			if left[j] > h {
				h = left[j]
			}
		}
		for j := 0; j < len(right); j++ {
			if j == 0 {
				l = right[j]
			}
			if right[j] < l {
				l = right[j]
			}
		}
		if h-l <= k {
			return i
		}
	}
	return -1
}
```

## Key Points
```go
- bikin perulangan sepanjang value dari array nums
- buat 2 array terpisah di setiap indexnya, yaitu left and right
- misal array nya [5,0,1,4]
- kalau index 0: left = [5], right = [5, 0, 1, 4]
- kalau index 1: left = [5, 0], right = [0, 1, 4]
- kalau index 2: left = [5, 0, 1], right = [1, 4]
- nah di setiap left, cari max nya, taruh variabel h
- dan di setiap right, cari min nya, taruh di variabel l
- lalu kurangin dah tuh, max and min nya, h - l di setiap indexnya
- nah kalau semisalnya h - l lebih kecil atau sama dengan variabel k , return indexnya
- if h - l <= k, return i 
- kalau sama sekali ga ada, return -1
```


# ___________________________________________________________________________________________


# Weekly Contest 499

## Title: Valid Elements in an Array
### Difficult - Easy
#### Link: https://leetcode.com/problems/valid-elements-in-an-array/description/

## Answer :
```go
func findValidElements(nums []int) (r []int) {
	for i := 0; i < len(nums); i++ {
		if i == 0 || i == len(nums)-1 {
			r = append(r, nums[i])
			continue
		}
		maxL, maxR := 0, 0
		for j := 0; j < i; j++ {
			if nums[j] > maxL {
				maxL = nums[j]
			}
		}
		for j := i + 1; j < len(nums); j++ {
			if nums[j] > maxR {
				maxR = nums[j]
			}
		}
		if nums[i] > maxL || nums[i] > maxR {
			r = append(r, nums[i])
		}
	}
	return
}
```

## Key Points
```go
- kalau si x ini ada di index awal atau akhir, append aja ke arr
- nah nanti dipisah, ada maxL maxR 
- maxL tuh nilai tertinggi di sebelum si X ini
- misal x di index 2, jadi maxL tuh nilai di index 0, 1
- maxR nih nilai setelah index si x
- jadi kalau len arrnya 5, maxR tuh kira2 ada di index 3, 4
- nah nanti kalau si x ini lebih gede dari maxL atau maxR, append aja ke arr
```


## Title: Sort Vowels by Frequency
### Difficult - Medium
#### Link: https://leetcode.com/problems/sort-vowels-by-frequency/description/

## Answer :
```go
func sortVowels(s string) string {
	res := make([]byte, len(s))
	mN, first := map[byte]int{}, map[byte]int{}
	m := map[byte]bool{
		'a': true, 'e': true, 'i': true, 'o': true, 'u': true,
	}
	x, n := []byte{}, 0
	for i := 0; i < len(s); i++ {
		if m[s[i]] {
			x = append(x, s[i])
		}
	}
	for i := 0; i < len(s); i++ {
		if m[s[i]] {
			if _, ok := first[s[i]]; !ok {
				first[s[i]] = i
			}
		}
	}
	for i := 0; i < len(s); i++ {
		if m[s[i]] {
			mN[s[i]]++
		}
	}
	sort.Slice(x, func(i, j int) bool {
		if mN[x[i]] == mN[x[j]] {
			return first[x[i]] < first[x[j]]
		}
		return mN[x[i]] > mN[x[j]]
	})
	for i := 0; i < len(s); i++ {
		if m[s[i]] {
			res[i] = x[n]
			n++
			continue
		}
		res[i] = s[i]
	}
	return string(res)
}

```

## Key Points
```go
- intinya mah sorting sesuai vows paling sering muncul yg mana
- misal nih, nasii goreengg
- a(1), i(2), o(1), e(2) -> urutin jadi i(2) e(2) a(1) o(1)
- nah nanti tiap vow, urutin yang paling banyak duluan
- kalau nilai vownya sama, urutin sesuai mana yg paling duluan muncul
- jadi outputnya akan: nisie geraongg
```

# ___________________________________________________________________________________________


# Weekly Contest 500

## Title: Count Indices With Opposite Parity
### Difficult - Easy
#### Link: https://leetcode.com/problems/count-indices-with-opposite-parity/description/

## Answer :
```go
func countOppositeParity(nums []int) (r []int) {
	for i := 0; i < len(nums); i++ {
		c, searchOdd := 0, false
		if nums[i]%2 == 0 {
			searchOdd = true
		}
		for j := i + 1; j < len(nums); j++ {
			if searchOdd {
				if nums[j]%2 != 0 {
					c++
				}
			} else {
				if nums[j]%2 == 0 {
					c++
				}
			}
		}
		r = append(r, c)
	}
	return
}
```

## Key Points
```go
- x = nums[i]
- nah kalau si x ini genap, cek apakah di kanan nya ada ganjil
- kalau ada, counting aja jumlahnya berapa, nanti masukin ke return arr
- nah kalau si x ini ganjil, cek apakah di kanan nya ada genap
- kalau ada, counting aja jumlahnya berapa, nanti masukin ke return arr
- gitu aja sih
```


## Title: Sum of Primes Between Number and Its Reverse
### Difficult - Medium
#### Link: https://leetcode.com/problems/sum-of-primes-between-number-and-its-reverse/description/

## Answer :
```go
func sumOfPrimesInRange(n int) (r int) {
	s, rev := strconv.Itoa(n), ""
	for i := len(s) - 1; i >= 0; i-- {
		rev += string(s[i])
	}
	revN, _ := strconv.Atoi(rev)
	low, high := min(n, revN), max(n, revN)

	for i := low; i <= high; i++ {
		if itIsPrime(i) {
			r += i
		}
	}
	return
}

func itIsPrime(n int) bool {
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

## Key Points
```go
- buat 2 int dulu, n sama reverse dari n
- jadi kalau 123, ya reversenya 321
- terus tinggal cari min max dari keduanya
- apakah si reverse or si n yang lebih gede
- nanti tinggal loop aja dari si min ke max
- nah di setiap loop nya, cek apakah i prime number
- kalau ya tinggal add aja prime num nya ke result number, tumpuk jumlahin (+=)
```