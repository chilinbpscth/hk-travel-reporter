const attemptsBySession = new Map<string, number>();
const MAX_ATTEMPTS = 3;

export function consumeImageAttempt(sessionId: string) {
  const used = attemptsBySession.get(sessionId) ?? 0;
  if (used >= MAX_ATTEMPTS) {
    return { allowed: false, remainingAttempts: 0 };
  }
  const next = used + 1;
  attemptsBySession.set(sessionId, next);
  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - next };
}

export function resetImageAttemptsForTests() {
  attemptsBySession.clear();
}
