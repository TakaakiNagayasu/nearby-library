import type { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  register: UseFormRegisterReturn;
};

export const SInputTextShort: React.FC<Props> = ({ register }) => {
  return (
    <>
      <input
        {...register}
        type="text"
        className="mb-2 mr-2 w-1/3 bg-accent px-2 py-1 text-text text-left"
      />
    </>
  );
};
