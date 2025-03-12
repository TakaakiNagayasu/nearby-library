import { useContext, useEffect, useRef } from "react";
import { SInputText } from "../atoms/SInputText";
import SButton from "../atoms/SButton";
import {
  FormBookSearchContext,
} from "../templates/SSearchForm";
import { trpc } from "../utils/trpc";

export default function SSearchBooksInformation() {
  const {
    registerFormBookSearch,
    handleSubmitFormBookSearch,
    getValuesFormBookSearch,
    errorsFormBookSearch,
    searchBooksInformation,
    setSearchBooksInformation,
    setValueFormBooksCandidateList,
  } = useContext(FormBookSearchContext);

  const isFirstRender = useRef(true);

  const {
    mutateAsync,
    // isLoading,
    // error,
  } = trpc.googleBooksApi.searchGoogleBooks.useMutation();

  useEffect(() => {
    if (isFirstRender.current) {
      if (!searchBooksInformation) {
        return;
      }
      isFirstRender.current = false;
    }

    const handleSubmit = async () => {
      try {
        const searchGoogleBooks = await mutateAsync(getValuesFormBookSearch());
        setValueFormBooksCandidateList(
          "checkboxList",
          searchGoogleBooks.checkboxList
        );
      } catch (error) {
        console.error(error);
      }
    };

    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBooksInformation]);

  return (
    <>
      <p className="text-left">書名</p>
      <SInputText
        register={registerFormBookSearch("bookTitle")}
        fieldError={errorsFormBookSearch.bookTitle}
      ></SInputText>
      <p className="text-left">著者</p>
      <SInputText
        register={registerFormBookSearch("author")}
        fieldError={errorsFormBookSearch.author}
      ></SInputText>
      <p className="text-left">出版社</p>
      <SInputText
        register={registerFormBookSearch("publisher")}
        fieldError={errorsFormBookSearch.publisher}
      ></SInputText>
      <p className="text-left">ISBN</p>
      <SInputText
        register={registerFormBookSearch("isbn")}
        fieldError={errorsFormBookSearch.isbn}
      ></SInputText>
      <div className="text-center">
        <SButton
          handle={() => {
            handleSubmitFormBookSearch(() => {
              setSearchBooksInformation((prev) => !prev);
            })();
          }}
          type={"button"}
          child={"書籍候補検索"}
        ></SButton>
      </div>
    </>
  );
}
