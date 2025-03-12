import Image from "next/image";
import Link from "next/link";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { CheckNameLinkItem } from "../object/CheckNameLinkObject";
import {
  checkNameLinkZodObject,
  type CheckNameLinkZodObject,
} from "../object/CheckNameLinkObject";

type Props = {
  register: UseFormRegister<CheckNameLinkZodObject>;
  title: string;
  list: CheckNameLinkZodObject;
  setList: UseFormSetValue<CheckNameLinkZodObject>;
};

export const SCheckNameLinkList: React.FC<Props> = ({
  register,
  title,
  list,
  setList,
}) => {
  const clickCheckboxHandler = (index: number) => {
    const checkNameLinkItemArray: CheckNameLinkItem[] = list.checkboxList.map(
      (item, i) => (i === index ? { ...item, checkbox: !item.checkbox } : item)
    );

    const parsedResult = checkNameLinkZodObject.shape.checkboxList.safeParse(
      checkNameLinkItemArray
    );
    setList(
      "checkboxList",
      parsedResult.success ? parsedResult.data : checkNameLinkItemArray
    );
  };

  return (
    <>
      <div className="flex justify-between">
        <p>{title}</p>
        <p>{`${list ? list?.checkboxList?.length : 0}件`}</p>
      </div>
      <div className="mt-2 h-[128px] overflow-y-auto border bg-accent text-text">
        {list.checkboxList?.map((item, index) => (
          <div key={index} className="h-[24px]">
            <input
              {...register(`checkboxList.${index}.checkbox`)}
              type="checkbox"
              checked={item.checkbox}
              className="mx-1 mt-[3px] appearance-auto align-top"
              onChange={() => clickCheckboxHandler(index)}
            />
            <p
              title={item.name}
              className="inline-block w-[244px] truncate md:w-[208px]"
            >
              {item.name}
            </p>
            <p
              title={item.sub}
              className="inline-block w-[80px] truncate md:w-[80px]"
            >
              {item.sub}
            </p>
            {item.link ? (
              <Link href={item.link} target="_blank">
                <Image
                  width={16}
                  height={16}
                  src={"/img/ExternalLink.svg"}
                  alt="外部リンク"
                  className="mx-1 mt-[3px] inline-block align-top"
                />
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
};
