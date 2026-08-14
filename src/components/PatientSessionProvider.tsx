"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  emptyPatient,
  loadPatient,
  PATIENT_STORAGE_KEY,
  parsePatient,
  savePatient,
  type PatientSession,
} from "@/lib/session/patient";

type PatientUpdater =
  | PatientSession
  | ((prev: PatientSession) => PatientSession);

const PatientSessionContext = createContext<{
  patient: PatientSession;
  setPatient: (next: PatientUpdater) => void;
  ready: boolean;
} | null>(null);

export function PatientSessionProvider({ children }: { children: ReactNode }) {
  const [patient, setPatientState] = useState<PatientSession>(emptyPatient);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPatientState(loadPatient());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    savePatient(patient);
  }, [patient, ready]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== PATIENT_STORAGE_KEY || e.newValue == null) return;
      setPatientState(parsePatient(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setPatient = useCallback((next: PatientUpdater) => {
    setPatientState((prev) => (typeof next === "function" ? next(prev) : next));
  }, []);

  return (
    <PatientSessionContext.Provider value={{ patient, setPatient, ready }}>
      {children}
    </PatientSessionContext.Provider>
  );
}

export function usePatientSession() {
  const ctx = useContext(PatientSessionContext);
  if (!ctx) {
    throw new Error("usePatientSession must be used inside PatientSessionProvider");
  }
  return ctx;
}
