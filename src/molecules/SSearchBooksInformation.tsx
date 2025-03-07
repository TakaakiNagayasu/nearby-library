import { useContext, useEffect, useRef } from "react";
import { SInputText } from "../atoms/SInputText";
import SButton from "../atoms/SButton";
import {
  BooksListContext,
  FormBookSearchContext,
} from "../templates/SSearchForm";
import { trpc } from "../utils/trpc";

export default function SSearchBooksInformation() {
  const {
    formBookSearch,
    setFormBookSearch,
    registerFormBookSearch,
    handleSubmitFormBookSearch,
    errorsFormBookSearch,
    searchBooksInformation,
    setSearchBooksInformation,
    setValueFormBooksCandidateList,
  } = useContext(FormBookSearchContext);

  const { setBooksCandidateList } = useContext(BooksListContext);

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
        const searchGoogleBooks = await mutateAsync(formBookSearch);
        setValueFormBooksCandidateList(
          "checkboxList",
          searchGoogleBooks.checkboxList
        );
        setBooksCandidateList({
          checkboxList: searchGoogleBooks.checkboxList,
        });
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
        value={formBookSearch.bookTitle}
        handle={(e) =>
          setFormBookSearch({ ...formBookSearch, bookTitle: e.target.value })
        }
        fieldError={errorsFormBookSearch.bookTitle}
      ></SInputText>
      <p className="text-left">著者</p>
      <SInputText
        register={registerFormBookSearch("author")}
        value={formBookSearch.author}
        handle={(e) =>
          setFormBookSearch({ ...formBookSearch, author: e.target.value })
        }
        fieldError={errorsFormBookSearch.author}
      ></SInputText>
      <p className="text-left">出版社</p>
      <SInputText
        register={registerFormBookSearch("publisher")}
        value={formBookSearch.publisher}
        handle={(e) =>
          setFormBookSearch({ ...formBookSearch, publisher: e.target.value })
        }
        fieldError={errorsFormBookSearch.publisher}
      ></SInputText>
      <p className="text-left">ISBN</p>
      <SInputText
        register={registerFormBookSearch("isbn")}
        value={formBookSearch.isbn}
        handle={(e) =>
          setFormBookSearch({ ...formBookSearch, isbn: e.target.value })
        }
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
