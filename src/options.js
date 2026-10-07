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
