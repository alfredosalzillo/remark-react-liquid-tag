import { Plugin } from 'unified';
import { map } from 'unist-util-map';
import { toString } from 'mdast-util-to-string';
import { Root } from 'hast';
import React from 'react';

export type RemarkReactLiquidTagProps<Options extends Record<string, string> = never> = {
  type: string;
  url: string;
  options: Options;
};

export type RemarkReactLiquidTagConfig<Props> = Props extends {
  type: infer Type extends string,
  config: infer Config,
}
  ? {
    [K in Type]: Config;
  } : undefined;
export type RemarkReactLiquidTagOptions<Props> = {
  component: React.ElementType<Props>;
  config?: RemarkReactLiquidTagConfig<Props>;
};
const remarkReactLiquidTag = <
  Props = any,
>(options: RemarkReactLiquidTagOptions<Props>): Plugin<[Root]> => {
  const { component, config } = options;
  return (tree: Root) => map(tree, (node: any) => {
    if (!component) {
      return node;
    }
    if (node.type !== 'paragraph') {
      return node;
    }
    const text = toString(node);
    const matches = text.match(/\{%.*%}/g);
    if (matches) {
      const [prev, next] = text.split(matches[0]);
      const [type, url, ...tagOptions] = matches[0]
        .trim()
        .replace('{%', '')
        .replace('%}', '')
        .trim()
        .split(/ +/);
      return {
        type: 'element',
        value: React.createElement(React.Fragment, null, [
          prev,
          // @ts-ignore
          React.createElement(component, {
            key: 'tag',
            type,
            url,
            options: Object.fromEntries(tagOptions.map((option) => option.split('='))),
            config: config?.[type],
          }),
          next,
        ]),
      };
    }
    return node;
  });
};

export default remarkReactLiquidTag;
