# remark-react-liquid-tag

This is a [remark](https://github.com/remarkjs/remark) 
plugin that allows the usage of liquid tags.

This idea came from the usage of liquid tags in [dev.to (DEV COMMUNITY)](https://dev.to/) platform for embedding 
services in markdowns.
[This documented page](https://docs.dev.to/frontend/liquid-tags/) shows their idea behind liquid tags and the tags available.

## Liquid tags

Liquid tags are special elements to use in markdown.
They are custom embeds that are added via a `{% %}` syntax. 
[Liquid](https://shopify.github.io/liquid/) is a templating language developed by Shopify.

## Installation

```bash
npm install remark-react-liquid-tag
```

## Usage

Usage with [react-remark](https://github.com/remarkjs/react-remark)


```tsx
import React, { Fragment } from 'react';
import { useRemark } from 'react-remark';
import remarkGemoji from 'remark-gemoji';
import rehypeSlug from 'rehype-slug';
import rehypeAutoLinkHeadings from 'rehype-autolink-headings';
import reactLiquidTag, { RemarkReactLiquidTagProps } from 'remark-react-liquid-tag';

const LiquidTag: React.FC<RemarkReactLiquidTagProps> = (props) => {
  switch (props.type) {
    case 'youtube':
      return (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${props.url}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    default:
      return <Fragment />;
  }
}

// ...

<Remark
  remarkPlugins={[remarkGemoji, [remarkLiquidTag, { component: LiquidTag }]]}
  remarkToRehypeOptions={{ allowDangerousHtml: true }}
  rehypePlugins={[rehypeSlug, rehypeAutoLinkHeadings]}
>
  {`
    This is youtube video:
    {% youtube dQw4w9WgXcQ %}
    
    This is a unsupported tag:
    {% unsupported_tag %}
  `}
</Remark>;

// ...

```

## Options

- `component`: React component to render the liquid tag. It receives the props:
  - `type`: The type of the liquid tag.
  - `url`: The url of the liquid tag.
  - `options`: The additional options of the liquid tag.
  - `config`: The config of the liquid tag by type.
- `config`: The configuration of the liquid tags. It is an object with the type of the liquid tag as key and the config as value.

Example:

```md
{% type url option1=value1 option2=value2 %}
```

