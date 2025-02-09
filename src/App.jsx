import React, { useState } from "react";


function roundToNearestFiveMinutes(date) {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 5) * 5;
  
  const roundedDate = new Date(date);
  roundedDate.setMinutes(roundedMinutes);
  roundedDate.setSeconds(0);  // Optioneel: seconden resetten naar 0
  roundedDate.setMilliseconds(0);  // Optioneel: milliseconden resetten naar 0

  return roundedDate;
}

const ClockContainer = () => {
  let date = new Date();
  date = roundToNearestFiveMinutes(date);
  const [time, setTime] = useState(date);

  const incrementTime = () => setTime(new Date(time.getTime() + 5 * 60000));
  const decrementTime = () => setTime(new Date(time.getTime() - 5 * 60000));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-red-500">De digitale klok</h1>
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <DigitalClock time={time} />
        <AnalogClock time={time} />
        <TextualClock time={time} />
      </div>
      <div className="flex gap-4">
        <button onClick={decrementTime} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          -5 min
        </button>
        <button onClick={incrementTime} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">
          +5 min
        </button>
      </div>
    </div>
  );
};

const DigitalClock = ({ time }) => (
  <div>
    <h2 className="text-xl font-semibold">Digital Clock</h2>
    <p className="text-3xl mt-2">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
  </div>
);

const AnalogClock = ({ time }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30; // 360° / 12 hours = 30° per hour
  const minuteAngle = (minutes + seconds / 60) * 6; // 360° / 60 minutes = 6° per minute
  // const secondAngle = seconds * 6; // 360° / 60 seconds = 6° per second

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Analog Clock (SVG)</h2>
      <svg viewBox="0 0 100 100" className="w-48 h-48">
        {/* Clock face */}
        <circle cx="50" cy="50" r="48" fill="white" stroke="black" strokeWidth="2" />
        {/* Hour hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="30"
          stroke="black"
          strokeWidth="3"
          transform={`rotate(${hourAngle} 50 50)`}
        />
        {/* Minute hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="20"
          stroke="black"
          strokeWidth="2"
          transform={`rotate(${minuteAngle} 50 50)`}
        />
        {/* Second hand */}

        {/* Center circle */}
        <circle cx="50" cy="50" r="2" fill="black" />
      </svg>
    </div>
  );
};

function tijdNaarTekst(uur, minuut) {

  if (uur > 13 ) {
    uur = uur - 12
  }
  
  const urenTekst = [
    "12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "1"
  ];

  if (minuut === 0) {
    return `${urenTekst[uur]} uur`;
  } else if (minuut === 15) {
    return `kwart over ${urenTekst[uur]}`;
  } else if (minuut < 30) {
    return `${minuut} over ${urenTekst[uur]}`;
  } else if (minuut === 30) {
    return `half ${urenTekst[uur + 1]}`;
  } else if (minuut === 45) {
    return `kwart voor ${urenTekst[uur + 1]}`;
  } else {
    return `${60 - minuut} voor ${urenTekst[uur + 1]}`;
  }
}

const TextualClock = ({ time }) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return (
    <div>
      <h2 className="text-xl font-semibold">Textual Clock</h2>
      <p className="text-lg mt-2">
        {tijdNaarTekst(hours, minutes)}
        {/* {formattedHours}:{formattedMinutes} {period} */}
      </p>
    </div>
  );
};

export default ClockContainer;