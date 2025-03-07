import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
  register: UseFormRegisterReturn;
  fieldError?: FieldError;
};

export const SInputTextShort: React.FC<Props> = ({register, fieldError}) => {
  return (
    <>
      <input
        {...register}
        type="text"
        className="mb-2 mr-2 w-full bg-accent px-2 py-1 text-text"
      />
      <br />
      {fieldError && <p className="text-error">{fieldError.message}</p>}
    </>
  );
};
