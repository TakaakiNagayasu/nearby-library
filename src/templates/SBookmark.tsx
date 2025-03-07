import { type NextPage } from "next";
import { SLinkTitleTrash } from "../molecules/SLinkTitleTrash";
import type { TitleLinkBookmarkIdObject } from "../object/TitleLinkBookmarkIdObject";
import { trpc } from "../utils/trpc";
import { useEffect, useState } from "react";

export const SBookmark: NextPage = () => {
  const {
    data: titleLinkBookmarkIdObjects,
    // isLoading,
    // error,
  } = trpc.selectBookmarks.useQuery(undefined, { staleTime: Infinity });

  const [bookmarkObjects, setBookmarkObjects] = useState<
    TitleLinkBookmarkIdObject[] | undefined
  >(titleLinkBookmarkIdObjects);

  useEffect(() => {
    if (titleLinkBookmarkIdObjects) {
      setBookmarkObjects(titleLinkBookmarkIdObjects);
    }
  }, [titleLinkBookmarkIdObjects]);

  return (
    <>
      <div className="mx-auto mb-4 w-[424px] bg-main p-4 text-accent md:mx-4 md:w-[740px]">
        <div className="flex justify-between">
          <h2 className="text-xl">ブックマーク</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="md:w-[320px]">
            <SLinkTitleTrash
              titleLinkBookmarkIdObjects={bookmarkObjects}
              setTitleLinkBookmarkIdObjects={setBookmarkObjects}
            />
          </div>
        </div>
      </div>
    </>
  );
};
