"use client";

import React, { useState, useEffect } from "react";

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const apiUrl = 'http://localhost:3001/api/items';

  useEffect(() => {
    // Fetch data from the server when the component mounts
    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setNewItem(e.target.value);
  };

  const handleSend = async () => {
    try {
      // Send data to the server
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newItem }), // Adjust the data structure based on your needs
      });

      const data = await response.json();

      // Update state with the new item
      setItems((prevItems) => [...prevItems, data]);

      // Clear the input field
      setNewItem("");

      // Fetch data again to update the content
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (e) => {
    // Check if the Enter key is pressed
    if (e.key === "Enter") {
      // Prevent the default behavior of the Enter key (e.g., form submission)
      e.preventDefault();
      // Call the handleSend function
      handleSend();
    }
  };

  return (
    <div className="flex flex-col w-full justify-end h-screen bg-neutral-800">
      <div className="flex flex-col text-end w-full">
        {items.map((item, index) => (
          <div key={index} className=" font-mono text-white text-left font-bold">
            {item.name}
            {/* Display other properties as needed */}
          </div>
        ))}
      </div>
      <div className="flex flex-row">
        <span className="flex text-green-500 bg-transparent font-bold ">Send_a_message_to_the_global_chat</span>
        <span className="flex text-white bg-transparent font-bold">:</span>
        <span className="flex text-blue-500 bg-transparent font-bold">~$ </span>
        <input
          value={newItem}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className=" flex text-white bg-transparent h-30 bottom-0 font-bold"
        />
        
      </div>
    </div>
  );
};

export default App;
