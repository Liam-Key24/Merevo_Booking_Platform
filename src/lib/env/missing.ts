/**
 * Clear configuration errors for missing env vars.
 * In development the message points at .env.example; in production it stays generic.
 */

export class MissingEnvError extends Error {
  readonly varName: string;

  constructor(varName: string) {
    const isDev = process.env.NODE_ENV !== "production";
    super(
      isDev
        ? `Missing environment variable: ${varName}. Copy .env.example to .env.local and fill every required value, then restart the dev server.`
        : `Server configuration error (${varName}).`,
    );
    this.name = "MissingEnvError";
    this.varName = varName;
  }
}

export function isMissingEnvError(error: unknown): error is MissingEnvError {
  return (
    error instanceof MissingEnvError ||
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name: string }).name === "MissingEnvError")
  );
}

export function missingEnvDescription(error: MissingEnvError): string {
  if (process.env.NODE_ENV === "production") {
    return "The server is missing required configuration. Contact Merevo.";
  }
  return error.message;
}
