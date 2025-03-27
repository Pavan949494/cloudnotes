// src/GameCanvas.js
import React, { useState } from 'react';
import Sketch from 'react-p5';

let bookImg;
let words = [];
let wordIndex = 0;
let targetPhrase = "Secure Notes";
let caught = [];

export default function GameCanvas() {
  const [bookX, setBookX] = useState(200);

  const preload = (p5) => {
    bookImg = p5.loadImage("https://cdn-icons-png.flaticon.com/512/29/29302.png"); // Simple book icon
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    let phraseLetters = targetPhrase.split("");
    words = phraseLetters.map((letter, i) => ({
      x: Math.random() * p5.width,
      y: -i * 80,
      letter,
      speed: 2 + Math.random() * 2,
    }));
  };

  const draw = (p5) => {
    p5.clear();
    p5.background(255, 255, 255, 0);

    // Draw falling words
    p5.textSize(32);
    p5.fill(0);
    words.forEach((word, i) => {
      p5.text(word.letter, word.x, word.y);
      word.y += word.speed;

      // Collision detection
      if (
        word.y > p5.height - 100 &&
        word.y < p5.height - 60 &&
        word.letter === targetPhrase[wordIndex] &&
        Math.abs(word.x - bookX) < 50
      ) {
        caught.push(word.letter);
        word.y = p5.height + 100; // remove word
        wordIndex++;
      }
    });

    // Draw book
    p5.image(bookImg, bookX, p5.height - 60, 80, 60);

    // Display target phrase
    p5.textSize(20);
    p5.fill(100);
    p5.text("Catch: " + targetPhrase, 20, 30);
    p5.text("Caught: " + caught.join(""), 20, 60);
  };

  const keyPressed = (p5) => {
    if (p5.keyCode === p5.LEFT_ARROW) {
      setBookX((x) => Math.max(0, x - 40));
    } else if (p5.keyCode === p5.RIGHT_ARROW) {
      setBookX((x) => Math.min(p5.width - 80, x + 40));
    }
  };

  return <Sketch preload={preload} setup={setup} draw={draw} keyPressed={keyPressed} />;
}
