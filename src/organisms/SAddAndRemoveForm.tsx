import {
  type CheckNameLinkZodObject,
  type CheckNameLinkItem,
  checkNameLinkZodObject,
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
  controlItemsCandidateList: Control<CheckNameLinkZodObject, unknown>;
  registerFormItemsCandidateList: UseFormRegister<CheckNameLinkZodObject>;
  handleSubmitFormItemsCandidateList: UseFormHandleSubmit<CheckNameLinkZodObject>;
  getValuesFormItemsCandidateList: UseFormGetValues<CheckNameLinkZodObject>;
  setValueFormItemsCandidateList: UseFormSetValue<CheckNameLinkZodObject>;
  errorsFormItemsCandidateList: FieldErrors<CheckNameLinkZodObject>;
  controlItemsSearchList: Control<CheckNameLinkZodObject, unknown>;
  registerFormItemsSearchList: UseFormRegister<CheckNameLinkZodObject>;
  handleSubmitFormItemsSearchList: UseFormHandleSubmit<CheckNameLinkZodObject>;
  getValuesFormItemsSearchList: UseFormGetValues<CheckNameLinkZodObject>;
  setValueFormItemsSearchList: UseFormSetValue<CheckNameLinkZodObject>;
  errorsFormItemsSearchList: FieldErrors<CheckNameLinkZodObject>;
};

export const SAddAndRemoveForm: React.FC<Props> = ({
  itemName,
  controlItemsCandidateList,
  registerFormItemsCandidateList,
  handleSubmitFormItemsCandidateList,
  getValuesFormItemsCandidateList,
  setValueFormItemsCandidateList,
  errorsFormItemsCandidateList,
  controlItemsSearchList,
  registerFormItemsSearchList,
  handleSubmitFormItemsSearchList,
  getValuesFormItemsSearchList,
  setValueFormItemsSearchList,
  errorsFormItemsSearchList,
}) => {
  const addHandler = () => {
    const prevList = getValuesFormItemsSearchList()?.checkboxList ?? [];
    const checkNameLinkItemArray: CheckNameLinkItem[] = [
      ...prevList,
      ...(getValuesFormItemsCandidateList()
        ?.checkboxList.filter((item) => item.checkbox)
        .filter(
          (item) =>
            !prevList.some((searchItem) => item.value === searchItem.value)
        )
        .map(
          (item): CheckNameLinkItem => ({
            enabled: true,
            checkbox: false,
            name: item.name,
            sub: item.sub,
            value: item.value,
            link: item.link,
          })
        ) ?? []),
    ];
    const parsedResult = checkNameLinkZodObject.shape.checkboxList.safeParse(
      checkNameLinkItemArray
    );
    setValueFormItemsSearchList("checkboxList", parsedResult.success ? parsedResult.data : checkNameLinkItemArray);
  };

  const removeHandler = () => {
    const prevList = getValuesFormItemsSearchList()?.checkboxList ?? [];
    const checkNameLinkItemArray: CheckNameLinkItem[] = prevList
      .filter((item) => !item.checkbox)
      .map((item) => ({
        enabled: true,
        checkbox: false,
        name: item.name,
        sub: item.sub,
        value: item.value,
        link: item.link,
      }));
      const parsedResult = checkNameLinkZodObject.shape.checkboxList.safeParse(
        checkNameLinkItemArray
      );
      setValueFormItemsSearchList("checkboxList", parsedResult.success ? parsedResult.data : checkNameLinkItemArray);
    };

  const {
  } = useFieldArray({
    control: controlItemsCandidateList,
    name: "checkboxList",
  });

  const {
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
          list={getValuesFormItemsCandidateList()}
          setList={setValueFormItemsCandidateList}
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
          list={getValuesFormItemsSearchList()}
          setList={setValueFormItemsSearchList}
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
