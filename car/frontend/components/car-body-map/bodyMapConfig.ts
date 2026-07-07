import {
  BodyConditionMeta,
  BodyConditionStatus,
  CarBodyConditionValue,
  CarBodyPart,
  CarBodyPartConfig,
} from "./types";

export const BODY_MAP_VIEW_BOX = "0 0 420 760";
export const BODY_MAP_WIDTH = 420;
export const BODY_MAP_HEIGHT = 760;

export const BODY_CONDITION_META: Record<BodyConditionStatus, BodyConditionMeta> = {
  healthy: {
    label: "Healthy",
    color: "#22c55e",
    textClassName: "text-emerald-700",
    badgeClassName: "bg-emerald-50 border-emerald-200",
  },
  painted: {
    label: "Painted",
    color: "#f97316",
    textClassName: "text-orange-700",
    badgeClassName: "bg-orange-50 border-orange-200",
  },
  replaced: {
    label: "Replaced",
    color: "#ef4444",
    textClassName: "text-rose-700",
    badgeClassName: "bg-rose-50 border-rose-200",
  },
  scratch: {
    label: "Scratch",
    color: "#eab308",
    textClassName: "text-yellow-700",
    badgeClassName: "bg-yellow-50 border-yellow-200",
  },
  dent: {
    label: "Dent",
    color: "#8b5cf6",
    textClassName: "text-violet-700",
    badgeClassName: "bg-violet-50 border-violet-200",
  },
  repaired: {
    label: "Repaired",
    color: "#3b82f6",
    textClassName: "text-blue-700",
    badgeClassName: "bg-blue-50 border-blue-200",
  },
  unknown: {
    label: "Unknown",
    color: "#94a3b8",
    textClassName: "text-slate-600",
    badgeClassName: "bg-slate-50 border-slate-200",
  },
};

export const CAR_BODY_PARTS: CarBodyPartConfig[] = [
  {
    part: "rear_bumper",
    label: "Rear bumper",
    selectorPosition: { x: 210, y: 70 },
    shape: {
      type: "path",
      d: "M138 40 Q210 18 282 40 L302 78 Q210 96 118 78 Z",
    },
  },
  {
    part: "trunk",
    label: "Trunk",
    selectorPosition: { x: 210, y: 140 },
    shape: {
      type: "rect",
      x: 122,
      y: 92,
      width: 176,
      height: 88,
      rx: 24,
    },
  },
  {
    part: "rear_left_fender",
    label: "Rear left fender",
    selectorPosition: { x: 104, y: 178 },
    shape: {
      type: "path",
      d: "M92 96 Q68 122 72 214 L118 214 L118 96 Z",
    },
  },
  {
    part: "rear_right_fender",
    label: "Rear right fender",
    selectorPosition: { x: 316, y: 178 },
    shape: {
      type: "path",
      d: "M328 96 Q352 122 348 214 L302 214 L302 96 Z",
    },
  },
  {
    part: "roof",
    label: "Roof",
    selectorPosition: { x: 210, y: 270 },
    shape: {
      type: "rect",
      x: 136,
      y: 206,
      width: 148,
      height: 128,
      rx: 26,
    },
  },
  {
    part: "rear_left_door",
    label: "Rear left door",
    selectorPosition: { x: 120, y: 296 },
    shape: {
      type: "rect",
      x: 92,
      y: 236,
      width: 56,
      height: 122,
      rx: 18,
    },
  },
  {
    part: "rear_right_door",
    label: "Rear right door",
    selectorPosition: { x: 300, y: 296 },
    shape: {
      type: "rect",
      x: 272,
      y: 236,
      width: 56,
      height: 122,
      rx: 18,
    },
  },
  {
    part: "front_left_door",
    label: "Front left door",
    selectorPosition: { x: 120, y: 432 },
    shape: {
      type: "rect",
      x: 92,
      y: 370,
      width: 56,
      height: 128,
      rx: 18,
    },
  },
  {
    part: "front_right_door",
    label: "Front right door",
    selectorPosition: { x: 300, y: 432 },
    shape: {
      type: "rect",
      x: 272,
      y: 370,
      width: 56,
      height: 128,
      rx: 18,
    },
  },
  {
    part: "front_left_fender",
    label: "Front left fender",
    selectorPosition: { x: 102, y: 562 },
    shape: {
      type: "path",
      d: "M92 512 L148 512 L148 618 L72 618 Q64 564 92 512 Z",
    },
  },
  {
    part: "front_right_fender",
    label: "Front right fender",
    selectorPosition: { x: 318, y: 562 },
    shape: {
      type: "path",
      d: "M328 512 L272 512 L272 618 L348 618 Q356 564 328 512 Z",
    },
  },
  {
    part: "hood",
    label: "Hood",
    selectorPosition: { x: 210, y: 566 },
    shape: {
      type: "rect",
      x: 122,
      y: 506,
      width: 176,
      height: 126,
      rx: 24,
    },
  },
  {
    part: "front_bumper",
    label: "Front bumper",
    selectorPosition: { x: 210, y: 674 },
    shape: {
      type: "path",
      d: "M118 642 Q210 620 302 642 L286 706 Q210 730 134 706 Z",
    },
  },
];

export const PART_ORDER = CAR_BODY_PARTS.map((item) => item.part);
export const CONDITION_ORDER: BodyConditionStatus[] = [
  "healthy",
  "painted",
  "replaced",
  "scratch",
  "dent",
  "repaired",
  "unknown",
];

export function buildConditionMap(
  value: CarBodyConditionValue[] = [],
): Record<CarBodyPart, CarBodyConditionValue> {
  const defaultMap = {} as Record<CarBodyPart, CarBodyConditionValue>;

  PART_ORDER.forEach((part) => {
    defaultMap[part] = {
      part,
      condition: "unknown",
      description: "",
    };
  });

  value.forEach((item) => {
    defaultMap[item.part] = {
      part: item.part,
      condition: item.condition,
      description: item.description ?? "",
    };
  });

  return defaultMap;
}

export function serializeConditionMap(
  conditionMap: Record<CarBodyPart, CarBodyConditionValue>,
): CarBodyConditionValue[] {
  return PART_ORDER.map((part) => conditionMap[part]);
}

