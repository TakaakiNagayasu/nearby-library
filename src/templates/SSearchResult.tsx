import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SBackSearchForm } from "./SBackSearchForm";
import { SNameLinkList } from "../molecules/SNameLinkList";
import { trpc } from "../utils/trpc";
import type { BookSearch } from "../object/BookSearchObject";
import type { IsbnTitle } from "../object/IsbnTitleObject";
import type { IsbnCodesSystemidDetail } from "../object/IsbnCodesSystemidDetailObject";
import type { CalilBooksApiResponse } from "../interface/calilBooksApiInterface";
import type { Session } from "../object/SessionObject";
import type { SystemidObject } from "../object/SystemidsObject";

export const SSearchResult: React.FC = () => {
  const [prevPageUrlParams, setPrevPageUrlParams] = useState<
    string | undefined
  >(undefined);
  const [isbnCodesUrlParams, setIsbnCodesUrlParams] = useState<string[]>([]);
  const [systemIdsUrlParams, setSystemidDetailUrlParams] = useState<string[]>(
    []
  );

  const [booksCandidateList, setBooksCandidateList] = useState<
    Map<string, string>
  >(() => new Map());
  const [libraries, setLibraries] = useState<Map<string, string>>(new Map());
  const [resultMap, setResultMap] = useState<CalilBooksApiResponse>({
    session: "",
    books: new Map(),
    continue: 1,
  });

  const [session, setSession] = useState<string>("");
  const [continueValue, setContinueValue] = useState<number>(0);

  const [intervalId, setIntervalId] = useState<number | NodeJS.Timeout | null>(
    null
  );

  const [effected, setEffected] = useState<boolean>(false);

  const router = useRouter();
  const { prevPage, isbn, systemid } = router.query;

  useEffect(() => {
    if (!Array.isArray(prevPage)) {
      setPrevPageUrlParams(prevPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    mutateAsync: mutateAsyncLibraryFromSystemid,
    // isLoading,
    // error,
  } =
    trpc.searchLibrariesFromSystemid.searchLibrariesFromSystemid.useMutation();

  const {
    mutateAsync: mutateAsyncSearchGoogleBook,
    // isLoading,
    // error,
  } = trpc.googleBooksApi.searchGoogleBook.useMutation();

  const {
    mutateAsync: mutateAsyncFirstSearchCalilBooks,
    // isLoading,
    // error,
  } = trpc.firstSearchCalilBooks.firstSearchCalilBooks.useMutation();

  const {
    mutateAsync: mutateAsyncSessionSearchCalilBooks,
    // isLoading,
    // error,
  } = trpc.firstSearchCalilBooks.sessionSearchCalilBooks.useMutation();

  useEffect(() => {
    if (
      !isbn ||
      !systemid ||
      typeof isbn !== "string" ||
      typeof systemid !== "string"
    ) {
      return;
    }
    if (!effected) {
      setEffected(true);
      return;
    }

    {
      setSystemidDetailUrlParams(systemid.split(","));
      const systemidArray = systemid.split(",");
      systemidArray.forEach(async (systemid) => {
        const systemidsObject: SystemidObject = { systemid: systemid };

        const librariesFromSystemid = await mutateAsyncLibraryFromSystemid(
          systemidsObject
        );

        setLibraries((prevLibraries) => {
          const newLibraries = new Map(prevLibraries);
          librariesFromSystemid.forEach((library) => {
            newLibraries.set(library.systemid, library.systemname);
          });
          return newLibraries;
        });
      });
    }

    {
      const isbnCodes: string[] = isbn.split(",");
      const formBookSearchArray: BookSearch[] = isbnCodes.map((isbn) => {
        return {
          bookTitle: "",
          author: "",
          publisher: "",
          isbn: isbn,
        };
      });

      const createIsbnTitleMap = (data: IsbnTitle[]): Map<string, string> => {
        return new Map(
          data
            .filter((item) => item.isbn && item.title)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map((item) => [item.isbn!, item.title!])
        );
      };

      try {
        formBookSearchArray.forEach(async (formBookSearch) => {
          const isbnTitles = await mutateAsyncSearchGoogleBook(formBookSearch);
          const isbnTitleMap: Map<string, string> =
            createIsbnTitleMap(isbnTitles);
          setBooksCandidateList((prev) => new Map([...prev, ...isbnTitleMap]));
        });
      } catch (error) {
        console.error(error);
      }
    }

    try {
      const firstSearchCalilBooks = async () => {
        const isbnCodesSystemids: IsbnCodesSystemidDetail = {
          isbnCodes: isbn,
          systemidDetail: systemid,
        };

        const json: CalilBooksApiResponse =
          await mutateAsyncFirstSearchCalilBooks(isbnCodesSystemids);
        setIsbnCodesUrlParams(Object.keys(json.books));

        Object.keys(json.books).forEach((systemid) => {
          setSystemidDetailUrlParams((prev) => [...prev, ...systemid]);
        });
        setResultMap(json);
        setContinueValue(json.continue);
        setSession(json.session);
      };
      firstSearchCalilBooks();
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effected, isbn, systemid]);

  useEffect(() => {
    // continueValue が 1 の時にインターバルを設定
    if (continueValue === 1 && !intervalId) {
      const newIntervalId = setInterval(fetchData, 3000);
      setIntervalId(newIntervalId);
    }

    // continueValue が 0 の時にインターバルを停止
    if (continueValue === 0 && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null); // インターバルID を null にリセット
    }
    // クリーンアップ
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continueValue, intervalId]); // intervalId を監視

  const fetchData = () => {
    try {
      const sessionSearchCalilBooks = async () => {
        const sessionObject: Session = {
          session: session,
        };

        const json: CalilBooksApiResponse =
          await mutateAsyncSessionSearchCalilBooks(sessionObject);
        setIsbnCodesUrlParams(Object.keys(json.books));

        Object.values(json.books).forEach((systemid) => {
          setSystemidDetailUrlParams((prev = []) => [
            ...prev,
            ...Object.keys(systemid),
          ]);
        });
        setResultMap(json);
        setContinueValue(json.continue);
      };
      sessionSearchCalilBooks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mx-auto w-[424px] bg-main p-4 text-accent">
        <SBackSearchForm
          prevPage={prevPageUrlParams}
          isbnCodesUrlParams={isbnCodesUrlParams}
          systemidsUrlParams={systemIdsUrlParams}
        />
        <SNameLinkList
          books={booksCandidateList}
          libraries={libraries}
          resultMap={resultMap.books}
        />
      </div>
    </>
  );
};
