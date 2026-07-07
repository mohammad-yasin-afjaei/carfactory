"use client";

import {
  BODY_CONDITION_META,
  BODY_MAP_HEIGHT,
  BODY_MAP_WIDTH,
  CONDITION_ORDER,
} from "./bodyMapConfig";
import { BodyConditionStatus, SelectorPosition } from "./types";

type CarPartSelectorProps = {
  label: string;
  position: SelectorPosition;
  selectedCondition: BodyConditionStatus;
  onSelect: (condition: BodyConditionStatus) => void;
  onClose: () => void;
};

export function CarPartSelector({
  label,
  position,
  selectedCondition,
  onSelect,
  onClose,
}: CarPartSelectorProps) {
  return (
    <div
      className="absolute z-20 w-56 -translate-x-1/2 -translate-y-[108%] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_22px_60px_rgba(15,23,42,0.16)] backdrop-blur"
      style={{
        left: `${(position.x / BODY_MAP_WIDTH) * 100}%`,
        top: `${(position.y / BODY_MAP_HEIGHT) * 100}%`,
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Body part
          </p>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
        </div>
        <button
          className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {CONDITION_ORDER.map((condition) => {
          const meta = BODY_CONDITION_META[condition];
          const isActive = selectedCondition === condition;

          return (
            <button
              key={condition}
              className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition ${
                isActive
                  ? "border-slate-900 shadow-sm"
                  : "border-slate-200 hover:border-slate-300"
              } ${meta.badgeClassName} ${meta.textClassName}`}
              onClick={() => onSelect(condition)}
              style={{
                boxShadow: isActive ? `0 0 0 1px ${meta.color}` : undefined,
              }}
              type="button"
            >
              <span
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
                style={{ backgroundColor: meta.color }}
              />
              {meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

