# 1. Beruang Aihihihi - Sofia Santos

- link: https://gralhix.com/list-of-osint-exercises/osint-exercise-005/
- img link: https://gralhix.com/wp-content/uploads/2023/08/osintexercise005.webp

## Tasks:
- A: di kebun binatang mana beruang2 ini berada
- B: berapa temperatur pada waktu itu pas di screenshotnya
- C: di koordinat berapa beruang2 itu rebahan

### Cari jawaban A
- wait pertama cek2 metadata dulu, cek di exiftool kali aja ada info
```json
{
  "name": "bear.webp",
  "ext": "webp",
  "mimeType": "image/webp",
  "detectedMime": "image/webp",
  "size": 405964,
  "source": "file",
  "url": "",
  "signature": {
    "ext": "webp",
    "mime": "image/webp",
    "label": "WebP (52 49 46 46 c4 31 06 00 57 45 42 50 56 50 38 4c)"
  },
  "headHex": "52 49 46 46 c4 31 06 00 57 45 42 50 56 50 38 4c",
  "headHexLong": "52 49 46 46 c4 31 06 00 57 45 42 50 56 50 38 4c b7 31 06 00 2f df c2 65 00 8d 48 6c db 48 90 a4 77 ff d7 f9 b1 25 e5 1f 70 f7 5e 0c 11 fd 9f 00 c7 68 a7 da b6 ea a8 e3 b4 40 a0 9d 11 94 78 b7",
  "headText": "RIFF.1..WEBPVP8L.1../..e..Hl.H..w....%..p.^......h.......@....x.",
  "headTextLong": "RIFF.1..WEBPVP8L.1../..e..Hl.H..w....%..p.^......h.......@....x.",
  "hashes": {
    "md5": "d206255aec293e636b536ddf612cad75",
    "sha1": "15666e93ee91a2e139359885b324cc50caa6715c",
    "sha256": "d204ee60247f7f81ce92ecea2f1e09fc6f84e3f69146475d195e16336931c3a9",
    "sha512": "b27ed6466e9f478530f8871e9424a448b0776183da13606b56e4ed04ef35ea56e02107cb41a6c563e2fa9146c625107f595e6557677ad888d6a6a8abaa426b0e",
    "crc32": "9f8fb336",
    "adler32": "1e50b9e6"
  },
  "relatedExts": [],
  "viewer": {
    "slug": "",
    "via": "standalone",
    "detectedMime": "image/webp"
  },
  "arrayBuffer": {},
  "parserReports": [
    {
      "id": "exifr",
      "label": "exifr",
      "status": "error",
      "note": "Broad parser for TIFF/EXIF, XMP, ICC, IPTC, JFIF, and IHDR.",
      "detail": "Unknown file format"
    },
    {
      "id": "piexifjs",
      "label": "piexifjs",
      "status": "skipped",
      "note": "JPEG-focused EXIF parser and fallback.",
      "detail": "Skipped because the file is not JPEG-like."
    },
    {
      "id": "pdf-metadata",
      "label": "pdf metadata",
      "status": "skipped",
      "note": "PDF-specific metadata parser.",
      "detail": "Skipped because the file is not PDF."
    },
    {
      "id": "kamadak-exif",
      "label": "kamadak-exif (WASM)",
      "status": "skipped",
      "note": "No browser-ready build is bundled in this repo. Adapter hook is available via window.EXIF_WASM_ADAPTERS.",
      "detail": ""
    },
    {
      "id": "rexif",
      "label": "rexif (WASM)",
      "status": "skipped",
      "note": "No browser-ready build is bundled in this repo. Adapter hook is available via window.EXIF_WASM_ADAPTERS.",
      "detail": ""
    }
  ],
  "metadata": [],
  "parserResults": {
    "exifr": null,
    "piexifjs": null,
    "pdf": null
  },
  "geoPoint": null
}
```
- pertama upload fotonya ke google reverse image
- set ke visual matches, btw banyak writeup bertebaran disitu hhh
- dan setelah scroll2 nemu kemiripan sama postingan ini : 
```txt
https://www.facebook.com/FirstAlertSanDiego/videos/polar-bear-live-cam-from-san-diego-zoo/1347230615786668/
```
- caption di post itu begini coy 
```txt

from: First Alert San Diego
at: 19 January 2022 
title: Polar Bear Live Cam From San Diego Zoo

desc:
This Polar bear on the live cam from the San Diego Zoo seems to be enjoying the 62 degree temperatures in Southern California today. *Captain Obvious noted that the bear would be cooler in Maryland, where our FAN National newsroom topped out at 38 degrees today* Temperatures in Central Maryland will be dropping into the mid 20's overnight with another chance for SNOW Thursday and Saturday morning. Cpt. vows to tape that MD snowcase and send it to the polar bear's "people".
``` 
- suudzon, perkiraan sih keknya emang dari san diego ya
- next cari google aja:
```txt
san diego zoo southern california
```
- then, open in maps, coordinate copy caranya klik kanan aja ke merah2 lokasinya di gmaps
- contoh: 32.736148109726884, -117.15102781534556
- paste ke google earth, di kiri atas search paste aja and search
- eits, setelah di cek cek di gmaps, ada nama hewan2 disitu
- ada tuh namanya: Polar Bear Plunge, coba copas coordinates lagi
```txt
32.73455376546497, -117.15456850094984
```

# (Soon dilanjut)