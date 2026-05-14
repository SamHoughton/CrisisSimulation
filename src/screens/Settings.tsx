/**
 * Settings.tsx - Configuration screen.
 *
 * Sections: facilitator profile (name, org), Anthropic API key (with visibility
 * toggle), and local storage management (exercise count, clear all data).
 */

import { useState } from "react";
import { useStore } from "@/store";
import { Save, CheckCircle, Trash2, Moon, Sun } from "lucide-react";

export function Settings() {
  const settings       = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const pastSessions   = useStore((s) => s.pastSessions);

  const [draft, setDraft] = useState(settings);
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
      <div className="mb-8 fade-in-up">
        <h1 className="text-2xl font-semibold text-crux-text">Settings</h1>
        <p className="text-crux-muted text-sm mt-0.5">Configure your facilitator profile and preferences</p>
      </div>

      <div className="space-y-6 stagger">
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

        {/* Appearance */}
        <Card title="Appearance">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-crux-text">Colour theme</p>
              <p className="text-xs text-crux-dim mt-0.5">Choose between dark and light mode</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDraft({ ...draft, theme: "dark" })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border transition-colors ${
                  draft.theme !== "light"
                    ? "bg-crux-elevated border-crux-border-light text-crux-text font-medium"
                    : "border-crux-border text-crux-dim hover:text-crux-muted"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />Dark
              </button>
              <button
                onClick={() => setDraft({ ...draft, theme: "light" })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border transition-colors ${
                  draft.theme === "light"
                    ? "bg-crux-elevated border-crux-border-light text-crux-text font-medium"
                    : "border-crux-border text-crux-dim hover:text-crux-muted"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />Light
              </button>
            </div>
          </div>
        </Card>

        {/* Storage info */}
        <Card title="Local Storage">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-crux-text">
                {pastSessions.length} exercise{pastSessions.length !== 1 ? "s" : ""} stored locally
              </p>
              <p className="text-xs text-crux-dim mt-0.5">
                All data lives in your browser. Export reports to JSON before clearing.
              </p>
            </div>
            <button
              onClick={clearData}
              className="flex items-center gap-1.5 text-xs text-red-400 border border-red-500/30 px-3 py-1.5 rounded hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />Clear All
            </button>
          </div>
        </Card>
      </div>

      <div className="flex justify-end mt-8 fade-in-up">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-crux-green text-white px-5 py-2 rounded text-sm font-medium hover:brightness-110 transition-colors hover:shadow-lg hover:shadow-crux-green/20"
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
    <div className="bg-crux-panel border border-crux-border rounded-xl overflow-hidden fade-in-up">
      <div className="px-5 py-3.5 bg-crux-elevated border-b border-crux-border">
        <h2 className="text-xs font-semibold text-crux-muted uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-crux-dim block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
