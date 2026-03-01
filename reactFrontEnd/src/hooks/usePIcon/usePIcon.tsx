import { useMemo } from "react";
import { PIcon, type PIconName } from "@/components/icons/PIcon";

export function usePIcon(name: PIconName) {
  return useMemo(() => <PIcon name={name} />, [name]);
}
