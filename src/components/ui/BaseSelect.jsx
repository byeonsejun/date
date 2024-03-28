import React from 'react';

export default function BaseSelect({ disabled, selected, onChange, ...props }) {
  const selectHandler = (event) => {
    const { options } = event.target;
    const selectedIndex = options.selectedIndex;

    if (props.name) {
      onChange(options[selectedIndex].value, props.name);
    } else {
      onChange(options[selectedIndex].value, event);
    }
  };
  return (
    <select
      disabled={disabled}
      value={selected}
      onChange={selectHandler}
      className="w-full rounded-lg grow p-2 border-2 border-dashed border-[#ededed] outline-none"
    >
      {props.children}
    </select>
  );
}
