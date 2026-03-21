import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Github } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-neutral-950/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-labelledby="tsenderIconTitle"
              role="img"
            >
              <title id="tsenderIconTitle">Tsender Logo</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tighter sm:text-3xl text-white">
            Tsender
          </h1>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="https://github.com/Tolu-Mals/tsender"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
            aria-label="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
