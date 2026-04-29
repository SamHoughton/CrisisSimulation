/**
 * ScenarioDayStrip — shows the fictional day/time position within a scenario.
 *
 * Reads scenarioDay values from all injects to build a strip of labelled day
 * chips. The current day is highlighted in brand green; past days are shown in
 * a faded green; future days are dim. A fictional time is shown to the right.
 *
 * Days >= EPILOGUE_THRESHOLD are excluded from the strip and replaced with
 * an EPILOGUE chip when active (endings that say "30 days on", etc.).
 */
import type { Scenario } from "@/types";
import { cn } from "@/lib/utils";

const EPILOGUE_THRESHOLD = 30;

interface Props {
  scenario: Scenario;
  currentDay?: number;
  currentTime?: string;
  /** Visual size — "sm" for Runner panel, "md" for Present screen */
  size?: "sm" | "md";
}

export function ScenarioDayStrip({ scenario, currentDay, currentTime, size = "md" }: Props) {
  // Derive unique ordered story days, excluding epilogue days
  const storyDays = [
    ...new Set(
      scenario.injects
        .map((i) => i.scenarioDay)
        .filter((d): d is number => d !== undefined && d < EPILOGUE_THRESHOLD)
    ),
  ].sort((a, b) => a - b);

  if (storyDays.length === 0 && currentDay === undefined) return null;

  const isEpilogue = currentDay !== undefined && currentDay >= EPILOGUE_THRESHOLD;
  const isSm = size === "sm";

  return (
    <div className={cn("flex items-center", isSm ? "gap-2" : "gap-3")}>
      {/* Day chips */}
      <div className="flex items-center gap-0">
        {storyDays.map((day, idx) => {
          const isPast    = currentDay !== undefined && day < currentDay && !isEpilogue;
          const isCurrent = currentDay === day && !isEpilogue;
          const connector = idx < storyDays.length - 1;
          const nextDay   = storyDays[idx + 1];
          const isGap     = connector && nextDay !== undefined && nextDay - day > 1;

          return (
            <div key={day} className="flex items-center">
              {/* Chip */}
              <div
                className={cn(
                  "flex items-center justify-center rounded font-bold transition-all duration-300",
                  isSm ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1",
                  isCurrent
                    ? "text-white"
                    : isPast
                    ? "text-crux-green/70"
                    : "text-crux-dim"
                )}
                style={{
                  background: isCurrent
                    ? "#1db86a"
                    : isPast
                    ? "rgba(29,184,106,0.12)"
                    : "rgba(255,255,255,0.04)",
                  border: isCurrent ? "1px solid #1db86a" : "1px solid transparent",
                  minWidth: isSm ? 36 : 44,
                  textAlign: "center",
                }}
              >
                DAY {day}
              </div>

              {/* Connector line */}
              {connector && (
                <div
                  className={cn(
                    "transition-all duration-300",
                    isSm ? "w-3 h-px" : "w-4 h-px",
                    isGap ? "opacity-40" : "opacity-60"
                  )}
                  style={{
                    background: isPast || isCurrent ? "#1db86a" : "#2a2d35",
                    backgroundImage: isGap
                      ? "repeating-linear-gradient(90deg, #1db86a 0px, #1db86a 3px, transparent 3px, transparent 6px)"
                      : undefined,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Epilogue chip */}
        {isEpilogue && (
          <div className="flex items-center">
            {storyDays.length > 0 && (
              <div
                className={cn(isSm ? "w-3 h-px" : "w-4 h-px")}
                style={{ background: "#1db86a" }}
              />
            )}
            <div
              className={cn(
                "flex items-center justify-center rounded font-bold text-white transition-all duration-300",
                isSm ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"
              )}
              style={{ background: "#1db86a", border: "1px solid #1db86a" }}
            >
              EPILOGUE
            </div>
          </div>
        )}
      </div>

      {/* Fictional time */}
      {currentTime && !isEpilogue && (
        <span
          className={cn(
            "font-mono font-bold tabular-nums",
            isSm ? "text-xs" : "text-sm"
          )}
          style={{ color: "#1db86a" }}
        >
          {currentTime}
        </span>
      )}
    </div>
  );
}
