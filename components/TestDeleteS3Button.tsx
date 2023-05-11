"use client";

import axios from "axios";

export default function TestDeleteS3Button() {
  return (
    <button
      onClick={() => {
        axios.post("api/deleteS3Object", { id: "clhhopf6100016ux4v4ot89cw" });
      }}
      className="bg-slate-900 text-slate-100"
    >
      Test
    </button>
  );
}
