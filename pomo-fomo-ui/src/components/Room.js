import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import yogaGif from "../yoga.gif";
import danceGif from "../tiktokDance.gif";
import { joinRoomAndSubscribe } from '../socketHandler';
import { calculateTimeLeft } from "./utils/TimeLeft";

const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(0);
  const [usersJoined, setUsersJoined] = useState([]);
  const [isStudying, setIsStudying] = useState(false);
  const [breakTimeGifs, setBreakTimeGifs] = useState({ yoga: yogaGif, dance: danceGif });

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
    if (status === 'waiting') {
      setIsStudying(false);
    } else if (status === 'pomodoro') {
      setIsStudying(true);
    } else {
      setIsStudying(false);
    }
  }, [status]);

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
      <Participant key={participant.sid} participant={participant} isStudying={isStudying}/>
    </div>
  ));

  let statusElement;
  if (status === 'waiting') {
    statusElement = <h3>Waiting for friends...</h3>
  } else if (status === 'pomodoro') {
    statusElement = <h3>Study time! Shh!</h3>
  } else {
    statusElement =
    (
      <div>
        <h3>Break time! Let's do...{status}!</h3>
        <img className="mb-2" src={breakTimeGifs[status]}/>
      </div>
    );
  }

  const timeElement = <h3>{Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' + timeLeft % 60 : timeLeft % 60}</h3>;

  return (
    <div className="container-fluid room text-center">
      <div className="row no-gutters">
        <div className="col-md-5">
          <h2>Room: {roomName}</h2>
          <button className="mb-2" onClick={handleLogout}>Leave room</button>
          {timeElement}
          {statusElement}
        </div>
        <div className="col-md-7">
          <div className="row participants-container">
            {allParticipants}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;