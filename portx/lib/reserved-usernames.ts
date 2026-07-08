export const RESERVED = new Set([
  "api","admin","app","www","dashboard","pricing","login","logout","sign-in",
  "sign-up","settings","about","blog","docs","help","support","terms","privacy",
  "static","assets","public","Portzx","resume","templates","onboarding",
]);

export const USERNAME_RE = /^[a-z0-9-]{3,30}$/;

export function isValidUsername(u: string) {
  return USERNAME_RE.test(u) && !RESERVED.has(u);
}
