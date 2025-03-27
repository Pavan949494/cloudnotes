import React, { useState } from 'react';
import './Calculator.css';

const Calculator = ({ onClose }) => {
  const [input, setInput] = useState('');

  const handleClick = (val) => setInput((prev) => prev + val);
  const calculate = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput('Error');
    }
  };

  return (
    <div className="calculator-popup">
      <div className="calculator-header">
        <span>Calculator</span>
        <button onClick={onClose}>✖</button>
      </div>
      <input value={input} readOnly />
      <div className="buttons">
        {'1234567890+-*/.'.split('').map((char) => (
          <button key={char} onClick={() => handleClick(char)}>{char}</button>
        ))}
        <button onClick={() => setInput('')}>C</button>
        <button onClick={calculate}>=</button>
      </div>
    </div>
  );
};

export default Calculator;
