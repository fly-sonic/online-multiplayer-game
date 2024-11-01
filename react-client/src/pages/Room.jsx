import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";

const Room = () => {
  const { roomId } = useParams();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <>
      <div>Room {roomId}</div>
      <div>{isConnected ? "connected" : "not connected"}</div>
    </>
  );
};

export default Room;
