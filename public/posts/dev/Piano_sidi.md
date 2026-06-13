# Buat App Piano

- jadi disini kepikiran bikin app piano sendiri
- karna biasa main di virtual piano: https://virtualpiano.net/
- atau ya karna di roblok, sampai ngumpulin note buat main soalnya
- walaupun tujuanku ya buat main piano ku sendiri aja karna seru

# Simple Piano - Html, Js
- jadi disini kita pakai library namanya ToneJS
- https://tonejs.github.io/
- walaupun suaranya ga terlalu mirip piano tapi oke lah, yang penting bernada
- jadi ada 2 cara mau pake npm i atau include by script aja
## HTML
- so disini aku include by script on my html
```html
<script src="https://unpkg.com/tone"></script>
```
- thats it sih, sama aku taruh tombol yang bisa enable function tone js nya
- sama taruh foto kucing biar bisa buka tutup gitu mulutnya kalau pas di pencet
- and i put piano notes in there biar sekalian nyontek not nya
- jadi html ku begini sementara
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/tone"></script>
</head>
<body>
    <h1>sidu piano</h1>
    <img src="img/car0.jpg" alt="car" class="car">
    <button id="start">Click to Enable Audio</button>


    <h1>Backstreet Boys  -  Shape of my heart</h1>
    <p>
        df-GhGd-paa
        hG-ffff-oI
        If-Sd-dddfGa
        GfdS-d-fG-f-dd
    </p>
    <br>

    
    <h1>ILY 3000  -  Stephanie poetri</h1>
    <p>
     -> opening
        YiIOP - YTYiIOPO
        TTYiIO - TT - SaPOP
        YiIOP - YTYiIOPO - OOOIOIO 
        PYIY

        -> verse1
        EEEEW - EEEETW
        TYTrE - TTYT - EWE
        EEEEETW - EEEE - TW
        TTYTEWE - TYTEWE

        -> verse 2
        TYiIOP - S OPO
        OTYi - IO - pPP
        TYY - iI - OPSOPO
        OTY - iIPPIY - TYIY

        -> reff 
        YiIOP - YTYiIOPO
        TTYiIO - TT - SaPOP
        YiIOP - YTYiIOPO - OOOIOIO 
        PYIY
    </p>
    <br>
    <h1>Last night on the earth  -  Green day</h1>
    <p>
        [eT] [eu] e T [eT] eue T [eT]
        eue T [eT] eue ey -> skip susah-> Tu Tu Tu Tu

        SuuiSapS - SSaSp
        pasap - iu
        SuuiSapS - SSaSp
        pasap - iu

        ppasapuS
        ppasap - iu
        ppasap
        SSfSGGf - ffap
        OpOsapapp

        SuuiSapaS - SSaSp
        ppasap - iu
        SuuiSapaS - SSaSp
        ppasap - iu
        ppasapuS
        ppasap - iu
        ppasap
        SSfSGGf - ffap
        OpOsapapp

        ppasapuS
        ppasap - iu
        ppasap - SSfSGGf
        ffap
        OpOsapapp
    </p>
    <br>
    <h1>My Love - Westlife</h1>
    <p>
       wttt tyyy errr
        rtt weee oeet rew
        wttt tyyy uooo
        ut weee weet rew reew

        wierr tttuyt 
        iuiui uttyy
        tre w(4x) wtre wwq0
        uoiuy uytuy err

        tre w(4x) wtre
        wwq0 uoiuy
        tuytu y 

        rtt
    </p>
    <br>
    <h1>One in A Million - NeYo</h1>
    <p>
        uuuuTu - u(6x) YTr - Y(6x) Tr
        Q(7x) Wr - 0rrrTrTrTrTrTrTT
        TTYuYuYuYuYuY-TY
        WWWrTrWrWQ - rWQ
        r TYYYTYr - Y(5x)uYr
        rWrTrTrTr - TTrT 
        rTTYuYuYuYuYuYuY-TY
        rTWTYu - OI - uY 
        Tr -rTYIpOuIT
        rTuuuIT - uuuIT
        TuIOIO - TTuIOIuTuT
    </p>
    <br>
    <h1>Duka - Last Child</h1>
    <p>t t to i[ti]  yu y tr tr t t
        t t [to] i i u y t trt o u-
        tt tt t- w y t t
        ty [tu] iu r ty 
        t t 0 q q  u [ey]- t t-

        r t t t [to] i i uy tr
        rr tt 
        t t [to] i [ti]
        yuy tt o [tu] iu
        t t t t t u ty
        ty [tu] i u ry
        t t [to] i [tu] y tt t
        [tu] u iuy

        tyui [to] o [to] uiuy 
        tyu i [ryo] o [ro] uiuy
        tyu i o tt rt rtt [to] 
        i u i y
        tyui [to] o [to]
        [tu] [ti] [tu] y 
        tyui [ryo] o [ro] [ru] iuy
        tyui [to] tt rt rt t [to] 
        i [tu] i y

        t rr r y r r rt rt -
        rr y r r t -
        ttyu u u  i u y t
        e t r e rt -

        [wr] [wr] [wr] [wr]
    </p>

</body>
</html>
```

## JS 
- untuk js aku masih pake switch
- dan jelek banget ini manual banget gonta ganti gambarnya
- soon lah ku update, gada css juga lagian disini
```js

const synth = new Tone.Synth().toDestination();
const car = document.querySelector('.car')
document.getElementById("start").addEventListener("click", async () => {
    await Tone.start();
    console.log("Audio started");
});

document.addEventListener('keydown', (event) => {

    switch (event.key) {
        case '0':
            synth.triggerAttackRelease("E3", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'q':
            synth.triggerAttackRelease("F3", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'Q':
            synth.triggerAttackRelease("F#3", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'w':
            synth.triggerAttackRelease("G3", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'W':
            synth.triggerAttackRelease("G#3", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'e':
            synth.triggerAttackRelease("A3", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'E':
            synth.triggerAttackRelease("A#3", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'r':
            synth.triggerAttackRelease("B3", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 't':
            synth.triggerAttackRelease("C4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'T':
            synth.triggerAttackRelease("C#4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'y':
            synth.triggerAttackRelease("D4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'Y':
            synth.triggerAttackRelease("D#4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'u':
            synth.triggerAttackRelease("E4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'i':
            synth.triggerAttackRelease("F4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'I':
            synth.triggerAttackRelease("F#4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'o':
            synth.triggerAttackRelease("G4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'O':
            synth.triggerAttackRelease("G#4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'p':
            synth.triggerAttackRelease("A4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'P':
            synth.triggerAttackRelease("A#4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'a':
            synth.triggerAttackRelease("B4", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 's':
            synth.triggerAttackRelease("C5", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
        case 'S':
            synth.triggerAttackRelease("C#5", "4n");
            setTimeout(() => {
                car.src = 'img/car1.jpg'
            }, 300)
            car.src = 'img/car0.jpg'
            break;
    }
    
});
```


# (Soon)
- sementara sih itu dulu aja
- akan terus di perbarui kedepannya
- targetnya ampe bikin versi 3D nya nanti pake threeJS hhh (kalau kesampaian)