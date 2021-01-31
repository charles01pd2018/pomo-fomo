import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import Lobby from "./Lobby";
import Room from "./Room";

const Home = () => {
  // Set the initial state
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [room, setRoom] = useState(null);

  // Create handlers for changing the input
  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback((event) => {
    setRoomName(event.target.value);
  }, []);

  // Create handler for requesting to join a room
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setConnecting(true);

      // Make a request for a token to join the specified room under the specified username
      const data = await fetch("http://localhost:3001/video/token", {
        method: "POST",
        body: JSON.stringify({
          identity: username,
          room: roomName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(res => res.json());

      // Then, use the Twilio JS library to connec to the room using our new token
      Video.connect(data.token, {
        name: roomName,
      })
        .then((room) => {
          setConnecting(false);
          setRoom(room);
        })
        .catch((err) => {
          console.error(err);
          setConnecting(false);
        });
    },
    [roomName, username]
  );

  // Create a handler for requesting to leave a room
  const handleLogout = useCallback(() => {
    setRoom(prevRoom => {
      // Stop all tracks for THIS client; audio, video
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      // Set the room to be null
      return null;
    });
  }, []);

  // Clean-up code for whenever we leave a room
  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, handleLogout]);

  // Render the Lobby OR the Room, depending if we are actually in a session
  return (
    room
      ?
    <Room
      roomName={roomName}
      room={room}
      handleLogout={handleLogout}
    />
      :
    <Lobby
      username={username}
      roomName={roomName}
      handleUsernameChange={handleUsernameChange}
      handleRoomNameChange={handleRoomNameChange}
      handleSubmit={handleSubmit}
      connecting={connecting}
    />
  );
};

export default Home;
