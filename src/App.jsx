import React, { useRef, useState } from "react";
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

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

  const [showConfetti, setShowConfetti] = useState(false);
  const [animatePulsation, setAnimatePulsation] = useState(false);
  const [difficulty, setDifficulty] = useState(3);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-red-500">De digitale klok van Arthur</h1>
      <p>Vul het juiste uur in het vak bij 'geschreven uur'.</p>
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <DigitalClock time={time} difficulty={difficulty} />
        <AnalogClock time={time} difficulty={difficulty} animatePulsation={animatePulsation} />
        <TextualClock time={time} showConfetti={showConfetti} setShowConfetti={setShowConfetti} setAnimatePulsation={setAnimatePulsation} setTime={setTime} />
      </div>

      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <ResetButton setTime={setTime} ></ResetButton>
        <DifficultyRange difficulty={difficulty} setDifficulty={setDifficulty}></DifficultyRange>
        </div>
    </div>
  );
};

const DifficultyRange = ({ difficulty, setDifficulty}) => {

  function changeDifficulty(e) {
    setDifficulty(e.target.value);
  };


  return (
    <div>
      <p>Makkelijkheid: </p>
      <input id="minmax-range" type="range" min="1" max="3" value={difficulty} onChange={changeDifficulty} ></input>
    </div>
  );
};

const DigitalClock = ({ time, difficulty }) => {
  const timeDisplay = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div>
      <h2 className="text-xl font-semibold">Digitale klok</h2>
      <p className="text-3xl mt-2">
      {difficulty < 3 ? (
        <div>{timeDisplay.replace(/[0-9]/g, 'X')}</div>
      ) : (
        <div>{timeDisplay}</div>
      )}
      
      </p>
    </div>
  );
};

function getRandomTime() {
  const start = new Date('2020-01-01');
  const end = new Date('2020-01-02');
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return roundToNearestFiveMinutes(new Date(randomTime));
}


const ResetButton = ({ setTime }) => {

  function resetTime() {
    const date = getRandomTime();
    console.log("Resetted to ", date);
    setTime(date);
  }

  return (
  <div>
    <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={resetTime}>Andere opdracht</button>
  </div>
  )
};


const AnalogClock = ({ time, difficulty, animatePulsation }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30; // 360° / 12 hours = 30° per hour
  const minuteAngle = (minutes + seconds / 60) * 6; // 360° / 60 minutes = 6° per minute
  // const secondAngle = seconds * 6; // 360° / 60 seconds = 6° per second

  const animationProps = animatePulsation
  ? {
      scale: [1, 1.2, 1],
      opacity: [0.9, 1, 0.9],
      transition: { duration: 0.8, repeat: Infinity, repeatType: 'reverse' },
    }
  : { scale: 1, opacity: 1 }; // Static state when not animating

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Analoge klok</h2>
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={animationProps}
        className="inline-block"
      >

        <svg viewBox="0 0 100 100" className="w-48 h-48">
          {/* Clock face */}
          <circle cx="50" cy="50" r="48" fill="white" stroke="black" strokeWidth="2" />
          {/* Hour hand */}
          <motion.line
            x1="50"
            y1="50"
            x2="50"
            y2="30"
            stroke="black"
            strokeWidth="3"
            transform={`rotate(${hourAngle} 50 50)`}
          />
          {/* Minute hand */}
          <motion.line
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

          {/* Numbers */}
          {difficulty > 1 && [...Array(12)].map((_, i) => {
              const angle = (i + 1) * 30; // 30 degrees for each hour position
              const x = 50 + 40 * Math.sin((angle * Math.PI) / 180);
              const y = 50 - 40 * Math.cos((angle * Math.PI) / 180);
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="5"
                  fill="black"
                >
                  {i + 1}
                </text>
              );
            })}


            {/* } */}
          
            
        </svg>
      </motion.div>
    </div>
  );
};

function tijdNaarTekst(uur, minuut) {

  if (uur >= 13 ) {
    uur = uur - 12
  }

  console.log(uur, minuut);

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

const TextualClock = ({ time, showConfetti, setShowConfetti, setAnimatePulsation, setTime }) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const inputRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const antwoord = event.currentTarget.elements.antwoord.value;
    const correct = tijdNaarTekst(hours, minutes);
    console.log('Antwoord gesubmit', antwoord, 'correct', correct);
    if(correct==antwoord) {
      // Show confetti for 3 seconds
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      
      // Resetting the value
      // event.currentTarget.elements.antwoord.value = ""; // direct reset
      // Add a delay before resetting the input value
      setTimeout(() => {
        inputRef.current.value = '';
      }, 3000); // 3-second delay

      const newTime = getRandomTime();

      setTimeout(() => setTime(newTime), 4000);
    } else {
      setAnimatePulsation(true);
      setTimeout(() => setAnimatePulsation(false), 1500);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Geschreven uur</h2>
        <form onSubmit={handleSubmit}>
          <input id="antwoord" ref={inputRef} type="text" className="bg-gray-50 border border-gray-300"></input>
        </form>

      {showConfetti && <Confetti />}
    </div>
  );
};

export default ClockContainer;