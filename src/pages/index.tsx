import { type NextPage } from "next";

import SHead from "../organisms/SHead";
import SHeader from "../templates/SHeader";
import SSearchForm from "../templates/SSearchForm";

const Home: NextPage = () => {
  return (
    <>
      <SHead pageName="トップページ" />
      <div>
        <SHeader />

        <main className="pt-16 pb-8">
          <SSearchForm />
        </main>
      </div>
    </>
  );
};

export default Home;
