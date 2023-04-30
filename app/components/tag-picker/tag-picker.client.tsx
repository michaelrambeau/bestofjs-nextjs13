"use client";

import { forwardRef, useEffect, useState } from "react";
import cx from "clsx";
import { useCombobox, useMultipleSelection } from "downshift";

type Props = {
  allTags: BestOfJS.Tag[];
  values: string[];
  onChange: (values: string[]) => void;
};

export function TagPicker({ allTags, values, onChange }: Props) {
  const initialSelectedItems = values.map((value) =>
    allTags.find((tag) => tag.code === value)
  ) as BestOfJS.Tag[];

  function getFilteredTags(selectedItems: BestOfJS.Tag[], inputValue: string) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return allTags.filter(function filterTag(tag: BestOfJS.Tag) {
      return (
        !selectedItems.includes(tag) &&
        (tag.name.toLowerCase().includes(lowerCasedInputValue) ||
          tag.code.toLowerCase().includes(lowerCasedInputValue))
      );
    });
  }

  const [inputValue, setInputValue] = useState<string>("");
  const [selectedItems, setSelectedItems] =
    useState<BestOfJS.Tag[]>(initialSelectedItems);
  const items = getFilteredTags(selectedItems, inputValue);

  useEffect(() => {
    const items = values.map((value) =>
      allTags.find((tag) => tag.code === value)
    ) as BestOfJS.Tag[];
    setSelectedItems(items);
    setInputValue("");
  }, [values]);

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
  } = useMultipleSelection({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          setSelectedItems(newSelectedItems || []);
          onChange(newSelectedItems!.map((tag) => tag.code));
          break;
        default:
          break;
      }
    },
  });
  const {
    isOpen,
    getToggleButtonProps,
    // getLabelProps,
    closeMenu,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.name : "";
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && {
              isOpen: true,
              highlightedIndex: 0,
            }),
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (!newSelectedItem) return;
          const updatedItems = [...selectedItems, newSelectedItem];
          setSelectedItems(updatedItems);
          onChange(updatedItems.map((tag) => tag.code));
          closeMenu();
          break;
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue!);
          break;
        default:
          break;
      }
    },
  });

  return (
    <div className="w-full rounded-lg">
      <div className="shadow-sm bg-gray-700 flex gap-2 items-center flex-wrap p-1.5 rounded-md">
        {selectedItems.map(function renderSelectedItem(
          selectedItemForRender,
          index
        ) {
          return (
            <SelectedTag
              key={`selected-item-${index}`}
              onRemove={() => removeSelectedItem(selectedItemForRender)}
              {...getSelectedItemProps({
                selectedItem: selectedItemForRender,
                index,
              })}
            >
              {selectedItemForRender.name}
            </SelectedTag>
          );
        })}
        <div className="flex gap-0.5 grow">
          <input
            placeholder="Pick tags"
            className="input input-ghost w-full h-10"
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
          />
          <button
            aria-label="toggle menu"
            className="px-2"
            type="button"
            {...getToggleButtonProps()}
          >
            &#8595;
          </button>
        </div>
      </div>
      <ul
        className={cx(
          `bg-base-100 absolute w-inherit mt-1 shadow-md max-h-80 overflow-scroll p-0 z-50 w-[592px]`,
          !(isOpen && items.length) && "hidden"
        )}
        {...getMenuProps()}
      >
        {isOpen && (
          <>
            {inputValue && (
              <li className="py-2 px-3 shadow-sm">Search for {inputValue}</li>
            )}
            {items.map((item, index) => (
              <li
                className={cx(
                  highlightedIndex === index && "bg-orange-500",
                  selectedItem === item && "font-bold",
                  "py-2 px-3 shadow-sm"
                )}
                key={item.code}
                {...getItemProps({ item, index })}
              >
                <span className="text-sm text-base-700">{item.name}</span>
                <span className="text-sm text-base-500 ml-1">
                  ({item.counter})
                </span>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}

// eslint-disable-next-line react/display-name
const SelectedTag = forwardRef(
  (
    {
      label,
      onRemove,
      children,
      ...rest
    }: {
      label: string;
      onRemove: () => void;
      children: React.ReactNode;
    },
    ref
  ) => {
    return (
      <span
        className="bg-gray-600 rounded-md px-4 py-2 focus:bg-red-400"
        {...rest}
        ref={ref as any}
      >
        {children}
        <span
          className="px-1 cursor-pointer"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          &#10005;
        </span>
      </span>
    );
  }
);
