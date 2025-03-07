import Head from "next/head";

type Props = {
  pageName: string;
};

export const SHead: React.FC<Props> = ({ pageName }) => {
  return (
    <>
      <Head>
        <title>{`ニアバイ蔵書検索 - ${pageName}`}</title>
        <meta
          name="description"
          content="お近くの図書館から複数の蔵書を一度に検索できるサービスです。"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default SHead;
