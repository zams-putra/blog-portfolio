# Membuat Chatbot di Portfolio Kalian
- integrate LLM via API backend lah ya

## Pakai API key - Gemini Flash
- pertama kalian ke sini aja: https://aistudio.google.com
- nah di kanan atas ada tulisan [create api key] create aja
- nah nanti kalau udah ke create ada tulisan [copy cURL quickstart] click aja
- coba paste, nanti ada kayak gini :
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent" \
  -H [rahasia]
```
- nah copy aja url nya ini 
```bash
https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent
```
- also jangan lupa copy API KEY nya juga, taruh di .env dari app mu
```env
GEMINI_API_KEY=[value]
```
- next kita bikin app backend buat servernya nanti, disini aku pakai express JS
```js
const app = express();
app.use(express.json());


const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Web started on http://localhost:5000"));

```
- jangan lupa implement rate limiter juga disini, sekalian dotenv dah 
```bash
npm i express-rate-limit dotenv
```
- biar dibatesin gitu lah request orang, gabisa nanya2 terus
- disini aku set nya, 1 menit cuman maksimal request 5 kali
```js
const rateLimiter = expressRateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Bentar sidi lagi mikir",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(rateLimiter);
```
- next kita bikin System Prompt nya
- ini apa, ini tuh kayak ngasih tau ke AI nya, set karakter AI nya gimana
- kek dia ini siapa dan dia ini harus apa, kalau di tanya ini dia harus apa
- buat aja systemPrompt.js
```js
export const SYSTEM_PROMPT = `Your name is [] and your character was [], Kamu adalah seorang [] 

== ABOUT ==
- [pembuat]
- Portfolio: [nasgor.com]
- GitHub: []
- LinkedIn: []

== Project ==
- []

== CERTIFICATIONS (selected) ==
- []

== TONE ==
- [be friendly]
- [pakai bahasa baku]
```
- contohnya seperti itu, tentunya bisa di modifikasi sesuai keinginan kalian
- bikin endpoint /api/chat, beri beberapa config sesuai keinginan kalian
```js
app.post("/api/chat", rateLimiter, async (req, res) => {
  const { messages } = req.body;

  const limitedMessages = messages.slice(-6);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: limitedMessages.map(msg => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            maxOutputTokens: 1000,  // jawab mendalam ga panjang
            temperature: 0.6,      // turun biar ga halu non challant
            topP: 0.8,             // kata tajem berbobot
            topK: 40,              // biar ga cerewet
          }
        })
      }
    )

    const data = await response.json()
    console.log("respon:", JSON.stringify(data)) 
    console.log("Finish Reason:", data.candidates?.[0]?.finishReason);
    
    if (data.error) {
      return res.status(data.error.code || 429).json({ 
        reply: "abis quota gw cuk" 
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Something went wrong."
    res.status(200).json({ reply })

  } catch (err) {
    console.log("Error", err)
    res.status(500).json({ message: "Error server lah", status: 500 })
  }
})
```
- next coba run app nya
```bash
npm start
```
- lalu coba dari postman, atau dari curl bebas
```rb
POST http://localhost:5000/api/chat


# taruh di raw body
{
  "messages": [
    { "role": "user", "content": "Ini siapa ya?" }
  ]
}
```
- kalau jawaban udah sesuai, bisa langsung deploy app nya
- dan bisa di integrasi ke frontend kalian
- misal nih :
```jsx
async function askChatbot(messages) {
  const res = await fetch("https://[url_deploy_kalian]/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  })
  const data = await res.json()
  return data.reply
}
```