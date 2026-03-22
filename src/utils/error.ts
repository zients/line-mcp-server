/**
 * Format errors from LINE API calls into readable messages.
 *
 * For LINE API errors (with statusCode), returns the HTTP status code.
 * For other errors, returns the error message for debuggability.
 */
export function formatLineError(error: unknown): string {
  if (!(error instanceof Error)) return 'Unknown error';

  const statusCode = (error as Error & { statusCode?: unknown }).statusCode;
  if (typeof statusCode === 'number') {
    return `LINE API error (HTTP ${statusCode})`;
  }

  return error.message;
}
