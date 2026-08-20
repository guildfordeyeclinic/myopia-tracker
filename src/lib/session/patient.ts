import type { FormValues } from "@/components/MeasurementForm";
import type { Ethnicity, Sex } from "@/lib/al/types";

export const PATIENT_STORAGE_KEY = "myopia-tracker.patient.v1";

export type KMode = "radius" | "diopters";

export interface EyeFields {
  al: string;
  lt: string;
  k: string;
  kSteep: string;
  kFlat: string;
  se: string;
  acd: string;
  cct: string;
}

export interface PatientSession {
  age: string;
  sex: Sex;
  ethnicity: Ethnicity;
  kMode: KMode;
  od: EyeFields;
  os: EyeFields;
}

export const emptyEye: EyeFields = {
  al: "",
  lt: "",
  k: "",
  kSteep: "",
  kFlat: "",
  se: "",
  acd: "",
  cct: "",
};

export const emptyPatient: PatientSession = {
  age: "",
  sex: "male",
  ethnicity: "east_asian",
  kMode: "radius",
  od: { ...emptyEye },
  os: { ...emptyEye },
};

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function parseEye(raw: unknown): EyeFields {
  if (!raw || typeof raw !== "object") return { ...emptyEye };
  const e = raw as Record<string, unknown>;
  return {
    al: asString(e.al),
    lt: asString(e.lt),
    k: asString(e.k),
    kSteep: asString(e.kSteep),
    kFlat: asString(e.kFlat),
    se: asString(e.se),
    acd: asString(e.acd),
    cct: asString(e.cct),
  };
}

export function parsePatient(json: string): PatientSession {
  try {
    const raw = JSON.parse(json) as Record<string, unknown>;
    const sex = raw.sex === "female" ? "female" : "male";
    const ethnicity = raw.ethnicity === "european" ? "european" : "east_asian";
    const kMode = raw.kMode === "diopters" ? "diopters" : "radius";
    return {
      age: asString(raw.age),
      sex,
      ethnicity,
      kMode,
      od: parseEye(raw.od),
      os: parseEye(raw.os),
    };
  } catch {
    return { ...emptyPatient, od: { ...emptyEye }, os: { ...emptyEye } };
  }
}

export function loadPatient(): PatientSession {
  if (typeof window === "undefined") return emptyPatient;
  try {
    const raw = window.localStorage.getItem(PATIENT_STORAGE_KEY);
    if (!raw) return { ...emptyPatient, od: { ...emptyEye }, os: { ...emptyEye } };
    return parsePatient(raw);
  } catch {
    return { ...emptyPatient, od: { ...emptyEye }, os: { ...emptyEye } };
  }
}

export function savePatient(patient: PatientSession) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(patient));
  } catch {
    /* ignore quota / private mode */
  }
}

export function toHomeForm(p: PatientSession): FormValues {
  return {
    age: p.age,
    sex: p.sex,
    ethnicity: p.ethnicity,
    alOd: p.od.al,
    alOs: p.os.al,
    crMode: p.kMode === "diopters" ? "k" : "radius",
    cornealOd: p.od.k,
    cornealOs: p.os.k,
    cornealSteepOd: p.od.kSteep,
    cornealFlatOd: p.od.kFlat,
    cornealSteepOs: p.os.kSteep,
    cornealFlatOs: p.os.kFlat,
    ltOd: p.od.lt,
    ltOs: p.os.lt,
  };
}

export function applyHomeForm(
  prev: PatientSession,
  form: FormValues
): PatientSession {
  return {
    ...prev,
    age: form.age,
    sex: form.sex,
    ethnicity: form.ethnicity,
    kMode: form.crMode === "k" ? "diopters" : "radius",
    od: {
      ...prev.od,
      al: form.alOd,
      lt: form.ltOd,
      k: form.cornealOd,
      kSteep: form.cornealSteepOd,
      kFlat: form.cornealFlatOd,
    },
    os: {
      ...prev.os,
      al: form.alOs,
      lt: form.ltOs,
      k: form.cornealOs,
      kSteep: form.cornealSteepOs,
      kFlat: form.cornealFlatOs,
    },
  };
}
