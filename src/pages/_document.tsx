import { Html, Head, Main, NextScript } from "next/document";
import type { DocumentContext } from "next/document";
import Document from "next/document";

/**
 * カスタムドキュメント
 *
 * @class CustomDocument カスタムドキュメント
 * @extends {Document} Next.jsカスタムドキュメント用ベースクラス
 */
export class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
