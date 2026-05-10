import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

import { Sparkles, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { clearQuery, setQuery } from "@/lib/features/searchSlice";

export default function AISearch() {
  const dispatch = useDispatch();

  const [value, setValue] = useState("");

  function handleSearch() {
    if (value.trim()) {
      dispatch(setQuery(value.trim()));
    }
  }

  function handleClear() {
    setValue("");
    dispatch(clearQuery());
  }

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  });

  return (
    <form
      className="z-10 w-full"
      onSubmit={(event) => {
        event.preventDefault();
        handleSearch();
      }}
    >
      <div className="rounded-2xl bg-white p-3 shadow-2xl shadow-black/20 sm:rounded-full">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="relative grow">
          <Input
            placeholder="Quiet beach hotel, romantic city escape..."
            name="query"
            value={value}
            className="h-12 w-full rounded-full border-black/10 bg-[#f6f1ea] px-5 pr-12 text-sm text-neutral-950 placeholder:text-neutral-500 sm:text-base"
            onChange={(e) => setValue(e.target.value)}
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-neutral-500 hover:bg-black/5"
              onClick={handleClear}
              aria-label="Clear AI search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          type="submit"
          className="black-pill h-12 gap-x-2 rounded-full px-6"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm">AI Search</span>
        </Button>
        </div>
      </div>
    </form>
  );
}
