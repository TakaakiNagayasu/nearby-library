type Props = {
  handle: React.MouseEventHandler<HTMLButtonElement>;
  type: "button" | "reset" | "submit";
  child: string;
};

function isParams(value: unknown): value is Props {
  return Array.isArray(value);
}

export const SButton: React.FC<Props> = ({ handle, type, child }) => {
  return (
    <>
      <button
        className="my-2 h-8 bg-warning px-1 text-text"
        type={type}
        onClick={isParams(handle) ? () => handle : handle}
      >
        {child}
      </button>
    </>
  );
};

export default SButton;
