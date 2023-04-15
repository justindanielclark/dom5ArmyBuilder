import { useState } from "react";
import { Item, ItemType, ItemTypeConst } from "../types/Item";
import upSVG from "../images/up.svg";
import downSVG from "../images/down.svg";
import { Displaying } from "../App";

type Props = {
  items: Array<Item>;
  handleChooseItem: (item: Item | null) => void;
  chosenItem: Item | null;
  displaying: boolean;
  toggleDisplay: (displayKey: keyof Displaying) => void;
};

function ItemPicker({
  items,
  handleChooseItem,
  chosenItem,
  displaying,
  toggleDisplay,
}: Props) {
  const [search, setSearch] = useState("");
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <section className="py-3 px-5 w-full">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-2 underline underline-offset-2">
          Item Search:
        </h1>
        <button
          className="w-8 h-8"
          style={{
            backgroundImage: `url(${displaying ? downSVG : upSVG})`,
            backgroundSize: "cover",
          }}
          onClick={(e) => {
            setSearch("");
            handleChooseItem(null);
            toggleDisplay("ItemSearch");
          }}
        ></button>
      </div>
      {displaying ? (
        <>
          <div>
            <input
              value={search}
              type="text"
              placeholder="Fire Brand"
              className="px-2 h-8 bg-white text-black"
              onChange={(e) => {
                setSearch(e.target.value);
                handleChooseItem(null);
              }}
            />
            <button
              className="px-2 bg-neutral-500 text-neutral-50 border h-8"
              onClick={(e) => {
                if (chosenItem !== null) {
                  handleChooseItem(null);
                }
                if (search !== "") {
                  setSearch("");
                }
              }}
            >
              Clear
            </button>
          </div>
          {search !== "" ? (
            filteredItems.length > 0 ? (
              <ul className="px-3">
                {filteredItems
                  .slice(
                    0,
                    filteredItems.length > 10 ? 10 : filteredItems.length
                  )
                  .map((item) => (
                    <li key={item.id} className="flex flex-row">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={
                          chosenItem && chosenItem.id === item.id ? true : false
                        }
                        onChange={(e) => {
                          e.target.checked
                            ? handleChooseItem(item)
                            : handleChooseItem(null);
                        }}
                      />
                      <span className="inline-block flex-1">{item.name}</span>
                      <span className="inline-block">{`(${item.type})`}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>Unable To Find Any Items With That Name</p>
            )
          ) : undefined}
        </>
      ) : undefined}
    </section>
  );
}

export default ItemPicker;
