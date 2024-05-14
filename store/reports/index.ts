import { getUserReports } from "@/services/report";
import { atom } from "jotai";

export const reportsAtom = atom(getUserReports());
