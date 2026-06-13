# ___________________________________________________________________________________________


# Weekly Contest 501

## Title: Concatenate Array With Reverse
### Difficult - Easy
#### Link: https://leetcode.com/problems/concatenate-array-with-reverse/description/

## Answer :

```go
func concatWithReverse(nums []int) (r []int) {
	r = append(r, nums...)
	for i := len(nums) - 1; i >= 0; i-- {
		r = append(r, nums[i])
	}
	return
}
```

## Key Points
```bash
- tinggal append aja normal nums ama nums versi reverse
- misal nih -> xyz -> nanti output begini ae -> xyzzyx
- atau misal -> nasgor -> output: nasgorrogsan
```



# ___________________________________________________________________________________________


# Weekly Contest 502

## Title: Check Adjacent Digit Differences
### Difficult - Easy
#### Link: https://leetcode.com/problems/check-adjacent-digit-differences/description/

## Answer :

```go
func isAdjacentDiffAtMostTwo(s string) bool {
	for i := 0; i < len(s)-1; i++ {
		x, _ := strconv.Atoi(string(s[i]))
		y, _ := strconv.Atoi(string(s[i+1]))
		if abs(x-y) > 2 {
			return false
		}

	}
	return true
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
- ini ngecek aja sih angka saat ini ama angka depannya
- kalau gap nya lebih dari 2, return false
- misal 132 -> kan 1 depannya 3, gap nya 2 doank yak, 3 depannya 2 gap nya 1
- berarti doi gada yg salah, return bakal true
- next kalau case nya 129, 1 ama 2 gap nya 1, 2 ama 9 gapnya 7, return false kalau ini
```


# ___________________________________________________________________________________________


# Weekly Contest 503

## Title: Limit Occurrences in Sorted Array
### Difficult - Easy
#### Link: https://leetcode.com/problems/limit-occurrences-in-sorted-array/description/

## Answer :

```go
func limitOccurrences(nums []int, k int) (r []int) {
	m := map[int]int{}
	for _, n := range nums {
		if m[n] < k {
			r = append(r, n)
			m[n]++
		}
	}
	return
}
```

## Key Points
```bash
- tinggal return angka sesuai variabel k aja sih
- misal ya nums = [1,2,2,3,3,4,4,2,2,2], k = 1
- kan jumlah angka 1 ada 1, angka 2 ada 5, angka 3 ada 3, angka 4 ada 4
- return nya harus = [1,2,3,4]
- karna k = 1, maxnya = 1, jadi tiap angka cuman boleh muncul dibawah k
- kalau k nya 2, ya maximal boleh muncul 2 kali, lebih dari itu gabole di masukin ke returnnya
```

## Title: Password Strength
### Difficult - Medium
#### Link: https://leetcode.com/problems/password-strength/description/

## Answer :

```go
func passwordStrength(password string) (r int) {
	singlePass := ""
	s := map[string]bool{}
	for _, p := range password {
		if !s[string(p)] {
			singlePass += string(p)
			s[string(p)] = true
		}
	}
	sign := "!@#$"
	m := map[string]int{}
	for i := 'a'; i <= 'z'; i++ {
		m[string(i)] = 1
	}
	for i := 'A'; i <= 'Z'; i++ {
		m[string(i)] = 2
	}
	for i := '0'; i <= '9'; i++ {
		m[string(i)] = 3
	}
	for _, v := range sign {
		m[string(v)] = 5
	}
	for _, v := range singlePass {
		r += m[string(v)]
	}
	return
}
```
## Key Points
```bash
- perlu cek passwordnya, gabole ada yang duplikat
- misal nih inputnya gini: nnaaasiiiG0r3ng!
- perlu di ilangin dulu duplikatnya menjadi: nasiG0r3g!
- lalu cek satu persatu
- kalau dia ada 'a' sampai 'z', point nambah 1
- kita cek nih disitu lowercase berapa: [nasirg] -> 6 -> 6 * 1 = 6 point
- kalau dia ada 'A' sampai 'Z', point nambah 2
- kita cek nih disitu uppercase berapa: [G] -> 1 -> 2 * 1 = 2 point
- kalau dia ada '0' sampai '9', point nambah 3
- kita cek nih disitu number berapa: [03] -> 2 -> 2 * 3 = 6 point
- kalau dia ada salah satu dari karakter ini !@#$, point nambah 5
- kita cek nih disitu karakter begitu ada berapa: [!] -> 1 -> 1 * 5 = 5 point
- so di jumlah point output jadi = 6 + 2 + 6 + 5 = 19
- return 19
```

# ___________________________________________________________________________________________


# Weekly Contest 504

## Title: Digit Frequency Score
### Difficult - Easy
#### Link: https://leetcode.com/problems/digit-frequency-score/description/

## Answer :

```go
func digitFrequencyScore(n int) (r int) {
	s, m := strconv.Itoa(n), map[string]int{}
	for _, v := range s {
		m[string(v)]++
	}
	for k, v := range m {
		intK, _ := strconv.Atoi(string(k))
		r += intK * v
	}
	return
}
```

## Key Points
```bash
- tinggal itung ae sih frekuensi dari angka n ini
- misal nih inputnya: 53523233
- kan angka 5 ada 2, jadi ya kalikan aja 5 * 2 = 10
- angka 2 ada 2, 2 * 2 = 4
- angka 3 ada 4, 3 * 4 = 12 
- then jumlahin aja cuy, 10 + 4 + 12 = 26, return 26
```

# ___________________________________________________________________________________________


# Weekly Contest 505

## Title: Sum of Compatible Numbers in Range I
### Difficult - Easy
#### Link: https://leetcode.com/problems/sum-of-compatible-numbers-in-range-i/description/

## Answer :

```go
func sumOfGoodIntegers(n int, k int) (r int) {
	x := max(1, n-k)
	for i := x; i <= n+k; i++ {
		if abs(n-i) <= k && n&i == 0 {
			r += i
		}
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
- jadi nanti start dari either 1 atau ga n - k
- kalau n - k hasilnya minus nanti mulainya dari 1 -> x = 1
- kalau n - k hasilnya plus, nanti mulai dari n - k -> x = n - k
- nah nanti tinggal iterasi aja, x ke n + k
- di setiap iterasi cek, apakah absolute(n - i) <= dan n & i == 0, kalau iya counting += i
```