export default function BaseSelect({ disabled, selected, onChange, id, label, ...props }) {
  const selectHandler = (event) => {
    const { options } = event.target;
    const selectedIndex = options.selectedIndex;

    if (props.name) {
      onChange(options[selectedIndex].value, props.name);
    } else {
      onChange(options[selectedIndex].value, event);
    }
  };
  const selectEl = (
    <select
      id={id}
      disabled={disabled}
      value={selected}
      onChange={selectHandler}
      className="w-full rounded-lg grow p-2 border-2 border-dashed border-[#ededed] outline-none"
      aria-label={label || undefined}
    >
      {props.children}
    </select>
  );
  if (label && id) {
    return (
      <div className="w-full">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        {selectEl}
      </div>
    );
  }
  return selectEl;
}
