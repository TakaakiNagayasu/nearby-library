import Image from "next/image";
import Link from "next/link";
import type { SystemidDetail } from "../interface/calilBooksApiInterface";

type Props = {
  books: Map<string, string>;
  libraries: Map<string, string>;
  resultMap: Map<string, Map<string, SystemidDetail>>;
};

export const SNameLinkList: React.FC<Props> = ({
  books,
  libraries,
  resultMap,
}) => {
  return (
    <>
      {Object.entries(resultMap).map(([isbn, systemIdMap]) => {
        const totalLibkeyCount = Object.values(
          systemIdMap as Map<string, SystemidDetail>
        ).reduce((total, systemidDetail) => {
          const typedSystemIdDetail = systemidDetail as SystemidDetail;
          return (
            total + Object.entries(typedSystemIdDetail?.libkey ?? {}).length
          );
        }, 0);

        return (
          <div key={isbn}>
            <div className="flex justify-between">
              <p>{books.get(isbn)}</p>
              <p>{`${totalLibkeyCount}件`}</p>
            </div>

            <div className="my-2 h-[128px] overflow-y-auto border bg-accent text-text">
              {Object.entries(systemIdMap).flatMap(
                ([systemid, systemidDetail]) => {
                  const typedSystemIdDetail = (systemidDetail ??
                    {}) as SystemidDetail;

                  return Object.entries(
                    typedSystemIdDetail?.libkey ?? {}
                  ).flatMap(([library, status]) => (
                    <div key={library} className="h-[24px]">
                      <p
                        title={libraries.get(systemid)}
                        className="inline-block w-[144px] truncate md:w-[108px]"
                      >
                        {libraries.get(systemid)}
                      </p>
                      {typedSystemIdDetail.status === "OK" ||
                      typedSystemIdDetail.status === "Cache" ||
                      typedSystemIdDetail.status === "Running" ? (
                        <>
                          <p
                            title={`${library}:${status}`}
                            className="inline-block w-[204px] truncate md:w-[204px]"
                          >
                            {`${library}:${status}`}
                          </p>
                          {typedSystemIdDetail.reserveurl ? (
                            <Link
                              href={typedSystemIdDetail.reserveurl}
                              target="_blank"
                            >
                              <Image
                                width={16}
                                height={16}
                                src={"/img/ExternalLink.svg"}
                                alt="外部リンク"
                                className="mx-1 mt-[3px] inline-block align-top"
                              />
                            </Link>
                          ) : null}
                        </>
                      ) : status === "Error" ? (
                        <p>エラー</p>
                      ) : (
                        <p>想定外の値検出</p>
                      )}
                    </div>
                  ));
                }
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};
