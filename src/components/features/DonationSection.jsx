import { motion } from "motion/react";

const DONATION_LINKS = {
  saweria: "https://saweria.co/smithman",
};

export default function DonationSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-16 mb-8"
    >
      <div className="border border-slate-800 rounded-xl bg-[#0d0d0d] overflow-hidden">
        <div className="h-10 bg-slate-900 flex items-center px-4 gap-2 border-b border-slate-800">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500/60" />
          </div>
          <span className="text-slate-500 font-mono text-xs ml-2">support.sh</span>
        </div>

        <div className="p-6 text-center flex flex-col items-center gap-5">
          <div>
            <p className="text-yellow-400 font-mono text-xs mb-1">
              {`[user@portfolio ~]$ cat ./support.md`}
            </p>
            <p className="text-white font-semibold text-base mt-3">
              suprot saya disini kalau mw
            </p>
            <p className="text-slate-500 font-mono text-xs mt-1">
              jika tulisan ini membantumu, nasi goreng bisa membantuku
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <motion.a
              href={DONATION_LINKS.saweria}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-orange-400/40 bg-orange-400/5 hover:bg-orange-400/10 hover:border-orange-400 transition-all duration-200"
            >
              <span className="text-base">♡</span>
              <span className="font-mono text-xs text-orange-400">saweria.co</span>
              <span className="font-mono text-xs text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </motion.a>
          </div>

          <p className="text-slate-700 font-mono text-[10px]">
            {`// xixixi`}
          </p>
        </div>
      </div>
    </motion.section>
  );
}