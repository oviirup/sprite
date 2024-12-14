import { PKG_DESC } from '@/const';

export function Layout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#09090b" />
        <meta name="color-scheme" content="light dark" />
        <title>Sprite Studio</title>
        <meta name="description" content={PKG_DESC} />
      </head>
      <body>
        <div id="root">{props.children}</div>
      </body>
    </html>
  );
}
