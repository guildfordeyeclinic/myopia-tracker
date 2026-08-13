import type { Ethnicity, ReferenceSet, Sex } from "@/lib/al/types";
import { eastAsianReference } from "./east_asian";
import { europeanReference } from "./european";

export const REFERENCES: Record<Ethnicity, ReferenceSet> = {
  european: europeanReference,
  east_asian: eastAsianReference,
};

export function getReference(ethnicity: Ethnicity): ReferenceSet {
  return REFERENCES[ethnicity];
}

export function getSexCurves(ethnicity: Ethnicity, sex: Sex) {
  const ref = getReference(ethnicity);
  return sex === "male" ? ref.male : ref.female;
}

export const CLINIC_URL = "https://guildfordeyeclinic.ca";
export const CLINIC_NAME = "Guildford Eye Clinic";
