import { ArrowLeft, Search } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { UserType } from "@/utils/types";
import { getUserByLetter } from "@/actions/user.api";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/state-context";

import ContactItem from "@/components/contact/contact-item";

export interface UserGroups {
  [key: string]: UserType[];
}

function ContactList() {
  const [contacts, setContacts] = useState<UserGroups>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContacts, setSearchContacts] = useState<UserGroups>({});
  const [{ userInfo }, dispatch] = useStateProvider();

  useEffect(() => {
    if (searchTerm.length) {
      let filteredContacts: UserGroups = {};
      Object.keys(contacts).forEach((key) => {
        filteredContacts[key] = contacts[key].filter((obj) =>
          obj?.first_name!.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setSearchContacts(filteredContacts);
    } else {
      setSearchContacts(contacts);
    }
  }, [searchTerm]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { users } = await getUserByLetter(userInfo?.id!);
        setContacts(users);
        setSearchContacts(users);
      } catch (error) {
        console.log(error);
      }
    };

    getContacts();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-fit flex items-end px-3 py-5">
        <div className="flex items-center gap-12 text-accent-foreground">
          <ArrowLeft
            className="cursor-pointer"
            onClick={() =>
              dispatch({
                type: reducerCases.SET_ALL_CONTACTS_PAGE,
              })
            }
          />
          <span>New Chat</span>
        </div>
      </div>
      <div className="pb-3">
        <div className="mx-10 relative bg-gray-400/40 rounded-md">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <div
            className="relative flex ms-4 ml-10"
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
              value={searchTerm}
              onChange={handleSearch}
            />
            <label
              htmlFor="search-focus"
              className="pointer-events-none absolute left-5 -top-0.5 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-valid:-translate-y-[0.9rem] peer-valid:scale-[0.8] dark:text-neutral-400 dark:peer-focus:text-primary"
            >
              Search
            </label>
          </div>
        </div>
      </div>
      <div className="px-6 overflow-auto">
        {Object.entries(searchContacts).map(([letter, users], index) => {
          return (
            users.length > 0 && 
            <ContactItem key={index} letter={letter} users={users} />
          );
        })}
      </div>
    </div>
  );
}

export default ContactList;
