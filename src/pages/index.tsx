import { type NextPage } from "next";

import SHead from "../organisms/SHead";
import SHeader from "../templates/SHeader";
import SSearchForm from "../templates/SSearchForm";

const Home: NextPage = () => {
  return (
    <>
      <SHead pageName="トップページ" />
      <div className="bg-sub">
        <SHeader />

        <main className="mt-16 bg-sub">
          <SSearchForm />
        </main>
      </div>
    </>
  );
};

export default Home;
