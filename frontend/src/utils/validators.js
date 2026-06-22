export const validators = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Invalid email address',
  required: (v) => v?.trim() ? null : 'This field is required',
  minLength: (n) => (v) => v?.length >= n ? null : `Minimum ${n} characters`,
  password: (v) => v?.length >= 8 ? null : 'Password must be at least 8 characters',
}

export function validate(rules, values) {
  const errors = {}
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of [].concat(fieldRules)) {
      const error = rule(values[field] ?? '')
      if (error) { errors[field] = error; break }
    }
  }
  return errors
}
