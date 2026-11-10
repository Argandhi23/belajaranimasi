import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
const highlighter = createHighlighterCore({
  themes: [import('shiki/themes/github-dark.mjs')],
  langs: [import('shiki/langs/tsx.mjs')],
  engine: createJavaScriptRegexEngine(),
});
export async function highlight(source: string) {
  return (await highlighter).codeToHtml(source, {
    lang: 'tsx',
    theme: 'github-dark',
  });
}
