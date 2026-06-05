/**
 * Target-resolution helpers for the single-target messaging tools.
 *
 * `resolveTarget` decides the effective `to` for a push: an explicit value
 * always wins, otherwise the configured DEFAULT_UID is used, otherwise an error.
 *
 * `parseDefaultUid` validates the DEFAULT_UID environment variable once at
 * startup so the `process.exit` decision stays out of this pure function.
 */

export type ResolvedTarget =
  | { ok: true; to: string }
  | { ok: false; error: string };

/**
 * Resolve the effective target for a single-target push.
 * - explicit `to` wins (already format-validated by Zod at the tool boundary)
 * - else fall back to `defaultUid`
 * - else return a friendly error
 */
export function resolveTarget(
  to: string | undefined,
  defaultUid: string | undefined,
): ResolvedTarget {
  const target = to || defaultUid;
  if (!target) {
    return {
      ok: false,
      error:
        'No target specified. Pass "to" or set the DEFAULT_UID environment variable.',
    };
  }
  return { ok: true, to: target };
}

export type ParsedDefaultUid =
  | { ok: true; value: string | undefined }
  | { ok: false; error: string };

/**
 * Parse and validate the DEFAULT_UID environment variable at startup.
 * - undefined / empty / whitespace-only -> no default configured
 * - trimmed value not starting with "U" -> error (caller should exit)
 * - trimmed value starting with "U"      -> that trimmed value is the default
 *
 * Validation is prefix-only, matching the existing `targetId` schema.
 */
export function parseDefaultUid(raw: string | undefined): ParsedDefaultUid {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return { ok: true, value: undefined };
  }
  if (!trimmed.startsWith('U')) {
    return {
      ok: false,
      error: `DEFAULT_UID must be a User ID starting with "U". Got: ${trimmed}`,
    };
  }
  return { ok: true, value: trimmed };
}
