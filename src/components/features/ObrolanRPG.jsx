/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useTypingSound } from "../../hooks/useTypingSound";

// Avatar pakai URL langsung — taruh gambar lo di public/img/
const AVATARS = {
  black: "/img/black.png",
  sidi: "/img/sidi.jpg",
  eskrim: "/img/eskrim.jpg",
  me: "/img/me.jpg",
};

const DIALOGUES = [
  {
    id: "intro",
    speaker: "?",
    avatar: AVATARS.black,
    text: "Hey who r u, go away leave me alone!",
    choices: [
      { label: "Wait whut?", next: "identity" },
      { label: "*Stay silent*", next: "silent" },
    ],
  },
  {
    id: "identity",
    speaker: "Sidi",
    avatar: AVATARS.sidi,
    text: "Oh, okay just strangers, huh.. what r u looking for?",
    choices: [
      { label: "See blogs", next: "enter" },
      { label: "Jangan sok inggris", next: "sok-inggris" },
    ],
  },
  {
    id: "silent",
    speaker: "Sidi",
    avatar: AVATARS.eskrim,
    text: "Oh the creep one, whatever.",
    choices: [
      { label: "*Get In*", next: "enter" },
    ],
  },
  {
    id: "sok-inggris",
    speaker: "Sidi",
    avatar: AVATARS.me,
    text: "Oh baiklah kalau itu mau mu, jadi masuklah ke blog ini karna disini terdapat banyak artikel ku.",
    choices: [
      { label: "Hmm menarique. Baiklah aku masuk dulu.", next: "enter" },
    ],
  },
  {
    id: "enter",
    speaker: "Room",
    avatar: AVATARS.black,
    text: "Welcome kink.....",
    choices: [
      { label: "▶ Masuk ke Blog", next: "done" },
    ],
  },
];

export default function ObrolanRPG({ onEnter }) {
  const [currentId, setCurrentId] = useState("intro");
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef(null);

  const playSound = useTypingSound({
    frequency: 520,
    randomRange: 80,
    volume: 0.04,
    duration: 0.06,
    type: "square",
  });

  const current = DIALOGUES.find((d) => d.id === currentId);

  useEffect(() => {
    setDisplayed("");
    setIsDone(false);

    let i = 0;
    const text = current.text;

    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i % 2 === 0) playSound();
      if (i >= text.length) {
        clearInterval(intervalRef.current);
        setIsDone(true);
      }
    }, 35);

    return () => clearInterval(intervalRef.current);
  }, [current.text, currentId, playSound]);

  const handleSkip = () => {
    if (!isDone) {
      clearInterval(intervalRef.current);
      setDisplayed(current.text);
      setIsDone(true);
    }
  };

  const handleChoice = (next) => {
    if (next === "done") {
      onEnter?.();
    } else {
      setCurrentId(next);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-end justify-center pb-10 px-4"
      style={{ background: "linear-gradient(to bottom, #0a0a0f, #0d0d1a)" }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, transparent 1px, transparent 40px)",
        }}
      />

      <div
        className="relative bottom-28 w-full max-w-2xl rounded-2xl border-2 border-yellow-400/60 bg-black/90 p-6"
        style={{ boxShadow: "0 0 30px rgba(250,204,21,0.15)" }}
        onClick={handleSkip}
      >
        <div className="flex items-center gap-3 mb-4">
          <img
            src={current.avatar}
            alt={current.speaker}
            className="w-12 h-12 rounded-xl border border-slate-700 object-cover"
          />
          <div>
            <p className="text-yellow-400 font-mono text-sm font-bold tracking-widest uppercase">
              {current.speaker}
            </p>
            <div className="h-0.5 w-16 bg-yellow-400/40 mt-1 rounded" />
          </div>
          <span className="ml-auto text-slate-700 font-mono text-xs">NPC</span>
        </div>

        <p className="text-white font-mono text-sm leading-relaxed min-h-[3em]">
          {displayed}
          {!isDone && (
            <span className="inline-block w-2 h-4 bg-yellow-400 ml-1 animate-pulse align-middle" />
          )}
        </p>

        {!isDone && (
          <p className="text-slate-600 font-mono text-xs mt-2">klik untuk skip...</p>
        )}

        {isDone && (
          <div className="mt-5 flex flex-col gap-2">
            {current.choices.map((c, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChoice(c.next);
                }}
                className="text-left px-4 py-2 rounded-lg border border-slate-700 text-slate-300 font-mono text-sm
                           hover:border-yellow-400 hover:text-yellow-400 hover:bg-yellow-400/5
                           transition-all duration-150 flex items-center gap-2"
              >
                <span className="text-yellow-600">▶</span> {c.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}