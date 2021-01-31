import React, { useEffect, useState } from "react";
import Participant from "./Participant";

// utils
import { calculateTimeLeft } from "./utils/TimeLeft";

const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);

  const [timeLeft, setTimeLeft] = useState({"minutes": 0, "seconds": 2});
  const [timerComponents, setTimerComponents] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(timeLeft));
    }, 1000);

    try {
      Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
          return;
        }
        timerComponents[0] = (
          <span>
            {timeLeft["minutes"]} : {timeLeft["seconds"]}
          </span>
        );
      });
    }
  catch {
    setTimeLeft(null);
  }
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

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

      { timeLeft === null ? ( <div className='text-center mb-2'>Study Time Over! Take a break!</div> ) : (
      <div className='text-center mb-2'>
        {timerComponents.length ? timerComponents[timerComponents.length-1] : <span>...Starting Study Session...</span>}
      </div> ) } 

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
