/**
 * Validação de CPF conforme algoritmo dos dígitos verificadores.
 * Exemplos: 111.444.777-05 (inválido), 111.444.777-35 (válido).
 */
export function validateCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * Number(digits[i]);
  }
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += (11 - i) * Number(digits[i]);
  }
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  if (d2 !== Number(digits[10])) return false;

  return true;
}
