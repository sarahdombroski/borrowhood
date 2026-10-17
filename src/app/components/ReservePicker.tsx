"use client";
import "react-day-picker/style.css";
import { useState, useTransition } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { reserveItem } from "../(app)/items/actions";
import { useRouter } from "next/navigation";

type Booked = { 
  startDate: Date;
  endDate: Date;
}

export function ReservePicker({ itemId, booked }: { itemId: number; booked: Booked[] }) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const bookedMatchers = booked.map((b) => ({
    from: b.startDate,
    to: new Date(b.endDate.getTime() - 86_400_000),
  }));

  function submit() {
    if (!range?.from || !range?.to) return;

    const start = new Date(range.from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(range.to);
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);

    startTransition(async () => {
      const result = await reserveItem({
        itemId,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
      if (result.ok) {
        setError(null);
        setRange(undefined);
        router.push("../../reservations");
      }
      setError(result.ok ? null : messages[result.error]);
    });

  }

  return (
    <div>
      <DayPicker 
        mode="range"
        selected={range}
        onSelect={setRange}
        disabled={[{ before: new Date() }, ...bookedMatchers]}
        excludeDisabled
        modifiers={{ booked: bookedMatchers }}
        modifiersClassNames={{ booked: "line-through opacity-50" }}
      />
      {range?.from && range?.to && (
        <p>{range.from.toLocaleDateString()} to {range.to.toLocaleDateString()}</p>
      )}
      {error && <p role="alert">{error}</p>}
      <button onClick={submit} disabled={isPending || !range?.from || !range?.to}>
        {isPending ? "Reserving..." : "Reserve"}
      </button>
    </div>
  );
}

const messages = {
  INVALID_INPUT: "Those dates aren't valid.",
  NOT_FOUND: "Item not found.",
  OWN_ITEM: "You can't reserve your own item.",
  TOO_LONG: "That's longer than the owner allows.",
  ALREADY_BOOKED: "Someone just booked those dates. Pick another range.",
} as const;