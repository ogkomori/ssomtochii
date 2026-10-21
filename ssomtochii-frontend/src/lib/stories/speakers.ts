import type { Speaker } from "./types";

/** Reusable speakers for story beats. Add more exports here as needed. */
export const SOMTO: Speaker = {
  id: "somto",
  label: "Somto",
  color: "#C56B91",
};

export const TEGA: Speaker = {
  id: "tega",
  label: "Tega",
  color: "#557DA8",
};

/** Use when Tega is speaking off-screen during a phone call. */
export const TEGA_ON_PHONE: Speaker = {
  ...TEGA,
  label: "Tega · On the phone",
};

export const GIRLFRIEND: Speaker = {
  id: "girlfriend",
  label: "Her",
  color: "#C56B91",
};
