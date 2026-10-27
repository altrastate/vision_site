type LogFields = Record<string, string | number | boolean | null | undefined>;

function write(level: "info" | "warn" | "error", message: string, fields?: LogFields): void {
  const payload = {
    service: "vision",
    level,
    message,
    ...fields,
    at: new Date().toISOString(),
  };

  if (level === "error") {
    console.error(payload);
    return;
  }
  if (level === "warn") {
    console.warn(payload);
    return;
  }
  console.info(payload);
}

export const logger = {
  info: (message: string, fields?: LogFields) => write("info", message, fields),
  warn: (message: string, fields?: LogFields) => write("warn", message, fields),
  error: (message: string, fields?: LogFields) => write("error", message, fields),
};
