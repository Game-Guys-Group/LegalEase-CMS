"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
export type ComboboxOptions = {
  value: string;
  label: string;
};

interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  onChange: (event: string) => void;
  options: ComboboxOption[];
  label: string;
}

export function Combobox({ onChange, options, label }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          aria-expanded={open}
          role="combobox"
          className="rounded-l-none"
        >
          {value.length == 0 ? `Select ${label}` : value}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandList>
            <CommandEmpty>No options available</CommandEmpty>

            <CommandInput placeholder="Search options" />
            <CommandGroup className="cursor-pointer">
              <CommandList>
                {options?.map((val) => (
                  <CommandItem
                    className="cursor-pointer"
                    value={val.value}
                    onSelect={(val) => {
                      setOpen(false);
                      onChange(val);
                      setValue(
                        options.find((opt) => opt.value === val)?.label || val,
                      );
                      console.log(val);
                    }}
                  >
                    {val.label}
                  </CommandItem>
                ))}
              </CommandList>

              <CommandSeparator />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
