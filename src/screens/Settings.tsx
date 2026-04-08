import { useState } from "react";
import { useStore } from "@/store";
import { Save, Eye, EyeOff, CheckCircle, Trash2 } from "lucide-react";

export function Settings() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const pastSessions   = useStore((s) => s.pastSessions);

  const [draft, setDraft] = useState(settings);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearData = () => {
    if (!confirm("Delete all saved sessions and scenarios? This cannot be undone.")) return;
    localStorage.removeItem("crisis-tabletop");
    window.location.reload();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configure your facilitator profile and API access</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <Card title="Facilitator Profile">
          <Field label="Your Name">
            <input
              value={draft.facilitatorName}
              onChange={(e) => setDraft({ ...draft, facilitatorName: e.target.value })}
              placeholder="e.g. Jane Smith"
              className="input"
            />
          </Field>
          <Field label="Organisation">
            <input
              value={draft.orgName}
              onChange={(e) => setDraft({ ...draft, orgName: e.target.value })}
              placeholder="e.g. Acme Corp"
              className="input"
            />
          </Field>
        </Card>

        {/* Claude API */}
        <Card title="Anthropic API Key">
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Required for the AI gap analysis in post-exercise reports. Your key is stored
            only in this browser's localStorage — it is never sent anywhere except directly
            to the Anthropic API.{" "}
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get a key →
            </a>
          </p>
          <Field label="API Key">
            <div className="relative">
              <input
                value={draft.claudeApiKey}
                onChange={(e) => setDraft({ ...draft, claudeApiKey: e.target.value })}
                type={showKey ? "text" : "password"}
                placeholder="sk-ant-…"
                className="input pr-10"
              />
              <button
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>
          {draft.claudeApiKey && (
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2">
              <CheckCircle className="w-3.5 h-3.5" />Key configured
            </p>
          )}
        </Card>

        {/* Storage info */}
        <Card title="Local Storage">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-700">
                {pastSessions.length} exercise{pastSessions.length !== 1 ? "s" : ""} stored locally
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                All data lives in your browser. Export reports to JSON before clearing.
              </p>
            </div>
            <button
              onClick={clearData}
              className="flex items-center gap-1.5 text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />Clear All
            </button>
          </div>
        </Card>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {saved ? (
            <><CheckCircle className="w-4 h-4" />Saved!</>
          ) : (
            <><Save className="w-4 h-4" />Save Settings</>
          )}
        </button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

// Inline style via Tailwind utility — add to global CSS or use class
// We use a simple approach: add the .input class via @layer
