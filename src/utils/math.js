export function getDefaultIfInvalid(value, defaultValue) {
  return value === undefined || Number.isNaN(value) ? defaultValue : value
}

export function isNumber(value) {
  return !isNaN(Number(value))
}

export function allValuesEmptyString(obj) {
  const keys = Object.keys(obj)
  return keys.length > 0 && keys.every((key) => obj[key] === '')
}
