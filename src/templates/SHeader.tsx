import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export const SHeader: React.FC = () => {
  const { data: session } = useSession();

  return (
    <>
      <div className="fixed left-0 top-0 h-12 w-full">
        <nav className="flex w-full items-center justify-between bg-main">
          <Link href="/" className="text-3xl text-accent">
            ニアバイ蔵書検索
          </Link>
          <div>
            {/* <div className="mr-4 inline">
              <Link href="/" className="text-xl text-accent">
                このページについて
              </Link>
            </div> */}
            {!session ? (
              <div className="mr-4 inline">
                <Link
                  href="/"
                  className="text-xl text-accent"
                  onClick={() => signIn("github")}
                >
                  ログイン
                </Link>
              </div>
            ) : null}
            {session ? (
              <div className="mr-4 inline">
                <Link href="/bookmark" className="text-xl text-accent">
                  ブックマーク
                </Link>
              </div>
            ) : null}
            {session ? (
              <div className="mr-4 inline">
                <Link
                  href=""
                  className="text-xl text-accent"
                  onClick={() => signOut()}
                >
                  ログアウト
                </Link>
              </div>
            ) : null}
          </div>
        </nav>
      </div>
    </>
  );
};

export default SHeader;
