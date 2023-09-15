import React, { useState } from "react";
import "./styles.css"; // Import the CSS file

function DynamicList() {
  const [items, setItems] = useState([
    { id: 1, text: "Learn React" },
    { id: 2, text: "Build Awesome Apps" },
    { id: 3, text: "Master Hooks and Context" }
  ]);

  const [newItemText, setNewItemText] = useState("");

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

  return (
    <div className="container">
      <h2>Your To-Do List:</h2>
      <input
        type="text"
        className="new-item"
        placeholder="Type a new item..."
        value={newItemText}
        onChange={(e) => setNewItemText(e.target.value)}
      />
      <button className="cta" onClick={addItem}>
        Add to List
      </button>
      <ul className="list-container">
        {items.map((item) => (
          <li key={item.id} className="list-item">
            {item.text}
            <button className="cta" onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>Total items on the list: {items.length}</p>
    </div>
  );
}

export default DynamicList;
