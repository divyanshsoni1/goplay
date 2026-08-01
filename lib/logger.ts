/**
 * lib/logger.ts
 * Structured logger — writes JSON lines to stdout/stderr.
 * Swap the transport (e.g. Axiom, Datadog) by replacing `output()`.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

function output(entry: LogEntry): void {
  const line = JSON.stringify(entry);
  if (entry.level === "error" || entry.level === "warn") {
    console.error(line);
  } else {
    console.log(line);
  }
}

function log(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
): void {
  // Skip debug logs in production to reduce noise
  if (level === "debug" && process.env.NODE_ENV === "production") return;

  output({
    level,
    message,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    ...meta,
  });
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) =>
    log("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>) =>
    log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) =>
    log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) =>
    log("error", message, meta),
};
