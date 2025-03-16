import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import * as prod from 'react/jsx-runtime';
import dedent from 'dedent';
import { renderToString } from 'react-dom/server';
import remarkReactLiquidTag from './plugin';

describe('remark-react-liquid-tag', () => {
  it('should not parse non liquid tag', async () => {
    const Component = jest.fn()
      .mockImplementation(({ type, url, options }) => `${type} ${url} ${Object.entries(options).map((entry) => entry.join('=')).join(' ')}`);
    const { result } = unified()
      .use(remarkParse)
      .use(remarkReactLiquidTag, {
        component: Component,
      })
      .use(remarkToRehype)
      .use(rehypeReact, prod)
      .processSync(dedent`
        # Hello World
        This is an example markdown file.
      `);
    renderToString(result);
    expect(Component).not.toHaveBeenCalled();
  });
  it('should parse liquid tag', async () => {
    const Component = jest.fn()
      .mockImplementation(({ type, url, options }) => `${type} ${url} ${Object.entries(options).map((entry) => entry.join('=')).join(' ')}`);
    const { result } = unified()
      .use(remarkParse)
      .use(remarkReactLiquidTag, {
        component: Component,
      })
      .use(remarkToRehype)
      .use(rehypeReact, prod)
      .processSync(dedent`
        # Hello World
        This is an example markdown file.
        {% link https://example.com text=Example %}
      `);
    renderToString(result);
    expect(Component).toHaveBeenCalledTimes(1);
    expect(Component).toHaveBeenCalledWith({
      type: 'link',
      url: 'https://example.com',
      options: {
        text: 'Example',
      },
      config: undefined,
    }, undefined);
  });
  it('should parse liquid tag with config', async () => {
    const Component = jest.fn()
      .mockImplementation(({ type, url, options }) => `${type} ${url} ${Object.entries(options).map((entry) => entry.join('=')).join(' ')}`);
    const { result } = unified()
      .use(remarkParse)
      .use(remarkReactLiquidTag, {
        component: Component,
        config: {
          link: {
            target: '_blank',
          },
        },
      })
      .use(remarkToRehype)
      .use(rehypeReact, prod)
      .processSync(dedent`
        # Hello World
        This is an example markdown file.
        {% link https://example.com text=Example %}
      `);
    renderToString(result);
    expect(Component).toHaveBeenCalledTimes(1);
    expect(Component).toHaveBeenCalledWith({
      type: 'link',
      url: 'https://example.com',
      options: {
        text: 'Example',
      },
      config: {
        target: '_blank',
      },
    }, undefined);
  });
  it('should parse multiple liquid tags', async () => {
    const Component = jest.fn()
      .mockImplementation(({ type, url, options }) => `${type} ${url} ${Object.entries(options).map((entry) => entry.join('=')).join(' ')}`);
    const { result } = unified()
      .use(remarkParse)
      .use(remarkReactLiquidTag, {
        component: Component,
      })
      .use(remarkToRehype)
      .use(rehypeReact, prod)
      .processSync(dedent`
        # Hello World
        This is an example markdown file.
        {% link https://example.com text=Example %}
        {% image https://example.com/image.jpg alt=Image %}
      `);
    renderToString(result);
    expect(Component).toHaveBeenCalledTimes(2);
    expect(Component).toHaveBeenNthCalledWith(1, {
      type: 'link',
      url: 'https://example.com',
      options: {
        text: 'Example',
      },
      config: undefined,
    }, undefined);
    expect(Component).toHaveBeenNthCalledWith(2, {
      type: 'image',
      url: 'https://example.com/image.jpg',
      options: {
        alt: 'Image',
      },
      config: undefined,
    }, undefined);
  });
});
