/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import { motion } from "motion/react";
import PostContent from "./PostContent";

let copyTimeouts = {};

function makeMarkdownComponents() {
  return {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match?.[1] || "text";
      const codeId = String(children).slice(0, 20);
      const [copied, setCopied] = useState(false);

      if (inline) {
        return (
          <code
            className="text-cyan-300 bg-slate-900/80 border border-cyan-500/20 px-1.5 py-0.5 rounded text-xs font-mono"
            style={{ textShadow: "0 0 8px rgba(103,232,249,0.4)" }}
            {...props}
          >
            {children}
          </code>
        );
      }

      const handleCopy = () => {
        navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
        setCopied(true);
        clearTimeout(copyTimeouts[codeId]);
        copyTimeouts[codeId] = setTimeout(() => setCopied(false), 2000);
      };

      return (
        <div className="relative group my-6">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border border-slate-700/60 border-b-0 rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <span className="text-slate-500 font-mono text-xs tracking-widest uppercase">{language}</span>
            <button
              onClick={handleCopy}
              className="text-slate-600 hover:text-cyan-400 font-mono text-xs transition-colors duration-200"
            >
              {copied ? "✓ copied" : "copy"}
            </button>
          </div>
          <div style={{ boxShadow: "0 0 30px rgba(6,182,212,0.06)" }}>
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: "0 0 0.75rem 0.75rem",
                border: "1px solid rgba(51,65,85,0.6)",
                borderTop: "none",
                background: "#060d14",
                padding: "1.25rem",
                fontSize: "0.72rem",
                lineHeight: "1.7",
              }}
              codeTagProps={{ style: { background: "transparent" } }}
              showLineNumbers={true}
              lineNumberStyle={{ color: "#1e3a4a", fontSize: "0.62rem", minWidth: "2.5em" }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    },

    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-yellow-400 font-mono mt-8 mb-3"
        style={{ textShadow: "0 0 20px rgba(250,204,21,0.3)" }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-bold text-cyan-400 font-mono mt-8 mb-3 pb-2 border-b border-cyan-400/20"
        style={{ textShadow: "0 0 16px rgba(34,211,238,0.3)" }}>
        <span className="text-slate-600 mr-2">##</span>{children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-semibold text-purple-400 font-mono mt-6 mb-2">
        <span className="text-slate-600 mr-2">###</span>{children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-slate-300 leading-relaxed mb-4 text-sm">{children}</p>
    ),
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="text-cyan-400 underline underline-offset-2 decoration-cyan-400/40 hover:decoration-cyan-400 transition-all duration-200"
        style={{ textShadow: "0 0 8px rgba(34,211,238,0.3)" }}>
        {children}
      </a>
    ),
    ul: ({ children }) => <ul className="my-3 space-y-1.5 pl-0">{children}</ul>,
    ol: ({ children }) => <ol className="my-3 space-y-1.5 pl-0 list-none">{children}</ol>,
    li: ({ children }) => (
      <li className="flex items-start gap-3 text-slate-300 text-sm">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"
          style={{ boxShadow: "0 0 6px rgba(34,211,238,0.8)" }} />
        <span>{children}</span>
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-yellow-400/60 pl-4 my-4 bg-yellow-400/5 py-3 rounded-r-lg"
        style={{ boxShadow: "inset 0 0 20px rgba(250,204,21,0.03)" }}>
        <span className="text-slate-400 text-sm italic">{children}</span>
      </blockquote>
    ),
    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
    hr: () => (
      <div className="my-8 relative">
        <div className="border-t border-slate-800" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-black px-3 text-slate-700 font-mono text-xs">···</span>
        </div>
      </div>
    ),
  };
}


export default function MarkdownRenderer({ post, markdownContent }) {
  const markdownComponents = makeMarkdownComponents();

  const markdownBody = markdownContent == null ? (
    <div className="flex flex-col gap-3 py-20 items-center">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="w-2 h-2 rounded-full bg-cyan-400"
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            style={{ boxShadow: "0 0 8px rgba(6,182,212,0.8)" }} />
        ))}
      </div>
      <p className="text-cyan-400/60 font-mono text-xs animate-pulse">Loading...</p>
    </div>
  ) : (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );

  return (
    <PostContent post={post}>
      {markdownBody}
    </PostContent>
  );
}