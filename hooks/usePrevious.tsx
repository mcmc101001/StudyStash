"use client";

import { useState } from "react";

export default function usePrevious(state: number) {
  const [tuple, setTuple] = useState([null, state]);

  if (tuple[1] !== state) {
    setTuple([tuple[1], state]);
  }

  return tuple[0];
}
