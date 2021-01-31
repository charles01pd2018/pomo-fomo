import React, { useEffect, useState } from "react";
import Participant from "./Participant";

import { joinRoomAndSubscribe } from '../socketHandler';
import { calculateTimeLeft } from "./utils/TimeLeft";

const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(0);
  const [usersJoined, setUsersJoined] = useState([]);

  // On-mount code 
  useEffect(() => {
    // Join a socket room
    joinRoomAndSubscribe(room.localParticipant.identity, roomName, (err, newStatus, newTimeLeft) => {
      setStatus(newStatus);
      setTimeLeft(newTimeLeft);
    }, (err, newMessage) => {
      setUsersJoined([...usersJoined, newMessage]);
    });
  }, []);

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>

      status: {status}
      time left: {timeLeft}
      users joined messages: {usersJoined.map(user => <p>{user}</p>)}

      <button onClick={handleLogout}>Log out</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ""
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;