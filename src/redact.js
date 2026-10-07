/** Error diagnostics may contain echoed authentication values or wallet passwords. */
export const createRedactor = function createRedactor(secrets) {
  const values = [...new Set(secrets.filter((value) => typeof value === 'string' && value.length > 0))]
    .sort((a, b) => b.length - a.length)
  const pattern = values.length === 0 ? undefined
    : new RegExp(values.map((value) => value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')).join('|'), 'gu')

  const redact = (value) => {
    if (typeof value === 'string') return pattern ? value.replace(pattern, '[redacted]') : value
    if (Array.isArray(value)) return value.map(redact)
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [redact(key), redact(item)]))
    }
    return value
  }

  return redact
}

/** Keep standard cause information without retaining an unredacted error or stack. */
export const redactCause = function redactCause(cause, redact, seen = new Set()) {
  if (!(cause instanceof Error)) return redact(String(cause))
  if (seen.has(cause)) return undefined
  seen.add(cause)
  const safe = new Error(redact(cause.message))
  safe.name = redact(cause.name)
  safe.stack = redact(cause.stack)
  if (cause.code !== undefined) safe.code = redact(cause.code)
  if (cause.cause !== undefined) safe.cause = redactCause(cause.cause, redact, seen)
  if (cause instanceof AggregateError) safe.errors = cause.errors.map((error) => redactCause(error, redact, seen))
  return safe
}
