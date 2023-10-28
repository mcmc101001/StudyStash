import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function isValidBody<T extends z.ZodTypeAny>(
  body: any,
  schema: T
): body is z.infer<typeof schema> {
  const { success } = schema.safeParse(body);
  return success;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function startsWithNumbers(str: string) {
  return /^[0-9].*$/.test(str);
}

export function trimUntilNumber(inputString: string) {
  while (inputString.length > 0 && !startsWithNumbers(inputString)) {
    inputString = inputString.substring(1);
  }
  return inputString;
}

const dateFormatter = new Intl.RelativeTimeFormat("en-SG", {
  numeric: "auto",
});

const DIVISIONS = [
  { amount: 60, name: "seconds" as const },
  { amount: 60, name: "minutes" as const },
  { amount: 24, name: "hours" as const },
  { amount: 7, name: "days" as const },
  { amount: 4.34524, name: "weeks" as const },
  { amount: 12, name: "months" as const },
  { amount: Number.POSITIVE_INFINITY, name: "years" as const },
];

export function formatTimeAgo(date: Date) {
  let duration = (date.getTime() - new Date().getTime()) / 1000;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return dateFormatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}
