import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function PwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setShowHelp(false);
    };

    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      setShowHelp((visible) => !visible);
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (choice.outcome === "accepted") setShowHelp(false);
  };

  if (installed) return null;

  return (
    <div className="mx-auto mt-4 w-full max-w-xs text-center">
      <button
        type="button"
        onClick={handleInstall}
        className="rounded-full border border-foreground/20 bg-white/75 px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-white"
      >
        {installPrompt ? "Install app ♡" : "Add to home screen ♡"}
      </button>
      {showHelp && (
        <div className="mt-3 rounded-2xl border border-foreground/10 bg-white/90 p-4 text-left text-sm text-foreground shadow-sm">
          <p className="font-semibold">Add 16 Days of Somto</p>
          <p className="mt-1">In Chrome, tap ⋮ and choose “Add to home screen” or “Install app”. If “Install app” doesn't work, choose “Create shortcut” if it is offered.</p>
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            className="mt-3 text-sm font-semibold underline underline-offset-2"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
