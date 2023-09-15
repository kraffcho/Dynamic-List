import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

function DynamicList() {
  const [items, setItems] = useState(() => {
    const savedItems = JSON.parse(localStorage.getItem("todoItems")) || [];
    return savedItems;
  });

  const [title, setTitle] = useState(() => {
    const savedTitle =
      localStorage.getItem("todoTitle") ||
      "To-Do List Title - Click to Edit 😋";
    return savedTitle;
  });

  const [newItemText, setNewItemText] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [editedItemText, setEditedItemText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    localStorage.setItem("todoItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("todoTitle", title);
  }, [title]);

  const saveTitle = () => {
    setTitle(title);
    setEditItem(null);
  };

  const addItem = () => {
    if (newItemText.trim() === "") return;
    const newItem = {
      id: Date.now(),
      text: newItemText,
      timestamp: new Date().toLocaleString("en-GB", { timeZone: "UTC" })
    };
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

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredItems = items.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editItem !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editItem]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container">
      {editItem !== "title" ? (
        <h2 className="title" onClick={() => setEditItem("title")}>
          {title}
        </h2>
      ) : (
        <div className="title-input-container">
          <input
            type="text"
            className="title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                saveTitle();
              }
            }}
            onBlur={() => setEditItem(null)}
            autoFocus
          />
          <button className="cta" onClick={saveTitle}>
            Update
          </button>
        </div>
      )}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery !== "" && (
          <button className="cta clear-button" onClick={clearSearch}>
            Clear
          </button>
        )}
      </div>
      <ul className="list-container" id="todo-list">
        {filteredItems.slice(startIndex, endIndex).map((item) => (
          <li key={item.id} className="list-item">
            {editItem === item.id ? (
              <>
                <input
                  type="text"
                  className="new-item"
                  value={editedItemText}
                  ref={inputRef}
                  onChange={(e) => setEditedItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveEditedItem(item.id);
                    }
                  }}
                />
                <button className="cta" onClick={() => saveEditedItem(item.id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <div className="item-container">
                  <div
                    className="item-text"
                    onClick={() => editItemText(item.id)}
                  >
                    {item.text}
                  </div>
                  <div className="timestamp">{item.timestamp}</div>
                </div>
                <button
                  className="cta remove-button"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      {filteredItems.length === 0 && searchQuery !== "" && (
        <p>No results found for "{searchQuery}"</p>
      )}
      {filteredItems.length > itemsPerPage && (
        <div className="pagination">
          {currentPage > 1 ? (
            <button onClick={() => handlePageChange(currentPage - 1)}>
              Previous Page
            </button>
          ) : (
            <button className="disabled">Previous Page</button>
          )}
          {totalPages > 1 && (
            <select
              value={currentPage}
              onChange={(e) => handlePageChange(parseInt(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          )}
          {currentPage < totalPages ? (
            <button onClick={() => handlePageChange(currentPage + 1)}>
              Next Page
            </button>
          ) : (
            <button className="disabled">Next Page</button>
          )}
        </div>
      )}
      <div className="add-new-item">
        <input
          type="text"
          className="new-item"
          placeholder="Type a new item..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addItem();
            }
          }}
        />
        <button className="cta" onClick={addItem}>
          Add
        </button>
      </div>
      <div className="display-info">
        <p>
          {items.length === 0
            ? "Nothing to display..."
            : `Displaying ${startIndex + 1} - ${Math.min(
                endIndex,
                filteredItems.length
              )} of ${filteredItems.length}`}
        </p>
        <p>Total items: {items.length}</p>
      </div>
    </div>
  );
}

export default DynamicList;
