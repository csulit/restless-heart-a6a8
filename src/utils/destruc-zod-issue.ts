import type { ZodIssue } from "zod";

export function destrucZodIssue(errors: ZodIssue[]) {
  const expected =
    errors[0].code === "invalid_type" ? errors[0].expected : undefined;
  return {
    code: errors[0].code,
    path: errors[0].path[0],
    expected,
  };
}
