import SButton from "../atoms/SButton";
import SWarningButton from "../atoms/SWarningButton";

import dynamic from "next/dynamic";
import Image from "next/image";

import { env } from "../env/client.mjs";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useState } from "react";
import SSearchBooksInformation from "../molecules/SSearchBooksInformation";
import { SAddAndRemoveForm } from "../organisms/SAddAndRemoveForm";
import type { CheckNameLinkZodObject } from "../object/CheckNameLinkObject";
import { checkNameLinkZodObject } from "../object/CheckNameLinkObject";
import { useRouter } from "next/router";
import type { LibrariesCountObject } from "../object/LibrariesCountObject";
import { librariesCountZodObject } from "../object/LibrariesCountObject";
import type {
  FieldErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BookSearch } from "../object/BookSearchObject";
import { bookSearchZodEffect } from "../object/BookSearchObject";
import Link from "next/link";
import { SInputTextShort } from "../atoms/SInputTextShort";
import { CONSTANTS } from "../config/constants";

const MapComponent = dynamic(() => import("../molecules/SMap"), { ssr: false });

export const FormBookSearchContext = createContext(
  {} as {
    registerFormBookSearch: UseFormRegister<BookSearch>;
    handleSubmitFormBookSearch: UseFormHandleSubmit<BookSearch>;
    getValuesFormBookSearch: UseFormGetValues<BookSearch>;
    errorsFormBookSearch: FieldErrors<BookSearch>;
    searchBooksInformation: boolean;
    setSearchBooksInformation: Dispatch<SetStateAction<boolean>>;
    setValueFormBooksCandidateList: UseFormSetValue<CheckNameLinkZodObject>;
  }
);

export const BooksListContext = createContext(
  {} as {
    registerFormBooksCandidateList: UseFormRegister<CheckNameLinkZodObject>;
    handleSubmitFormBooksCandidateList: UseFormHandleSubmit<CheckNameLinkZodObject>;
    getValuesFormBooksCandidateList: UseFormGetValues<CheckNameLinkZodObject>;
    setValueFormBooksCandidateList: UseFormSetValue<CheckNameLinkZodObject>;
    errorsFormBooksCandidateList: FieldErrors<CheckNameLinkZodObject>;
    registerFormBooksSearchList: UseFormRegister<CheckNameLinkZodObject>;
    handleSubmitFormBooksSearchList: UseFormHandleSubmit<CheckNameLinkZodObject>;
    setValueFormBooksSearchList: UseFormSetValue<CheckNameLinkZodObject>;
    errorsFormBooksSearchList: FieldErrors<CheckNameLinkZodObject>;
  }
);

export const LibrariesCountContext = createContext(
  {} as {
    getValuesFormLibrariesCount: UseFormGetValues<LibrariesCountObject>;
  }
);

export const SearchNearByLibraryContext = createContext(
  {} as {
    searchNearByLibrary: boolean;
    setSearchNearByLibrary: Dispatch<SetStateAction<boolean>>;
  }
);

export const LibrariesListContext = createContext(
  {} as {
    registerFormLibrariesCandidateList: UseFormRegister<CheckNameLinkZodObject>;
    handleSubmitFormLibrariesCandidateList: UseFormHandleSubmit<CheckNameLinkZodObject>;
    setValueFormLibrariesCandidateList: UseFormSetValue<CheckNameLinkZodObject>;
    errorsFormLibrariesCandidateList: FieldErrors<CheckNameLinkZodObject>;
    registerFormLibrariesSearchList: UseFormRegister<CheckNameLinkZodObject>;
    handleSubmitFormLibrariesSearchList: UseFormHandleSubmit<CheckNameLinkZodObject>;
    setValueFormLibrariesSearchList: UseFormSetValue<CheckNameLinkZodObject>;
    errorsFormLibrariesSearchList: FieldErrors<CheckNameLinkZodObject>;
  }
);

