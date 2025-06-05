import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@repo/ui/components/command";
import { Command as CommandPrimitive } from "cmdk";

export type MultiSelectOption = {
    value: string;
    label: string;
};

export interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: MultiSelectOption[];
    onSelectionChange: (selected: MultiSelectOption[]) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    maxSelections?: number;
}

export function MultiSelect({
    options,
    selected,
    onSelectionChange,
    placeholder = "Select options...",
    className,
    disabled = false,
    maxSelections,
}: MultiSelectProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const handleUnselect = React.useCallback(
        (option: MultiSelectOption) => {
            if (disabled) return;
            const newSelected = selected.filter((s) => s.value !== option.value);
            onSelectionChange(newSelected);
        },
        [selected, onSelectionChange, disabled]
    );

    const handleSelect = React.useCallback(
        (option: MultiSelectOption) => {
            if (disabled) return;
            if (maxSelections && selected.length >= maxSelections) return;

            const newSelected = [...selected, option];
            onSelectionChange(newSelected);
            setInputValue("");
        },
        [selected, onSelectionChange, disabled, maxSelections]
    );

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (disabled) return;

            const input = inputRef.current;
            if (input) {
                if (e.key === "Delete" || e.key === "Backspace") {
                    if (input.value === "" && selected.length > 0) {
                        const newSelected = [...selected];
                        newSelected.pop();
                        onSelectionChange(newSelected);
                    }
                }
                if (e.key === "Escape") {
                    input.blur();
                    setOpen(false);
                }
            }
        },
        [selected, onSelectionChange, disabled]
    );

    const selectables = React.useMemo(
        () =>
            options.filter(
                (option) => !selected.some((s) => s.value === option.value)
            ),
        [options, selected]
    );

    const filteredSelectables = React.useMemo(
        () =>
            selectables.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            ),
        [selectables, inputValue]
    );

    const isMaxReached = maxSelections ? selected.length >= maxSelections : false;

    return (
        <Command
            onKeyDown={handleKeyDown}
            className={`overflow-visible bg-transparent ${className || ""}`}
        >
            <div
                className={`group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                <div className="flex flex-wrap gap-1">
                    {selected.map((option) => (
                        <Badge key={option.value} variant="secondary">
                            {option.label}
                            {!disabled && (
                                <button
                                    type="button"
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(option);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(option)}
                                    aria-label={`Remove ${option.label}`}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            )}
                        </Badge>
                    ))}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => !disabled && setOpen(true)}
                        placeholder={
                            isMaxReached
                                ? "Maximum selections reached"
                                : placeholder
                        }
                        disabled={disabled || isMaxReached}
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                <CommandList>
                    {open && filteredSelectables.length > 0 && !isMaxReached ? (
                        <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-full overflow-auto max-h-60">
                                {filteredSelectables.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onSelect={() => handleSelect(option)}
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </div>
                    ) : null}
                </CommandList>
            </div>
        </Command>
    );
}