export class ConfigurationError extends Error {
  readonly missing: readonly string[];

  constructor(missing: readonly string[]) {
    const list = missing.join(", ");
    super(
      `VISION is missing required environment variables: ${list}. Copy .env.example to .env.local and fill in values from your dedicated VISION Supabase project.`,
    );
    this.name = "ConfigurationError";
    this.missing = missing;
  }
}