const SSearchForm: React.FC = () => {
  const router = useRouter();

  const {
    register: registerFormBookSearch,
    handleSubmit: handleSubmitFormBookSearch,
    getValues: getValuesFormBookSearch,
    setValue: setValueFormBookSearch,
    formState: { errors: errorsFormBookSearch },
  } = useForm<BookSearch>({
    resolver: zodResolver(bookSearchZodEffect),
    mode: "onBlur",
  });

  const defaultBookSearchObject: BookSearch = {
    bookTitle: "",
    author: "",
    publisher: "",
    isbn: "",
  };

  const [searchBooksInformation, setSearchBooksInformation] =
    useState<boolean>(false);

  const {
    control: controlFormBooksCandidateList,
    register: registerFormBooksCandidateList,
    handleSubmit: handleSubmitFormBooksCandidateList,
    getValues: getValuesFormBooksCandidateList,
    setValue: setValueFormBooksCandidateList,
    formState: { errors: errorsFormBooksCandidateList },
  } = useForm<CheckNameLinkZodObject>({
    resolver: zodResolver(checkNameLinkZodObject),
    mode: "onBlur",
    defaultValues: { checkboxList: [] },
  });

  const {
    control: controlFormBooksSearchList,
    register: registerFormBooksSearchList,
    handleSubmit: handleSubmitFormBooksSearchList,
    getValues: getValuesFormBooksSearchList,
    setValue: setValueFormBooksSearchList,
    formState: { errors: errorsFormBooksSearchList },
  } = useForm<CheckNameLinkZodObject>({
    resolver: zodResolver(checkNameLinkZodObject),
    mode: "onBlur",
    defaultValues: { checkboxList: [] },
  });

  const {
    register: registerFormLibrariesCount,
    handleSubmit: handleSubmitFormLibrariesCount,
    getValues: getValuesFormLibrariesCount,
    setValue: setValueFormLibrariesCount,
    formState: { errors: errorsFormLibrariesCount },
  } = useForm<LibrariesCountObject>({
    resolver: zodResolver(librariesCountZodObject),
    mode: "onBlur",
    defaultValues: {
      value: CONSTANTS.LIBRARIES_SEARCH_DEFAULT_COUNT.toString(),
    },
  });

  const [searchNearByLibrary, setSearchNearByLibrary] =
    useState<boolean>(false);

  const {
    control: controlFormLibrariesCandidateList,
    register: registerFormLibrariesCandidateList,
    handleSubmit: handleSubmitFormLibrariesCandidateList,
    getValues: getValuesFormLibrariesCandidateList,
    setValue: setValueFormLibrariesCandidateList,
    formState: { errors: errorsFormLibrariesCandidateList },
  } = useForm<CheckNameLinkZodObject>({
    resolver: zodResolver(checkNameLinkZodObject),
    mode: "onBlur",
    defaultValues: { checkboxList: [] },
  });

  const {
    control: controlFormLibrariesSearchList,
    register: registerFormLibrariesSearchList,
    handleSubmit: handleSubmitFormLibrariesSearchList,
    getValues: getValuesFormLibrariesSearchList,
    setValue: setValueFormLibrariesSearchList,
    formState: { errors: errorsFormLibrariesSearchList },
  } = useForm<CheckNameLinkZodObject>({
    resolver: zodResolver(checkNameLinkZodObject),
    mode: "onBlur",
    defaultValues: { checkboxList: [] },
  });

  const resetBooksForm = () => {
    setValueFormBookSearch("bookTitle", defaultBookSearchObject.bookTitle);
    setValueFormBookSearch("author", defaultBookSearchObject.author);
    setValueFormBookSearch("publisher", defaultBookSearchObject.publisher);
    setValueFormBookSearch("isbn", defaultBookSearchObject.isbn);
    setValueFormBooksCandidateList("checkboxList", []);
    setValueFormBooksSearchList("checkboxList", []);
  };

  const resetLibrariesForm = () => {
    setValueFormLibrariesCount(
      "value",
      CONSTANTS.LIBRARIES_SEARCH_DEFAULT_COUNT.toString()
    );
    setValueFormLibrariesCandidateList("checkboxList", []);
    setValueFormLibrariesSearchList("checkboxList", []);
  };

  const searchCollectionBooks = () => {
    const isbnString = getValuesFormBooksSearchList().checkboxList
      .map((book) => book.value)
      .join(",");
    const systemidDistinctSet = new Set<string>();
    getValuesFormLibrariesSearchList().checkboxList.forEach((checkNameLink) => {
      if (!systemidDistinctSet.has(checkNameLink.value ?? "")) {
        systemidDistinctSet.add(checkNameLink.value ?? "");
      }
    });
    const systemidString = Array.from(systemidDistinctSet.values()).join(",");

    let apiQueries: string[] = [];
    apiQueries = isbnString
      ? [...apiQueries, `isbn=${isbnString}`]
      : apiQueries;
    apiQueries = systemidString
      ? [...apiQueries, `systemid=${systemidString}`]
      : apiQueries;
    const apiQueryString: string =
      apiQueries.length <= 0
        ? ""
        : "?" + apiQueries.map((str) => str).join("&");
    router.push(`/searchResult${apiQueryString}`);
  };

  return (
    <>
      <div className="mx-auto w-[424px] bg-main p-4 text-accent md:w-[740px]">
        <div className="flex justify-between">
          <h2 className="text-xl">書籍検索フォーム</h2>
          <SWarningButton
            handle={() => {
              resetBooksForm();
            }}
            type={"button"}
            child={"書籍検索フォームをリセット"}
          ></SWarningButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="md:w-[320px]">
            <FormBookSearchContext.Provider
              value={{
                registerFormBookSearch,
                handleSubmitFormBookSearch,
                getValuesFormBookSearch,
                errorsFormBookSearch,
                searchBooksInformation,
                setSearchBooksInformation,
                setValueFormBooksCandidateList,
              }}
            >
              <BooksListContext.Provider
                value={{
                  registerFormBooksCandidateList,
                  handleSubmitFormBooksCandidateList,
                  getValuesFormBooksCandidateList,
                  setValueFormBooksCandidateList,
                  errorsFormBooksCandidateList,
                  registerFormBooksSearchList,
                  handleSubmitFormBooksSearchList,
                  setValueFormBooksSearchList,
                  errorsFormBooksSearchList,
                }}
              >
                <SSearchBooksInformation />
              </BooksListContext.Provider>
            </FormBookSearchContext.Provider>
          </div>
          <div className="md:w-[352px]">
            <SAddAndRemoveForm
              itemName="書籍"
              controlItemsCandidateList={controlFormBooksCandidateList}
              registerFormItemsCandidateList={registerFormBooksCandidateList}
              handleSubmitFormItemsCandidateList={
                handleSubmitFormBooksCandidateList
              }
              getValuesFormItemsCandidateList={getValuesFormBooksCandidateList}
              setValueFormItemsCandidateList={setValueFormBooksCandidateList}
              errorsFormItemsCandidateList={errorsFormBooksCandidateList}
              controlItemsSearchList={controlFormBooksSearchList}
              registerFormItemsSearchList={registerFormBooksSearchList}
              handleSubmitFormItemsSearchList={handleSubmitFormBooksSearchList}
              getValuesFormItemsSearchList={getValuesFormBooksSearchList}
              setValueFormItemsSearchList={setValueFormBooksSearchList}
              errorsFormItemsSearchList={errorsFormBooksSearchList}
            />
          </div>
        </div>
        <div className="mb-2 mt-8 flex justify-between">
          <h2 className="text-xl">図書館検索フォーム</h2>
          <SWarningButton
            handle={() => {
              resetLibrariesForm();
            }}
            type={"button"}
            child={"図書館検索フォームをリセット"}
          ></SWarningButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="md:w-[320px]">
            <div className="mb-2 flex items-center justify-center">
              <SearchNearByLibraryContext.Provider
                value={{ searchNearByLibrary, setSearchNearByLibrary }}
              >
                <LibrariesListContext.Provider
                  value={{
                    registerFormLibrariesCandidateList,
                    handleSubmitFormLibrariesCandidateList,
                    setValueFormLibrariesCandidateList,
                    errorsFormLibrariesCandidateList,
                    registerFormLibrariesSearchList,
                    handleSubmitFormLibrariesSearchList,
                    setValueFormLibrariesSearchList,
                    errorsFormLibrariesSearchList,
                  }}
                >
                  <LibrariesCountContext.Provider
                    value={{
                      getValuesFormLibrariesCount,
                    }}
                  >
                    <MapComponent
                      apiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}
                      mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
                    />
                  </LibrariesCountContext.Provider>
                </LibrariesListContext.Provider>
              </SearchNearByLibraryContext.Provider>
            </div>
            <div className="mb-2">
              <p>検索図書館戸数</p>
              <div className="flex justify-between text-center">
                <SInputTextShort
                  register={registerFormLibrariesCount("value")}
                ></SInputTextShort>
                {
                  <SButton
                    handle={() => {
                      handleSubmitFormLibrariesCount(() => {
                        setSearchNearByLibrary((prev) => !prev);
                      })();
                    }}
                    type={"button"}
                    child={"マーカー周辺の図書館を検索"}
                  ></SButton>
                }
              </div>
              {errorsFormLibrariesCount.value && (
                <p className="text-error">
                  {errorsFormLibrariesCount.value.message}
                </p>
              )}
            </div>
          </div>
          <div className="md:w-[352px]">
            <SAddAndRemoveForm
              itemName="図書館"
              controlItemsCandidateList={controlFormLibrariesCandidateList}
              registerFormItemsCandidateList={
                registerFormLibrariesCandidateList
              }
              handleSubmitFormItemsCandidateList={
                handleSubmitFormLibrariesCandidateList
              }
              getValuesFormItemsCandidateList={
                getValuesFormLibrariesCandidateList
              }
              setValueFormItemsCandidateList={
                setValueFormLibrariesCandidateList
              }
              errorsFormItemsCandidateList={errorsFormLibrariesCandidateList}
              controlItemsSearchList={controlFormLibrariesSearchList}
              registerFormItemsSearchList={registerFormLibrariesSearchList}
              handleSubmitFormItemsSearchList={
                handleSubmitFormLibrariesSearchList
              }
              getValuesFormItemsSearchList={getValuesFormLibrariesSearchList}
              setValueFormItemsSearchList={setValueFormLibrariesSearchList}
              errorsFormItemsSearchList={errorsFormLibrariesSearchList}
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-center">
            <SButton
              handle={async () => {
                let isOkBooksCheck = false;
                let isOkLibrariesCheck = false;

                await Promise.all([
                  handleSubmitFormBooksSearchList(() => {
                    null;
                  })(),
                  handleSubmitFormLibrariesSearchList(() => {
                    null;
                  })(),
                ]);

                if (getValuesFormBooksSearchList().checkboxList.length > 0) {
                  isOkBooksCheck = true;
                }
                if (
                  getValuesFormLibrariesSearchList().checkboxList.length > 0
                ) {
                  isOkLibrariesCheck = true;
                }

                if (isOkBooksCheck && isOkLibrariesCheck) {
                  searchCollectionBooks();
                }
              }}
              type={"button"}
              child={"蔵書検索開始"}
            ></SButton>
          </div>
          <div className="text-right">
            <Link href={"https://calil.jp/"} target="_blank">
              <Image
                width={100}
                height={40}
                src={"/img/calil_logocopy_bgblack.svg"}
                alt="Powered by カーリル"
                className="mx-1 mt-[3px] inline-block align-top"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SSearchForm;
