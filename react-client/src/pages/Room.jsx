import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import GameRoom from "../components/GameRoom";

const Room = () => {
  const { roomId } = useParams();
  const [isConnecting, setIsConnecting] = useState(true);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [opponentCount, setOpponentCount] = useState(null);

  useEffect(() => {
    function onConnect() {
      socket.emit("try-join-room", roomId, (joinRoomSucceeded, playerCount) => {
        if (joinRoomSucceeded) {
          setJoinedRoom(true);
          setOpponentCount(playerCount - 1);
        } else {
          setJoinedRoom(false);
          //socket.disconnect();
        }

        setIsConnecting(false);
      });
    }

    function onPlayerCountUpdate(playerCount) {
      setOpponentCount(playerCount - 1);
    }

    socket.on("connect", onConnect);
    socket.on("playerCount-update", onPlayerCountUpdate);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("playerCount-update", onPlayerCountUpdate);
    };
  }, []);

  return (
    <>
      <h1>socket id = {socket.id}</h1>
      <div>
        {isConnecting ? (
          <h1>"Connecting..."</h1>
        ) : (
          <>
            {joinedRoom ? (
              <>
                <h1>
                  You are in room {roomId}. Count of other players in the room ={" "}
                  {opponentCount}
                </h1>

                {opponentCount === 1 && (
                  <GameRoom socket={socket} roomId={roomId} />
                )}
              </>
            ) : (
              <h1>
                You cannot join the room right now. Please refresh the page
                later.
              </h1>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Room;
