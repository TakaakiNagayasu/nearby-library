import { type NextPage } from "next";

import SHead from "../../organisms/SHead";
import SHeader from "../../templates/SHeader";
import { SSearchResult } from "../../templates/SSearchResult";

const Home: NextPage = () => {
  return (
    <>
      <SHead pageName="検索結果" />
      <div>
        <SHeader />

        <main className="pt-16 pb-8">
          <SSearchResult />
        </main>
      </div>
    </>
  );
};

export default Home;
