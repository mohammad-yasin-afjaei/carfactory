"use client";

import { KeyboardEvent, useEffect, useState } from "react";

import {
  BODY_CONDITION_META,
  BODY_MAP_VIEW_BOX,
  CAR_BODY_PARTS,
  PART_ORDER,
  buildConditionMap,
  serializeConditionMap,
} from "./bodyMapConfig";
import { CarPartSelector } from "./CarPartSelector";
import { CarBodyConditionValue, CarBodyPart } from "./types";

type CarBodyMapProps = {
  value?: CarBodyConditionValue[];
  onChange?: (bodyConditions: CarBodyConditionValue[]) => void;
  className?: string;
  disabled?: boolean;
};

export function CarBodyMap({
  value,
  onChange,
  className = "",
  disabled = false,
}: CarBodyMapProps) {
  const [activePart, setActivePart] = useState<CarBodyPart | null>(null);
  const [conditionMap, setConditionMap] = useState(() => buildConditionMap(value));

  useEffect(() => {
    setConditionMap(buildConditionMap(value));
  }, [value]);

  const activeConfig = CAR_BODY_PARTS.find((item) => item.part === activePart) ?? null;
  const serializedConditions = serializeConditionMap(conditionMap);

  function handlePartClick(part: CarBodyPart) {
    if (disabled) {
      return;
    }

    setActivePart((currentPart) => (currentPart === part ? null : part));
  }

  function updateCondition(part: CarBodyPart, nextCondition: CarBodyConditionValue["condition"]) {
    const nextMap = {
      ...conditionMap,
      [part]: {
        ...conditionMap[part],
        condition: nextCondition,
      },
    };

    setConditionMap(nextMap);
    setActivePart(null);
    onChange?.(serializeConditionMap(nextMap));
  }

  return (
    <div
      className={`rounded-[32px] border border-stone-200 bg-[radial-gradient(circle_at_top,_rgba(254,243,199,0.45),_rgba(255,255,255,0.98)_48%),linear-gradient(180deg,_#fffef8,_#ffffff)] p-5 shadow-[0_28px_80px_rgba(120,53,15,0.08)] ${className}`}
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-700/80">
            Body condition map
          </p>
          <h3 className="text-2xl font-semibold text-slate-900">
            CarBodyMap
          </h3>
          <p className="mt-1 max-w-xl text-sm text-slate-600">
            Click any panel on the SVG car and choose a condition. The component
            emits a `body_conditions` array ready for your Django API.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">{serializedConditions.length}</span>{" "}
          body parts tracked
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_280px]">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(226,232,240,0.45),_transparent_45%)]" />

          <svg
            aria-label="Interactive car body map"
            className="relative z-10 h-auto w-full"
            fill="none"
            viewBox={BODY_MAP_VIEW_BOX}
          >
            <defs>
              <filter
                id="car-shadow"
                colorInterpolationFilters="sRGB"
                height="130%"
                width="130%"
                x="-15%"
                y="-15%"
              >
                <feDropShadow
                  dx="0"
                  dy="14"
                  floodColor="#0f172a"
                  floodOpacity="0.12"
                  stdDeviation="18"
                />
              </filter>
            </defs>

            <ellipse cx="72" cy="204" fill="#0f172a" fillOpacity="0.12" rx="18" ry="64" />
            <ellipse cx="348" cy="204" fill="#0f172a" fillOpacity="0.12" rx="18" ry="64" />
            <ellipse cx="72" cy="550" fill="#0f172a" fillOpacity="0.12" rx="18" ry="72" />
            <ellipse cx="348" cy="550" fill="#0f172a" fillOpacity="0.12" rx="18" ry="72" />

            <path
              d="M120 48 C142 32 176 26 210 26 C244 26 278 32 300 48 L336 104 C350 132 358 188 358 232 L358 530 C358 574 350 630 336 658 L300 712 C278 728 244 734 210 734 C176 734 142 728 120 712 L84 658 C70 630 62 574 62 530 L62 232 C62 188 70 132 84 104 Z"
              fill="#e2e8f0"
              filter="url(#car-shadow)"
              stroke="#cbd5e1"
              strokeWidth="2"
            />

            {CAR_BODY_PARTS.map((partConfig) => {
              const currentCondition = conditionMap[partConfig.part];
              const fillColor = BODY_CONDITION_META[currentCondition.condition].color;
              const isActive = activePart === partConfig.part;
              const sharedProps = {
                className: disabled ? "opacity-70" : "cursor-pointer",
                onClick: () => handlePartClick(partConfig.part),
                role: "button" as const,
                stroke: isActive ? "#0f172a" : "#ffffff",
                strokeWidth: isActive ? 4 : 3,
                style: {
                  fill: fillColor,
                  transition: "fill 220ms ease, stroke 220ms ease, opacity 220ms ease",
                },
                tabIndex: disabled ? -1 : 0,
                onKeyDown: (event: KeyboardEvent<SVGElement>) => {
                  if (disabled) {
                    return;
                  }

                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handlePartClick(partConfig.part);
                  }
                },
              };

              return partConfig.shape.type === "rect" ? (
                <rect
                  key={partConfig.part}
                  aria-label={partConfig.label}
                  {...sharedProps}
                  height={partConfig.shape.height}
                  rx={partConfig.shape.rx}
                  width={partConfig.shape.width}
                  x={partConfig.shape.x}
                  y={partConfig.shape.y}
                />
              ) : (
                <path
                  key={partConfig.part}
                  aria-label={partConfig.label}
                  {...sharedProps}
                  d={partConfig.shape.d}
                />
              );
            })}
          </svg>

          {activeConfig ? (
            <CarPartSelector
              label={activeConfig.label}
              onClose={() => setActivePart(null)}
              onSelect={(condition) => updateCondition(activeConfig.part, condition)}
              position={activeConfig.selectorPosition}
              selectedCondition={conditionMap[activeConfig.part].condition}
            />
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Color legend
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(BODY_CONDITION_META).map(([condition, meta]) => (
                <div
                  key={condition}
                  className={`rounded-2xl border px-3 py-2 text-xs font-medium ${meta.badgeClassName} ${meta.textClassName}`}
                >
                  <span
                    className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  {meta.label}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              API payload
            </p>
            <div className="mt-3 max-h-[360px] space-y-2 overflow-auto pr-1">
              {PART_ORDER.map((part) => {
                const item = conditionMap[part];
                const meta = BODY_CONDITION_META[item.condition];

                return (
                  <div
                    key={part}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-slate-700">{part}</span>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badgeClassName} ${meta.textClassName}`}
                    >
                      {item.condition}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
