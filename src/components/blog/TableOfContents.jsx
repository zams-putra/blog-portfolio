/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";

/**
 * Parse headings from raw markdown string.
 * Returns array of { id, text, level } for h1/h2/h3.
 */
function parseHeadings(markdown) {
  if (!markdown) return [];

  const lines = markdown.split("\n");
  const headings = [];
  
  let inFrontmatter = false;
  let frontmatterDone = false;
  let inCodeBlock = false;

  for (const line of lines) {
    // Skip YAML frontmatter (--- ... ---)
    if (!frontmatterDone && line.trim() === "---") {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        inFrontmatter = false;
        frontmatterDone = true;
        continue;
      }
    }
    if (inFrontmatter) continue;

    // Skip fenced code blocks
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.trim().match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*/g, "").replace(/`/g, "").trim();
      const id = slugify(text);
      headings.push({ id, text, level });
    }
  }

  return headings;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function TableOfContents({ markdownContent }) {
  const [activeId, setActiveId] = useState("");
  const [visible, setVisible] = useState(false);
  const observerRef = useRef(null);

  const headings = parseHeadings(markdownContent);
  

  // IntersectionObserver — track which heading is in view
  useEffect(() => {
    if (headings.length === 0) return;

    const handleIntersect = (entries) => {
      // Find the topmost visible heading
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        setActiveId(visible[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: "-80px 0px -60% 0px",
      threshold: 0,
    });

    // Observe all heading elements (they get ids from MarkdownRenderer)
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [headings.length, markdownContent]);

  // Slight delay before showing so layout settles
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (headings.length < 2) return null;

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <aside
    className="hidden xl:block toc-scroll"
    style={{
        position: "fixed",
        top: "50%",
        right: "max(1rem, calc((100vw - 56rem) / 2 - 18rem))",
        transform: "translateY(-50%)",
        width: "16rem",
        maxHeight: "75vh",
        overflowY: "auto",
        zIndex: 20,
        opacity: visible ? 1 : 0,
        transition: "opacity .3s ease",
    }}
>
  <div className="mb-4 pb-2 border-b border-cyan-400/10">
    <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
      Contents
    </span>
  </div>

  <nav>
    <ul className="space-y-1">
      {headings.map(({ id, text, level }) => {
        const isActive = activeId === id;

        return (
          <li
            key={id}
            style={{
              paddingLeft:
                level === 1
                  ? 0
                  : level === 2
                  ? 14
                  : 28,
            }}
          >
            <button
              onClick={() => handleClick(id)}
              className="w-full text-left transition-all duration-200"
              style={{
                padding: "8px 10px",
                fontSize:
                  level === 1
                    ? "0.95rem"
                    : level === 2
                    ? "0.88rem"
                    : "0.82rem",

                fontWeight: isActive ? 600 : 400,

                color: isActive
                  ? "#22d3ee"
                  : level === 1
                  ? "#f1f5f9"
                  : "#94a3b8",

                borderLeft: isActive
                  ? "3px solid #22d3ee"
                  : "3px solid transparent",

                background: isActive
                  ? "rgba(6,182,212,.08)"
                  : "transparent",

                borderRadius: "8px",
              }}
            >
              {text}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
</aside>
  );
}