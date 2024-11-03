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
      <div>
        {isConnecting ? (
          <h1>Connecting...</h1>
        ) : (
          <>
            {joinedRoom ? (
              <>
                {opponentCount === 0 && (
                  <>
                    <h1>There is only you in this game room.</h1>
                    <h1>Waiting for another player to join the room...</h1>
                    <p>
                      (You can send the page's link to your friend so he/she can
                      play with you)
                    </p>
                  </>
                )}

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
