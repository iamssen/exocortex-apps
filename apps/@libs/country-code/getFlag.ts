export function getFlag(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replaceAll(/./g, (char) =>
      String.fromCodePoint((char.codePointAt(0) as number) + 127_397),
    );
}
