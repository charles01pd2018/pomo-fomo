// Calculates and returns the time left for the study group
export const calculateTimeLeft = ({ minutes, seconds }) => {

  if (minutes === 0 && seconds === 0) {
      minutes = 0;
      seconds = 0;
  }
  else if (seconds === 0) {
      minutes -= 1;
      seconds = 59;
  } 
  else {
      seconds -= 1;
  }

  return {
      "minutes": minutes,
      "seconds": seconds
  }
}