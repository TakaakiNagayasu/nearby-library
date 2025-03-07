import { type Dispatch, type SetStateAction } from "react";
import type {
  CheckNameLinkZodObject,
  CheckNameLink,
} from "../object/CheckNameLinkObject";
import SButton from "../atoms/SButton";
import { SCheckNameLinkList } from "../molecules/SCheckNameLinkList";
import type {
  Control,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import {
  useFieldArray,
  type FieldErrors,
  type UseFormHandleSubmit,
  type UseFormRegister,
} from "react-hook-form";

type Props = {
  itemName: string;
  itemsCandidateList: CheckNameLinkZodObject;
  setItemsCandidateList: Dispatch<SetStateAction<CheckNameLinkZodObject>>;
  controlItemsCandidateList: Control<CheckNameLinkZodObject, unknown>;
  registerFormItemsCandidateList: UseFormRegister<CheckNameLinkZodObject>;
  handleSubmitFormItemsCandidateList: UseFormHandleSubmit<CheckNameLinkZodObject>;
  getValuesFormItemsCandidateList: UseFormGetValues<CheckNameLinkZodObject>;
  setValueFormItemsCandidateList: UseFormSetValue<CheckNameLinkZodObject>;
  errorsFormItemsCandidateList: FieldErrors<CheckNameLinkZodObject>;
  itemsSearchList: CheckNameLink;
  setItemsSearchList: Dispatch<SetStateAction<CheckNameLink>>;
  controlItemsSearchList: Control<CheckNameLinkZodObject, unknown>;
  registerFormItemsSearchList: UseFormRegister<CheckNameLinkZodObject>;
  handleSubmitFormItemsSearchList: UseFormHandleSubmit<CheckNameLinkZodObject>;
  getValuesFormItemsSearchList: UseFormGetValues<CheckNameLinkZodObject>;
  setValueFormItemsSearchList: UseFormSetValue<CheckNameLinkZodObject>;
  errorsFormItemsSearchList: FieldErrors<CheckNameLinkZodObject>;
};

export const SAddAndRemoveForm: React.FC<Props> = ({
  itemName,
  itemsCandidateList,
  setItemsCandidateList,
  controlItemsCandidateList,
  registerFormItemsCandidateList,
  handleSubmitFormItemsCandidateList,
  //getValuesFormItemsCandidateList,
  setValueFormItemsCandidateList,
  errorsFormItemsCandidateList,
  itemsSearchList,
  setItemsSearchList,
  controlItemsSearchList,
  registerFormItemsSearchList,
  handleSubmitFormItemsSearchList,
  // getValuesFormItemsSearchList,
  setValueFormItemsSearchList,
  errorsFormItemsSearchList,
}) => {
  const addHandler = () => {
    setItemsSearchList((prev: CheckNameLink) => ({
      ...prev,
      checkboxList: [
        ...prev.checkboxList,
        ...itemsCandidateList?.checkboxList
          .filter((item) => item.checkbox)
          .filter((item) => {
            let isMatch = false;
            prev.checkboxList.forEach((searchItem) => {
              if (item.value === searchItem.value) {
                isMatch = true;
              }
            });
            return !isMatch;
          })
          .map((item) => ({
            enabled: true,
            checkbox: false,
            name: item.name,
            sub: item.sub,
            value: item.value,
            link: item.link,
          })),
      ],
    }));
    setValueFormItemsSearchList("checkboxList", itemsSearchList.checkboxList);
  };

  const removeHandler = () => {
    setItemsSearchList((prevList) => ({
      ...prevList,
      checkboxList: prevList.checkboxList
        .filter((item) => !item.checkbox)
        .map((item) => ({
          ...item,
          checkbox: false,
        })),
    }));
    setValueFormItemsCandidateList(
      "checkboxList",
      itemsCandidateList.checkboxList
    );
  };

  const {
    // fields: fieldsCandidateList,
    // append: appendCandidateList,
    // remove: removeCandidateList,
  } = useFieldArray({
    control: controlItemsCandidateList,
    name: "checkboxList",
  });

  const {
    // fields: fieldsSearchList,
    // append: appendSearchList,
    // remove: removeSearchList,
  } = useFieldArray({
    control: controlItemsSearchList,
    name: "checkboxList",
  });

  return (
    <>
      <div className="md:w-[352px]">
        <SCheckNameLinkList
          register={registerFormItemsCandidateList}
          title={`${itemName}候補一覧`}
          list={itemsCandidateList}
          setList={setItemsCandidateList}
        />

        {errorsFormItemsCandidateList?.checkboxList && (
          <p className="text-error">
            {errorsFormItemsCandidateList?.checkboxList?.root?.message}
          </p>
        )}
        <div className="flex justify-between">
          <SButton
            handle={() => {
              handleSubmitFormItemsCandidateList(() => {
                addHandler();
              })();
            }}
            type={"button"}
            child={`${itemName}検索対象に追加`}
          ></SButton>
          <SButton
            handle={() => {
              handleSubmitFormItemsSearchList(() => {
                removeHandler();
              })();
            }}
            type={"button"}
            child={`${itemName}検索対象から除外`}
          ></SButton>
        </div>
        <SCheckNameLinkList
          register={registerFormItemsSearchList}
          title={`${itemName}検索対象`}
          list={itemsSearchList}
          setList={setItemsSearchList}
        />
        {errorsFormItemsSearchList?.checkboxList && (
          <p className="text-error">
            {errorsFormItemsSearchList?.checkboxList?.root?.message}
          </p>
        )}
      </div>
    </>
  );
};
