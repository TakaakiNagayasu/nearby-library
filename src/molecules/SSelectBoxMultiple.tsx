type Props = {
  defaultValues: Array<string>;
  handle: React.ChangeEventHandler<HTMLSelectElement>;
  items: object;
};

export const SSelectBoxMultiple: React.FC<Props> = ({
  defaultValues,
  handle,
  items,
}) => {
  return (
    <>
      <select
        multiple
        size={Object.keys(items).length}
        onChange={(e) => handle(e)}
        className="bg-accent w-full text-text"
      >
        {Object.values(items).map((item) => (
          // eslint-disable-next-line react/jsx-key
          <option value={item.value}
            {...defaultValues.map((value)=>(value === item ? "selected" : ""))}
          >{item.str}
          </option>
        ))}
      </select>
    </>
  );
};

export default SSelectBoxMultiple;
