import { useState } from "react";
import ObrolanRPG from "./ObrolanRPG";

export default function BlogRPGPreview() {
  const [entered, setEntered] = useState(false);

  if (entered) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center font-mono">
          <p className="text-yellow-400 text-xl mb-2">Go to the Blog</p>
          <p className="text-slate-400 text-sm">
            Go away.
          </p>
          <button
            onClick={() => setEntered(false)}
            className="mt-4 text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            ← Repeat
          </button>
        </div>
      </div>
    );
  }

  return <ObrolanRPG onEnter={() => setEntered(true)} />;
}