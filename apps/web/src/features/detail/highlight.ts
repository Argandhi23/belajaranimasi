import { createHighlighterCore, type ThemeRegistration } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const monochromeDark: ThemeRegistration = {
  name: 'monochrome-dark',
  type: 'dark',
  colors: {
    'editor.background': '#09090b',
    'editor.foreground': '#e4e4e7',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#71717a', fontStyle: 'italic' },
    },
    {
      scope: [
        'keyword',
        'storage.type',
        'storage.modifier',
        'constant.language',
        'entity.name.tag',
      ],
      settings: { foreground: '#ffffff', fontStyle: 'bold' },
    },
    {
      scope: ['string', 'string.template', 'punctuation.definition.string'],
      settings: { foreground: '#d4d4d8' },
    },
    {
      scope: [
        'entity.name.function',
        'support.function',
        'entity.name.type',
        'support.type',
        'entity.other.attribute-name',
      ],
      settings: { foreground: '#f4f4f5' },
    },
    {
      scope: ['constant.numeric', 'variable.other.property', 'meta.property'],
      settings: { foreground: '#a1a1aa' },
    },
    {
      scope: ['punctuation', 'meta.brace', 'keyword.operator'],
      settings: { foreground: '#a1a1aa' },
    },
  ],
};

const highlighter = createHighlighterCore({
  themes: [monochromeDark],
  langs: [import('shiki/langs/tsx.mjs')],
  engine: createJavaScriptRegexEngine(),
});

export async function highlight(source: string) {
  return (await highlighter).codeToHtml(source, {
    lang: 'tsx',
    theme: 'monochrome-dark',
  });
}
