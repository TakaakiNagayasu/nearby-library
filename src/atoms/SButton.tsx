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
        className="px-1 h-8 my-2 bg-sub text-text"
        type={type}
        onClick={isParams(handle) ? () => handle : handle}
      >
        {child}
      </button>
    </>
  );
};

export default SButton;
