import Image from "next/image";
import Link from "next/link";
import type { TitleLinkBookmarkIdObject } from "../object/TitleLinkBookmarkIdObject";
import { trpc } from "../utils/trpc";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  titleLinkBookmarkIdObjects: TitleLinkBookmarkIdObject[] | undefined;
  setTitleLinkBookmarkIdObjects: Dispatch<
    SetStateAction<TitleLinkBookmarkIdObject[] | undefined>
  >;
};

export const SLinkTitleTrash: React.FC<Props> = ({
  titleLinkBookmarkIdObjects,
  setTitleLinkBookmarkIdObjects,
}) => {
  const deleteBookmark = trpc.deleteBookmark.useMutation({
    onSuccess: (data, variables) => {
      alert(`ブックマークを削除しました。`);
      setTitleLinkBookmarkIdObjects((prev) =>
        (prev || []).filter((obj) => obj.bookmarkId != variables.bookmarkId)
      );
    },
    onError: (error) => {
      console.error(error);
      alert("ブックマークの削除に失敗しました。");
    },
  });

  const handleRegisterBookmark = (bookmarkId: string) => {
    deleteBookmark.mutate({
      bookmarkId: bookmarkId,
    });
  };

  return (
    <>
      <div className="flex justify-between">
        <p>{`${titleLinkBookmarkIdObjects?.length}件`}</p>
      </div>

      <div className="mt-2 h-[128px] overflow-y-auto border bg-accent text-text">
        {titleLinkBookmarkIdObjects
          ? titleLinkBookmarkIdObjects.map((obj) => (
              <div key={obj.bookmarkId} className="h-[24px]">
                <Link href={obj.link}>
                  <p
                    title={obj.title}
                    className="inline-block w-[244px] truncate md:w-[208px]"
                  >
                    {obj.title}
                  </p>
                </Link>

                <Link href={"/"}>
                  <Image
                    width={16}
                    height={16}
                    src={"/img/DustBox.svg"}
                    alt="ブックマークを削除"
                    className="mx-1 mt-[3px] inline-block align-top"
                    onClick={() => handleRegisterBookmark(obj.bookmarkId)}
                  />
                </Link>
              </div>
            ))
          : null}
      </div>
    </>
  );
};
