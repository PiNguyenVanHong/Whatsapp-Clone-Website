import { ListFilter, Search } from "lucide-react";
import { ChangeEvent } from "react";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/state-context";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function SearchBar() {
  const [{contactSearch}, dispatch] = useStateProvider();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: reducerCases.SET_CONTACT_SEARCH,
      contactSearch: e.target.value,
    });
  };

  return (
    <div className="w-full px-6 py-4 bg-gray-800">
      <div className="max-w-m mx-auto justify-between flex items-center gap-5">
        <div className="w-full relative bg-card rounded-md">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <div
            className="relative flex ms-4 ml-3" 
            data-twe-input-wrapper-init
            data-twe-input-group-ref
          >
            <input
              type="search"
              className="peer block w-full rounded border-0 bg-transparent px-5 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary peer-valid:placeholder:opacity-100 dark:text-white dark:placeholder:text-neutral-300 dark:peer-focus:text-primary [&:not(:placeholder-shown)]:placeholder:opacity-0"
              aria-label="Search"
              id="search-focus"
              aria-describedby="basic-addon4"
              required
              value={contactSearch}
              onChange={handleOnChange}
            />
            <label
              htmlFor="search-focus"
              className="pointer-events-none absolute left-5 -top-0.5 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-valid:-translate-y-[0.9rem] peer-valid:scale-[0.8] dark:text-neutral-400 dark:peer-focus:text-primary"
            >
              Search
            </label>
          </div>
        </div>
        <div>
          <Button variant={"alternative"} size={"sm"} onClick={() => toast.success("Test", { duration: Infinity })}>
            <ListFilter size={17} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
