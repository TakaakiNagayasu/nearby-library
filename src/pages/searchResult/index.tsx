import { type NextPage } from "next";

import SHead from "../../organisms/SHead";
import SHeader from "../../templates/SHeader";
import { SSearchResult } from "../../templates/SSearchResult";

const Home: NextPage = () => {
  return (
    <>
      <SHead pageName="検索結果" />
      <div className="bg-sub">
        <SHeader />

        <main className="mt-16 bg-sub">
          <SSearchResult />
        </main>
      </div>
    </>
  );
};

export default Home;
