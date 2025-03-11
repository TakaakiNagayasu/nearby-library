import { useRouter } from "next/router";
import SButton from "../atoms/SButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { SInputTextShort } from "../atoms/SInputTextShort";
import { useSession } from "next-auth/react";

type Props = {
  prevPage: string | undefined;
  isbnCodesUrlParams: string[];
  systemidsUrlParams: string[];
};

export const SBackSearchForm: React.FC<Props> = ({
  prevPage,
  isbnCodesUrlParams,
  systemidsUrlParams,
}) => {
  const { data: session } = useSession();

  const router = useRouter();

  const backSearchForm = () => {
    router.push(`/`);
  };

  const backBookmark = () => {
    router.push(`bookmark`);
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<{ title: string }>({
    resolver: zodResolver(
      z.object({
        title: z
          .string()
          .min(1, { message: `タイトルは${1}文字以上入力してください` })
          .max(100, { message: `タイトルは${100}文字以内で入力してください` }),
      })
    ),
    mode: "onBlur",
  });

  const insertBookmark = trpc.insertBookmark.useMutation({
    onSuccess: () => {
      alert(`ブックマークを登録しました。`);
    },
    onError: (error) => {
      console.error(error);
      alert("ブックマークの登録に失敗しました。");
    },
  });

  const handleRegisterBookmark = () => {
    // サーバーにデータを送信
    insertBookmark.mutate({
      title: getValues().title,
      isbnCodes: isbnCodesUrlParams,
      systemids: systemidsUrlParams,
    });
  };

  return (
    <>
      <div>
        {session && prevPage ? (
          <SButton
            handle={() => backBookmark()}
            type={"button"}
            child={"ブックマーク画面へ戻る"}
          ></SButton>
        ) : (
          <SButton
            handle={() => backSearchForm()}
            type={"button"}
            child={"検索画面へ戻る"}
          ></SButton>
        )}
        {session && !prevPage ? (
          <>
            <br />
            <SInputTextShort
              register={register("title")}
            />
            <SButton
              handle={handleSubmit(() => handleRegisterBookmark())}
              type={"button"}
              child={"検索条件をブックマークする"}
            ></SButton>
            <br />
            {errors.title && (
                <p className="text-error">
                  {errors.title.message}
                </p>
              )}
          </>
        ) : null}
      </div>
    </>
  );
};
