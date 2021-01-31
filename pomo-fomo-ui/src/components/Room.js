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

  const allParticipants = [room.localParticipant, ...participants].map((participant) => (
    <div className="col-xl-6">
      <Participant key={participant.sid} participant={participant} />
    </div>
  ));

  let statusElement;
  if (status === 'waiting') {
    statusElement = <h3>Waiting for friends...</h3>
  } else if (status === 'pomodoro') {
    statusElement = <h3>Study time! Shh!</h3>
  } else {
    statusElement = <h3>Break time! Let's do...{status}!</h3>
  }

  const timeElement = <h3>{Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' + timeLeft % 60 : timeLeft % 60}</h3>;

  return (
    <div className="container-fluid room text-center">
      <div className="row no-gutters">
        <div className="col-md-3">
        </div>
        <div className="col-md-6">
          <h2>Room: {roomName}</h2>

          {statusElement}
          {timeElement}

          <button onClick={handleLogout}>Log out</button>
          <div className="row participants-container">
            {allParticipants}
          </div>
        </div>
        <div className="col-md-3">
        </div>
      </div>
    </div>
  );
};

export default Room;