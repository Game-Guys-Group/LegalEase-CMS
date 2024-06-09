import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/calender")({
  component: Cal,
});

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Combobox, ComboboxOptions } from "@/components/combo-box";
import { useEffect, useState } from "react";
import { useAuth } from "@/api-helper";
import { useQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDaysIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface Event {
  client_id: string;
  event_name: string;
  date: string;
  time: string;
  description: string;
}

interface EventResponse {
  event_id: number;
  client_id: string;
  client_name: string;
  event_name: string;
  date: string;
  description: string;
}

type event_key = "client_id" | "event_name" | "date" | "time" | "description";

function Reschedule({ event_id }: { event: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Reschedule Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reschedule Event</DialogTitle>
          <DialogDescription>
            Please select a new date and time for the event.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="col-span-3 justify-start text-left font-normal"
                >
                  <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                  Select a date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Select>
              <SelectTrigger className="col-span-3 text-gray-500 dark:text-gray-400">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="13:00">1:00 PM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
                <SelectItem value="17:00">5:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Reschedule</Button>
          <div>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Cal() {
  const [client, setClient] = useState<string | string[]>("");
  const [clients, setClients] = useState<ComboboxOptions[]>([]);
  const [event, setEvent] = useState<Event>({} as Event);
  const set_event = (key: event_key, value: string) => {
    setEvent({ ...event, [key]: value });
    console.log(key, value);
  };

  const events = useAuth<EventResponse[]>({
    url: "/events/get",
    parseFn: (data) => data,
  });

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch("/user/clients/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_key")}`,
        },
      });

      if (!response.ok) {
        let json = await response.json();
        throw new Error(json["detail"]);
      }

      const value = await response.json();
      const cls: Array<ComboboxOptions> = value.map(
        (c: { id: number; name: string }) => {
          return { value: String(c["id"]), label: c["name"] };
        },
      );

      setClients(cls);
      if (cls.length == 0) {
        setClient("Please Add Clients");
      }
    };

    fetchClients();
  }, [client]);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const clear = () => {
    setEvent({} as Event);
  };

  const handle_submit = async (e: React.FormEvent) => {
    if (isSubmitting) return;
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!event.client_id || !event.event_name || !event.date || !event.time) {
      setError("Please fill out all fields");
      setIsSubmitting(false);
      return;
    }

    const response = await fetch("/events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_key")}`,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      let json = await response.json();
      console.log(json);
      setError(json["detail"][0]["msg"]);
    } else {
      setError(null);
      setOpen(false);
      clear();
    }
    setIsSubmitting(false);
  };

  const res = useQuery({ queryKey: ["events"], queryFn: events.getData });

  return (
    <div className="flex w-full flex-col h-screen min-h-screen">
      <div className="">
        <div className="rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Calendar</h2>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Add Event</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Event</DialogTitle>
                  <DialogDescription>
                    Fill out the details for your upcoming event.
                  </DialogDescription>
                  {error && (
                    <p className="bg-destructive text-white rounded-sm w-full p-4">
                      {error}
                    </p>
                  )}
                </DialogHeader>
                <form className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-5 flex flex-col">
                      <Label> Client </Label>
                      <Combobox
                        options={clients}
                        label="Client"
                        onChange={(value) => set_event("client_id", value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-name">Event Name</Label>
                      <Input
                        id="event-name"
                        placeholder="Enter event name"
                        value={event.event_name}
                        onChange={(value) =>
                          set_event("event_name", value.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="space-y-2 w-full justify-start text-left font-normal"
                          >
                            <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                            {event.date
                              ? format(event.date, "dd/MM/yyyy")
                              : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              event.date ? new Date(event.date) : undefined
                            }
                            onSelect={(day) =>
                              day &&
                              set_event("date", format(day, "dd/MM/yyyy"))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event-time">Time</Label>

                      <Select
                        onValueChange={(value) => set_event("time", value)}
                      >
                        <SelectTrigger className="col-span-3 text-gray-500 dark:text-gray-400">
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Enter event description"
                      className="min-h-[100px]"
                      value={event.description}
                      onChange={(value) =>
                        set_event("description", value.target.value)
                      }
                    />
                  </div>
                </form>

                <div className="flex justify-between">
                  <DialogClose asChild>
                    <Button variant="outline" className="mr-auto">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button onClick={handle_submit}>Save Event</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="h-3/4">
            <div className="mt-16 h-96 bg-muted/40 p-4">
              <h3 className="text-sm font-bold mb-2">Upcoming Appointments</h3>
              <div className="grid gap-4">
                {res.data?.map((event, k) => (
                  <div
                    key={k}
                    className="flex items-center justify-between bg-muted/20 rounded-lg p-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold">{event.client_name}</h4>
                      <p className="text-sm text-gray-500">
                        {event.event_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{event.date}</p>
                      <Reschedule event={event.event_id} />
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
          <div className="mt-4"></div>
        </div>
      </div>
    </div>
  );
}
