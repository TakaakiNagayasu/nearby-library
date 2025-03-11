import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
  register: UseFormRegisterReturn;
  value: string;
  handle: React.ChangeEventHandler<HTMLInputElement>;
  fieldError?: FieldError;
};

export const SInputText: React.FC<Props> = ({register, value, handle, fieldError}) => {
  return (
    <>
      <input
        {...register}
        type="text"
        className="mb-2 mr-2 w-full bg-accent px-2 py-1 text-text text-left"
        value={value}
        onChange={handle}
      />
      <br />
      {fieldError && <p className="text-error">{fieldError.message}</p>}
    </>
  );
};
