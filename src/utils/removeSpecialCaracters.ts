export function removeSpeciaCaracteresAndLetters(string: string): string {
  const formatedString = string
    .replace(/[ÀÁÂÃÄÅ]/g, 'A')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[ÈÉÊËÊ]/g, 'E')
    .replace(/[éèê]/g, 'e')
    .replace(/[ìíî]/g, 'i')
    .replace(/[õóòô]/g, 'o')
    .replace(/[uùúû]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9 ]/gi, ' ')
    .toLowerCase()

  return formatedString
}
