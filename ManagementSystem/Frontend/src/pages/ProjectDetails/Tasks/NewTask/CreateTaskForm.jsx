import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { CalendarIcon } from "lucide-react ";
import { Calendar } from "@/components/ui/calendar";

import React from "react";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";

const types = [
  {
    value: "toDo",
    label: "To Do",
  },
  {
    value: "inProgress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
];

const priorities = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
];

const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
  {
    id: "desktop",
    label: "Desktop",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "documents",
    label: "Documents",
  },
];

const members = [
  {
    value: "member1",
    label: "Member 1",
  },
  {
    value: "member2",
    label: "Member 2",
  },
  {
    value: "member3",
    label: "Member 3",
  },
];

function formatDate(date) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
function isValidDate(date) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}
const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
const CreateTaskForm = () => {
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [typeValue, setTypeValue] = React.useState("");
  const [priorityOpen, setPriorityOpen] = React.useState(false);
  const [priorityValue, setPriorityValue] = React.useState("");

  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [date, setDate] = React.useState(new Date("2025-06-01"));
  const [month, setMonth] = React.useState(new Date("2025-06-01"));
  const [value, setValue] = React.useState(formatDate(new Date("2025-06-01")));

  const form =
    useForm <
    z.infer <
    typeof FormSchema >>
      {
        resolver: zodResolver(FormSchema),
        defaultValues: {
          items: ["recents", "home"],
        },
      };

  return (
    <Form {...form}>
      <form>

        <DialogContent className="sm:max-w-[455px]">
          <DialogTitle className="text-lg font-semibold">
            Create New Task
          </DialogTitle>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input className="mt-4" id="name-1" name="title" placeholder="Type title here." />
              <Textarea placeholder="Type description here." />
              <div className=" flex flex-row gap-2">
              <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={typeOpen}
                    className="w-[200px] justify-between"
                  >
                    {typeValue
                      ? types.find((type) => type.value === typeValue)?.label
                      : "Select type..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search type..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No type found.</CommandEmpty>
                      <CommandGroup>
                        {types.map((type) => (
                          <CommandItem
                            key={type.value}
                            value={type.value}
                            onSelect={(currentValue) => {
                              setTypeValue(
                                currentValue === typeValue ? "" : currentValue
                              );
                              setTypeOpen(false);
                            }}
                          >
                            {type.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                typeValue === type.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={priorityOpen}
                    className="w-[200px] justify-between"
                  >
                    {priorityValue
                      ? priorities.find(
                          (priority) => priority.value === priorityValue
                        )?.label
                      : "Select priority..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search priority..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No priority found.</CommandEmpty>
                      <CommandGroup>
                        {priorities.map((priority) => (
                          <CommandItem
                            key={priority.value}
                            value={priority.value}
                            onSelect={(currentValue) => {
                              setPriorityValue(
                                currentValue === priorityValue
                                  ? ""
                                  : currentValue
                              );
                              setPriorityOpen(false);
                            }}
                          >
                            {priority.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                priorityValue === priority.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              </div>
              <div className="mt-2 flex flex-row gap-3">
                <Label htmlFor="date" className="px-1">
                  Due on
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <div className="relative flex gap-2">
                    <PopoverTrigger asChild>
                      <Input
                        id="date"
                        value={value}
                        placeholder="June 01, 2025"
                        className="bg-background pr-10 cursor-pointer"
                        readOnly
                        onClick={() => setCalendarOpen(true)}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setCalendarOpen(true);
                          }
                        }}
                      />
                    </PopoverTrigger>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        onClick={() => setCalendarOpen(true)}
                        tabIndex={-1}
                      >
                        {/* <CalendarIcon className="size-3.5" /> */}
                        <span className="sr-only">Select date</span>
                      </Button>
                    </PopoverTrigger>
                  </div>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={(date) => {
                        setDate(date);
                        setValue(formatDate(date));
                        setCalendarOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Form>
  );
};

export default CreateTaskForm;
