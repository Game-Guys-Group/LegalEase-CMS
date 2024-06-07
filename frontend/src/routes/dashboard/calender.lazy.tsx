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

export default function Cal() {
  const [client, setClient] = useState<string | string[]>("");
  const [clients, setClients] = useState<ComboboxOptions[]>([]);

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

  return (
    <div className="flex w-full flex-col h-screen min-h-screen">
      <div className="">
        <div className="rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Calendar</h2>
          </div>

          <div className="mt-16 h-96 bg-muted/40 p-4">
            <h3 className="text-sm font-bold mb-2">Upcoming Appointments</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between bg-muted/20 rounded-lg p-4">
                <div>
                  <h4 className="text-sm font-bold">John Smith</h4>
                  <p className="text-sm text-gray-500">
                    Personal Injury Consultation
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">10:00 AM</p>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-muted/20 rounded-lg p-4">
                <div>
                  <h4 className="text-sm font-bold">Jane Doe</h4>
                  <p className="text-sm text-gray-500">
                    Workers' Compensation Claim
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">2:00 PM</p>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Add Event</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Event</DialogTitle>
                  <DialogDescription>
                    Fill out the details for your upcoming event.
                  </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-5 flex flex-col">
                      <Label> Client </Label>
                      <Combobox
                        options={clients}
                        label="Client"
                        onChange={(value) => setClient(value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-name">Event Name</Label>
                      <Input id="event-name" placeholder="Enter event name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Date</Label>
                      <Input id="event-date" type="date" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event-time">Time</Label>
                      <Input id="event-time" type="time" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Enter event description"
                      className="min-h-[100px]"
                    />
                  </div>
                </form>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="mr-auto">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Save Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
