import { useState } from "react";
import { Item, ItemType, ItemTypeConst } from "../types/Item";

type Props = {
  items: Array<Item>;
  handleChooseItem: (item: Item | null) => void;
  chosenItem: Item | null;
};

function ItemPicker({ items, handleChooseItem, chosenItem }: Props) {
  const [search, setSearch] = useState("");
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <section className="py-3 px-5 flex-1 border-t-2 border-white">
      <div className="mb-2">
        <h1 className="text-2xl font-bold mb-2">Item Search:</h1>
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
      </div>
      {search !== "" ? (
        filteredItems.length > 0 ? (
          <ul className="px-3">
            {filteredItems
              .slice(0, filteredItems.length > 10 ? 10 : filteredItems.length)
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
    </section>
  );
}

export default ItemPicker;
