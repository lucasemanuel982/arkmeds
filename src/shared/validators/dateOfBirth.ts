/**
 * Validação de data de nascimento: deve ser uma data válida e não futura.
 */

export function validateDateOfBirth(value: string): boolean {
  if (!value || typeof value !== "string") return false;

  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  if (date > new Date()) return false;

  const [y, m, d] = value.split(/[-T]/).map(Number);
  if (!y || !m || m < 1 || m > 12 || !d || d < 1) return false;
  const lastDay = new Date(y, m, 0).getDate();
  return d <= lastDay;
}
