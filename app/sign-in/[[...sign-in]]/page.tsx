import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="cyber-grid-bg min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-xs tracking-widest text-[#00ff88]/50 mb-2"
            style={{ fontFamily: "Share Tech Mono, monospace" }}>
            // AUTHENTICATION REQUIRED
          </div>
          <h1 className="text-2xl font-black text-white"
            style={{ fontFamily: "Orbitron, monospace" }}>
            ACCESS <span className="text-[#00ff88]">CODEFLEX</span>
          </h1>
        </div>
        <SignIn appearance={{
          elements: {
            card: "bg-[#0a1520] border border-[#00ff88]/15 shadow-none rounded-none",
            headerTitle: "text-white",
            headerSubtitle: "text-white/40",
            socialButtonsBlockButton: "border border-white/10 bg-[#0f1f2d] text-white rounded-none",
            formFieldInput: "bg-[#060d12] border border-white/10 text-white rounded-none focus:border-[#00ff88]/40",
            formFieldLabel: "text-white/50 text-xs tracking-wider",
            formButtonPrimary: "bg-[#00ff88] text-[#020408] font-bold text-xs tracking-widest rounded-none hover:bg-[#00ff88]/90",
            footerActionLink: "text-[#00ff88]",
          },
        }} />
      </div>
    </main>
  );
}