import React, { useState } from "react";
import "./styles.css";

function DynamicList() {
  const [items, setItems] = useState([
    { id: 1, text: "Learn React" },
    { id: 2, text: "Build Awesome Apps" },
    { id: 3, text: "Master Hooks and Context" }
  ]);

  const [newItemText, setNewItemText] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [editedItemText, setEditedItemText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const addItem = () => {
    if (newItemText.trim() === "") return;
    const newItem = { id: Date.now(), text: newItemText };
    setItems([...items, newItem]);
    setNewItemText("");
  };

  const removeItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  const editItemText = (id) => {
    const itemToEdit = items.find((item) => item.id === id);
    setEditedItemText(itemToEdit.text);
    setEditItem(id);
  };

  const saveEditedItem = (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, text: editedItemText } : item
    );
    setItems(updatedItems);
    setEditItem(null);
  };

  return (
    <div className="container">
      <h2>Your To-Do List:</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul className="list-container">
        {items
          .filter((item) =>
            item.text.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((item) => (
            <li key={item.id} className="list-item">
              {editItem === item.id ? (
                <>
                  <input
                    type="text"
                    className="new-item"
                    value={editedItemText}
                    onChange={(e) => setEditedItemText(e.target.value)}
                  />
                  <button
                    className="cta"
                    onClick={() => saveEditedItem(item.id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div className="item-text">{item.text}</div>
                  <button className="cta" onClick={() => editItemText(item.id)}>
                    Edit
                  </button>
                  <button
                    className="cta red"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </>
              )}
            </li>
          ))}
      </ul>
      {items.length === 0 && searchQuery === "" && (
        <p>Your list is empty. Add new items:</p>
      )}
      {items.length > 0 &&
        items.filter((item) =>
          item.text.toLowerCase().includes(searchQuery.toLowerCase())
        ).length === 0 && <p>No results found for "{searchQuery}"</p>}
      <div className="add-new-item">
        <input
          type="text"
          className="new-item"
          placeholder="Type a new item..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
        />
        <button className="cta" onClick={addItem}>
          Add
        </button>
      </div>
      <p>Total items on the list: {items.length}</p>
    </div>
  );
}

export default DynamicList;
