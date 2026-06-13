/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PostCard, { getCategory } from "./PostCard";
import ObrolanRPG from "../features/ObrolanRPG";
import DonationSection from "../features/DonationSection";

const categories = ["all", "customlab", "writeup", "programming", "catatan", "develop"];

export default function BlogFilter({ posts }) {
  const [filter, setFilter] = useState("all");

 
  const [showOpening, setShowOpening] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("percakapan");
  });

  const handleEnter = () => {
    sessionStorage.setItem("percakapan", "1");
    setShowOpening(false);
  };

  const filtered = posts.filter((p) =>
    filter === "all" ? true : getCategory(p.tags, p.title) === filter
  );


  if (showOpening) return <ObrolanRPG onEnter={handleEnter} />;

  return (
    <main className="min-h-screen w-full bg-black text-white px-6 md:px-16 py-20">

      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <a
          href="/"
          className="text-slate-500 font-mono text-xs hover:text-purple-400 transition-colors mb-6 inline-block"
        >
          ← cd ../home
        </a>
        <p className="text-yellow-400 font-mono text-xs mb-2">
          {`[user@portfolio ~]$ ls -la ./blog`}
        </p>
        <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-yellow-400 via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Blog
        </h1>
        <p className="text-slate-400 text-sm mt-3 font-mono">
          Boot2root Dev · Writeups · Programming · etc
        </p>
      </motion.div>


      <motion.div
        className="flex flex-wrap gap-2 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full border font-mono text-xs transition-all duration-200 ${
              filter === cat
                ? "border-purple-400 text-purple-400 bg-purple-400/10"
                : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
            }`}
          >
            {`> ${cat}`}
          </button>
        ))}
        <span className="ml-auto text-slate-600 text-xs font-mono self-center">
          {filtered.length} post{filtered.length !== 1 ? "s" : ""}
        </span>
      </motion.div>

    
      {filtered.length === 0 && (
        <div className="text-center py-24 font-mono text-slate-500">
          <p>{`> no posts found for: "${filter}"`}</p>
          <button
            onClick={() => setFilter("all")}
            className="mt-4 text-xs text-purple-400 hover:underline"
          >
            reset filter
          </button>
        </div>
      )}


      {filtered.length > 0 && (
        <AnimatePresence mode="wait">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </AnimatePresence>
      )}

      <DonationSection />
    </main>
  );
}