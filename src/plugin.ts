import { Transformer } from 'unified';
import { map } from 'unist-util-map';
import { toString } from 'mdast-util-to-string';
import React from 'react';

const liquidTagRegex = /(\{%[^%]*%})/g;

type LiquidTagAstTextNode = {
  type: 'text';
  value: string;
};
type LiquidTagAstTagNode = {
  type: 'tag';
  value: {
    type: string;
    url: string;
    options: Record<string, string>;
  };
};
const toLiquidTagAstTagNode = (text: string): LiquidTagAstTagNode => {
  const [type, url, ...tagOptions] = text.replace(/^\{% *| *%}$/g, ' ').trim().split(/ +/);
  return {
    type: 'tag',
    value: {
      type,
      url,
      options: Object.fromEntries(tagOptions.map((option) => option.split('='))) as Record<string, string>,
    },
  };
};
const parseLiquidTagAst = (
  text: string,
): Array<LiquidTagAstTextNode | LiquidTagAstTagNode> => text
  .split(liquidTagRegex)
  .map((part) => {
    if (liquidTagRegex.test(part)) {
      return toLiquidTagAstTagNode(part);
    }
    return {
      type: 'text',
      value: part,
    };
  });

export type RemarkReactLiquidTagProps<
  Options extends Record<string, string> = never,
  Config = unknown> = {
    type: string;
    url: string;
    options: Options;
    config?: Config;
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
>(options: RemarkReactLiquidTagOptions<Props>): Transformer => {
  const { component, config } = options;
  return (tree) => map(tree, (node: any) => {
    if (!component) {
      return node;
    }
    if (node.type !== 'paragraph') {
      return node;
    }
    const text = toString(node);
    if (!liquidTagRegex.test(text)) {
      return node;
    }
    return {
      type: 'element',
      value: React.createElement(
        React.Fragment,
        null,
        parseLiquidTagAst(text).map((part, index) => {
          if (part.type === 'text') {
            return part.value;
          }
          // @ts-ignore
          return React.createElement(component, {
            key: index,
            type: part.value.type,
            url: part.value.url,
            options: part.value.options,
            config: config?.[part.value.type],
          });
        }),
      ),
    };
  });
};

export default remarkReactLiquidTag;
