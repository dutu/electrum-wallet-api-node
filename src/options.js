export const requireOptions = function requireOptions(options) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Options must be an object')
  }

  return options
}

export const requireString = function requireString(value, name) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${name} must be a non-empty string`)
  }

  return value
}

export const requireTimeout = function requireTimeout(timeout) {
  if (!Number.isInteger(timeout) || timeout < 1 || timeout > 2147483647) {
    throw new TypeError('timeout must be an integer between 1 and 2147483647')
  }

  return timeout
}

/** Request configuration is local and deliberately limited to timeout and signal. */
export const requireRequestOptions = function requireRequestOptions(options) {
  requireOptions(options)
  if (Reflect.ownKeys(options).some((key) => key !== 'timeout' && key !== 'signal')) {
    throw new TypeError('Request options only support timeout and signal')
  }

  const { timeout, signal } = options
  if (timeout !== undefined) requireTimeout(timeout)
  if (signal !== undefined && (signal === null || typeof signal !== 'object'
    || typeof signal.aborted !== 'boolean' || typeof signal.addEventListener !== 'function'
    || typeof signal.removeEventListener !== 'function')) {
    throw new TypeError('signal must be an AbortSignal')
  }

  return { timeout, signal }
}

/** Map only top-level aliases. RPC values and additional parameters are untouched. */
export const mapParameters = function mapParameters(params = {}, aliases = {}) {
  requireOptions(params)
  const mapped = Object.create(null)

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    const name = Object.hasOwn(aliases, key) ? aliases[key] : key

    if (Object.hasOwn(mapped, name)) {
      throw new TypeError('Pass each parameter once, using either its JavaScript or RPC name')
    }

    mapped[name] = value
  }

  return mapped
}
