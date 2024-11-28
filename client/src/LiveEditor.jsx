import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("ws://localhost:4200"); // Connect to your server

const LiveEditor = ({ roomId }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    socket.connect();

    // Join the room
    socket.emit("joinRoom", roomId);

    // Listen for editor changes
    socket.on("updateEditor", (newContent) => {
      setContent(newContent); // Update content when someone else edits
    });

    return () => {
      socket.disconnect(); // Clean up when component unmounts
    };
  }, [roomId]);

  // Handle text changes in the editor
  const handleEditorChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Broadcast the change to the server
    socket.emit("editorChange", { roomId, content: newContent });
  };

  return (
    <textarea
      value={content}
      rows={30}
      cols={100}
      onChange={handleEditorChange}
      placeholder="Start collaborating in this live editor..."
    />
  );
};

export default LiveEditor;
