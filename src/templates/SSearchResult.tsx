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
import type { SystemidMap } from "../object/SystemidMap";
import type { CalilLibrariesFromSystemid } from "../interface/calilLibrariesApiInterface";

export const SSearchResult: React.FC = () => {
  const [prevPageUrlParams, setPrevPageUrlParams] = useState<
    string | undefined
  >(undefined);
  const [isbnCodesUrlParams, setIsbnCodesUrlParams] = useState<string[]>([]);
  const [systemIdsUrlParams, setSystemidsUrlParams] = useState<
    Map<string, Set<string>>
  >(new Map());

  const [booksCandidateList, setBooksCandidateList] = useState<
    Map<string, string>
  >(() => new Map());
  const [systemids, setSystemids] = useState<SystemidMap>({
    systemidLibkeyFormalMap: new Map(),
  });
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

    function parseString(input: string): Map<string, Set<string>> {
      const result = new Map<string, Set<string>>();

      // 1回目の正規表現: "," で区切り、配列を作成
      const pairs = input.split(/,/);

      // 2回目の正規表現: ":" でキーと値に分割
      pairs.forEach((pair) => {
        const match = pair.match(/^([^:]+):(.+)$/);
        if (match) {
          const key = match[1] ?? "";
          const value = match[2] ?? "";

          if (!result.has(key)) {
            result.set(key, new Set());
          }
          result.get(key)?.add(value);
        }
      });

      return result;
    }

    const systemidLibkeyMap = parseString(systemid);
    const systemidArray = Array.from(systemidLibkeyMap.keys());
    {
      setSystemidsUrlParams(systemidLibkeyMap);

      systemidArray.forEach(async (systemid) => {
        const systemidsObject: SystemidObject = { systemid };

        const librariesFromSystemid: CalilLibrariesFromSystemid =
          await mutateAsyncLibraryFromSystemid(systemidsObject);

        setSystemids((prevSystemidMap) => {
          const newSystemidMap: SystemidMap = {
            systemidLibkeyFormalMap: new Map(
              prevSystemidMap.systemidLibkeyFormalMap
            ),
          };

          librariesFromSystemid.forEach((library) => {
            if (!newSystemidMap.systemidLibkeyFormalMap.has(library.systemid)) {
              newSystemidMap.systemidLibkeyFormalMap.set(
                library.systemid,
                new Map([[library.libkey, library.formal]])
              );
            } else {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              newSystemidMap.systemidLibkeyFormalMap
                .get(library.systemid)!
                .set(library.libkey, library.formal);
            }
          });
          return newSystemidMap;
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
          systemidDetail: systemidArray.join(","),
        };

        const json: CalilBooksApiResponse =
          await mutateAsyncFirstSearchCalilBooks(isbnCodesSystemids);
        setIsbnCodesUrlParams(Object.keys(json.books));

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
        <h2 className="text-xl">検索結果（2.5秒おきに自動更新）</h2>
        <SBackSearchForm
          prevPage={prevPageUrlParams}
          isbnCodesUrlParams={isbnCodesUrlParams}
          systemidLibkeyMap={systemIdsUrlParams}
        />
        <SNameLinkList
          books={booksCandidateList}
          systemidLibkeyMap={systemIdsUrlParams}
          systemids={systemids}
          resultMap={resultMap.books}
        />
      </div>
    </>
  );
};
