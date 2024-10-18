export function getPlural(count: number, form1: string, form2: string, form5: string) {
  count = Math.abs(count) % 100;
  const lastDigit = count % 10;

  if (count > 10 && count < 20) {
    return form5;
  }
  if (lastDigit > 1 && lastDigit < 5) {
    return form2;
  }
  if (lastDigit === 1) {
    return form1;
  }
  return form5;
}
