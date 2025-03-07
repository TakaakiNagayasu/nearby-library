import { type NextPage } from "next";

import SHead from "../../organisms/SHead";
import SHeader from "../../templates/SHeader";
import { SBookmark } from "../../templates/SBookmark";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import router from "next/router";

const Home: NextPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router]);

  if (!session) {
    return null;
  }

  return (
    <>
      <SHead pageName="ブックマーク" />
      <div className="bg-sub">
        <SHeader />

        <main className="mt-16 bg-sub">
          <SBookmark />
        </main>
      </div>
    </>
  );
};

export default Home;
