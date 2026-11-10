const stopwords = new Set(
  'bagaimana cara membuat buat saya ingin mau yang dan di ke dari untuk dengan saat ketika animasi sebuah bisa agar adalah lalu tersebut itu ini kemudian'.split(
    ' ',
  ),
);
export function searchTokens(query: string): string[] {
  const words =
    query
      .toLocaleLowerCase('id')
      .normalize('NFKC')
      .match(/[\p{L}\p{N}]+/gu) ?? [];
  return [
    ...new Set(
      words.map((word) =>
        word.length > 5 && word.endsWith('nya') ? word.slice(0, -3) : word,
      ),
    ),
  ]
    .filter((word) => !stopwords.has(word))
    .slice(0, 20);
}
