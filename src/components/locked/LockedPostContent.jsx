/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PasswordGate from "./PasswordGate";
import MarkdownRenderer from "../blog/MarkdownRenderer";

export default function LockedPostContent({ post }) {
  const [unlocked, setUnlocked] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(null);

  const handleUnlock = (decryptedMarkdown) => {
    setMarkdownContent(decryptedMarkdown);
    setUnlocked(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!unlocked ? (
        <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <PasswordGate post={post} onUnlock={handleUnlock} />
        </motion.div>
      ) : (
        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <MarkdownRenderer post={post} markdownContent={markdownContent} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}