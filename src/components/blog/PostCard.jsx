/* eslint-disable react/prop-types */
import { motion } from "motion/react";
import { FaLock } from "react-icons/fa";
import { useViewCounter } from "../../hooks/useViewCounter";

const CATEGORY_COLORS = {
  customlab:   { border: "border-sky-400/50",    text: "text-sky-400",    bg: "hover:bg-sky-400/5 hover:border-sky-400" },
  develop:     { border: "border-teal-400/50",   text: "text-teal-400",   bg: "hover:bg-teal-400/5 hover:border-teal-400" },
  catatan:     { border: "border-yellow-400/50", text: "text-yellow-400", bg: "hover:bg-yellow-400/5 hover:border-yellow-400" },
  writeup:     { border: "border-red-400/50",    text: "text-red-400",    bg: "hover:bg-red-400/5 hover:border-red-400" },
  programming: { border: "border-purple-400/50", text: "text-purple-400", bg: "hover:bg-purple-400/5 hover:border-purple-400" },
  default:     { border: "border-slate-700",     text: "text-slate-400",  bg: "hover:bg-slate-800 hover:border-slate-500" },
};

export function getCategory(tags = [], title = "") {
  const combined = [...tags, title].join(" ").toLowerCase();
  if (combined.includes("customlab"))  return "customlab";
  if (combined.includes("develop"))    return "develop";
  if (combined.includes("writeup") || combined.includes("ctf")) return "writeup";
  if (combined.includes("leetcode") || combined.includes("programming")) return "programming";
  if (combined.includes("catatan"))    return "catatan";
  return "default";
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45 } }),
};

export default function PostCard({ post, index }) {
  const { views, loadingers } = useViewCounter(post.id);
  const cat = getCategory(post.tags, post.title);
  const style = CATEGORY_COLORS[cat];
 const isLocked = Array.isArray(post.passwords) && post.passwords.length > 0;

 
  return (
    <a href={`/${post.id}`}>
      <motion.div
        custom={index}
        variants={cardVariant}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5 }}
        className={`group flex flex-col rounded-xl border bg-[#0d0d0d] transition-all duration-200 overflow-hidden cursor-pointer ${style.border} ${style.bg}`}
      >
   
        <div className="h-10 bg-slate-900 flex items-center px-4 gap-2 border-b border-slate-800">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500/60" />
          </div>
          <span className="text-slate-500 font-mono text-xs ml-2 truncate">{post.id}.md</span>

          {isLocked && (
            <span className="ml-auto text-xs flex gap-1 font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full shrink-0">
              <FaLock className="text-yellow-200" /> locked
            </span>
          )}
        </div>


        <div className="p-5 flex flex-col gap-3 flex-1">
          <span className={`text-xs font-mono ${style.text}`}>{`> ${cat}`}</span>
          <h2 className="text-white font-semibold text-sm leading-snug line-clamp-2">{post.title}</h2>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
            {isLocked ? "🔒 " + (post.alasan || "Writeup dikunci — mesin belum retired.") : post.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-slate-600 text-xs font-mono">{formatDate(post.date)}</span>
            <span className="text-slate-500 text-xs font-mono flex items-center gap-1.5">
              <span className="text-cyan-400/60">👁</span>
              {loadingers ? "..." : views === null ? "—" : `${views.toLocaleString()} views`}
            </span>
            <span
              className={`text-xs font-mono ${isLocked ? "text-yellow-400" : style.text} opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              {isLocked ? "unlock →" : "open →"}
            </span>
          </div>
        </div>
      </motion.div>
    </a>
  );
}