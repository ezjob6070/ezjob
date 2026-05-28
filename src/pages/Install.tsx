import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Share, Plus, MoreVertical, Download, Check } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "ios" | "android" | "desktop" | "unknown";

const detectPlatform = (): Platform => {
  if (typeof window === "undefined") return "unknown";
  const ua = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  if (/macintosh|windows|linux/.test(ua)) return "desktop";
  return "unknown";
};

const Install = () => {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(isStandalone);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <Card className="w-full max-w-lg p-8 shadow-lg">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="/icon-192.png"
            alt="EZ Job"
            width={96}
            height={96}
            className="rounded-2xl shadow-md mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Install EZ Job</h1>
          <p className="text-gray-600 mt-2">
            Add EZ Job to your home screen for a fast, full-screen app experience.
          </p>
        </div>

        {installed ? (
          <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-lg p-4">
            <Check className="h-5 w-5" />
            <span className="font-medium">App is installed</span>
          </div>
        ) : (
          <>
            {installPrompt && (
              <Button onClick={handleInstall} className="w-full mb-4 bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}

            {platform === "ios" && (
              <div className="space-y-3 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">On iPhone / iPad (Safari):</p>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600">1.</span>
                  <span className="flex items-center gap-1">
                    Tap the <Share className="inline h-4 w-4" /> Share button at the bottom.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600">2.</span>
                  <span className="flex items-center gap-1">
                    Scroll and tap <Plus className="inline h-4 w-4" /> "Add to Home Screen".
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>Tap "Add" in the top-right corner.</span>
                </div>
              </div>
            )}

            {platform === "android" && !installPrompt && (
              <div className="space-y-3 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">On Android (Chrome):</p>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600">1.</span>
                  <span className="flex items-center gap-1">
                    Tap the <MoreVertical className="inline h-4 w-4" /> menu in the top-right.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>Tap "Install app" or "Add to Home screen".</span>
                </div>
              </div>
            )}

            {(platform === "desktop" || platform === "unknown") && !installPrompt && (
              <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 flex gap-3">
                <Smartphone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span>
                  Open this page on your phone to install. On desktop Chrome, click the
                  install icon in the address bar.
                </span>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Install;
