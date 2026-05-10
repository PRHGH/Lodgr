import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";

const formSchema = z
  .object({
    checkIn: z.string(),
    checkOut: z.string(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });

const initialToday = new Date().toISOString().split("T")[0];
const initialTomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

export default function BookingForm({ onSubmit, isLoading, hotelId }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkIn: initialToday,
      checkOut: initialTomorrow,
    },
  });
  const selectedCheckIn = useWatch({
    control: form.control,
    name: "checkIn",
  });

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      hotelId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="checkIn"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Check-in Date</FormLabel>
              <FormControl>
                <input
                  type="date"
                  className="rounded-full border px-4 py-2"
                  min={initialToday}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="checkOut"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Check-out Date</FormLabel>
              <FormControl>
                <input
                  type="date"
                  className="rounded-full border px-4 py-2"
                  min={selectedCheckIn || initialToday}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="black-pill w-full rounded-full" disabled={isLoading}>
          {isLoading ? "Creating booking..." : "Continue to Payment"}
        </Button>
      </form>
    </Form>
  );
}

