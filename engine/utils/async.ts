// engine/utils/async.ts

export function wait(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

export async function retry<T>(
  task: () => Promise<T>,
  attempts = 3,
  delayMs = 300
): Promise<T> {
  let error: any;

  for (let i = 0; i < attempts; i++) {
    try {
      return await task();
    } catch (err) {
      error = err;
      if (i < attempts - 1) await wait(delayMs);
    }
  }
  throw error;
}
