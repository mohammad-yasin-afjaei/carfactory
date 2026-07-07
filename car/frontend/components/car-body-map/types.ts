export type CarBodyPart =
  | "hood"
  | "roof"
  | "trunk"
  | "front_bumper"
  | "rear_bumper"
  | "front_right_fender"
  | "rear_right_fender"
  | "front_left_fender"
  | "rear_left_fender"
  | "front_right_door"
  | "rear_right_door"
  | "front_left_door"
  | "rear_left_door";

export type BodyConditionStatus =
  | "healthy"
  | "painted"
  | "replaced"
  | "scratch"
  | "dent"
  | "repaired"
  | "unknown";

export type CarBodyConditionValue = {
  part: CarBodyPart;
  condition: BodyConditionStatus;
  description: string;
};

export type SelectorPosition = {
  x: number;
  y: number;
};

type RectShape = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
};

type PathShape = {
  type: "path";
  d: string;
};

export type CarBodyPartShape = RectShape | PathShape;

export type CarBodyPartConfig = {
  part: CarBodyPart;
  label: string;
  selectorPosition: SelectorPosition;
  shape: CarBodyPartShape;
};

export type BodyConditionMeta = {
  label: string;
  color: string;
  textClassName: string;
  badgeClassName: string;
};

