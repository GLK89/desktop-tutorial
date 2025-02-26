"use strict";

const mockData = require("./mockData1.js").data;
const prompt = require("prompt-sync")();

// Your code here

console.log(mockData); // Print de waarde van mockData naar de console

const questions = [
  // Weergeven van vragen in een array
  "What is your first name?",
  "What is your last name?",
  "What is your age?",
  "Where do you live (choose between rural or city)?",
  "What is your gender (M,F or X)?",
  "Which genders are you interested in dating (M,F or X)?",
  "What is the minimum age of your match?",
  "What is the maximum age of your match?",
];

const questionKeys = [
  "firstName",
  "lastName",
  "age",
  "location",
  "gender",
  "interestedIn",
  "minMatchAge",
  "maxMatchAge",
]; // Bijbehorende sleutels voor het userProfile-object

let userProfile = {}; // Een leeg object genaamd "userProfile" om informatie op te slaan
let answers = []; // Array om antwoorden in op te slaan

// Itereer door vragen en sla antwoorden op in het object
for (let i = 0; i < questions.length; i++) {
  let answer = "";
  let isValid = false;

  // Zorg ervoor dat de input geldig is
  while (!isValid) {
    answer = prompt(questions[i] + " "); // Vraag om antwoord

    // Zet de invoer voor geslacht en locatie om naar kleine letters
    if (i === 4 || i === 5) {
      answer = answer.toUpperCase(); // Zet geslacht om naar hoofdletters (M,F,X)
    }

    if (i === 3) {
      answer = answer.toLowerCase(); // Zet locatie om naar kleine letters (rural, city)
    }

    // Validatie voor lege velden (voornaam en achternaam)
    if (i === 0 || i === 1) {
      if (answer.trim() === "") {
        console.log(
          "This input cannot be empty. Please provide a valid answer."
        );
        continue;
      }

      // Controleer of de naam alleen letters bevat (geen cijfers of speciale tekens)
      let isValidName = true;
      for (let j = 0; j < answer.trim().length; j++) {
        // Kijk of het karakter een letter is door te controleren of het een niet-letter is
        if (!isNaN(answer.trim()[j]) || !/[A-Za-z]/.test(answer.trim()[j])) {
          isValidName = false;
          break;
        }
      }

      if (!isValidName) {
        console.log("Please enter a valid name with only letters.");
        continue;
      }

      userProfile[questionKeys[i]] = answer.trim(); // Sla het antwoord op
      isValid = true; // Markeer de invoer als geldig
    }

    // Validatie voor leeftijd (moet tussen de 18 en 100 jaar liggen)
    else if (i === 2 || i === 6 || i === 7) {
      let age = Number(answer); //(antwoord omgezet naar getal)

      // Controleer of de leeftijd een getal is en tussen 18 en 100 ligt
      while (isNaN(age) || age < 18 || age > 100) {
        console.log("Please enter a valid age between 18 and 100.");
        answer = prompt(questions[i] + " "); // Vraag opnieuw om de input
        age = Number(answer); // Zet opnieuw om naar een getal

        // Stop de loop als de gebruiker jonger is dan 18 jaar
        if (age < 18) {
          console.log("You must be at least 18 years old to proceed.");
          return; // Stop de loop (en de hele functie)
        }

        continue;
      }

      userProfile[questionKeys[i]] = age; // Sla het antwoord op als een nummer
      isValid = true;
    }

    // Validatie voor geslacht (moet M, F of X zijn)
    else if (i === 4 || i === 5) {
      if (answer !== "M" && answer !== "F" && answer !== "X") {
        console.log("Gender must be M, F, or X.");
        continue;
      }

      userProfile[questionKeys[i]] = answer; // Sla het antwoord op als een string
      isValid = true;
    }

    // Validatie voor locatie (moet "rural" of "city" zijn)
    else if (i === 3) {
      if (answer !== "rural" && answer !== "city") {
        console.log('Location must be either "rural" or "city".');
        continue;
      }

      userProfile[questionKeys[i]] = answer; // Sla het antwoord op als een string
      isValid = true;
    }

    // Validatie voor minimale en maximale leeftijd van de match
    else if (i === 6 || i === 7) {
      let age = Number(answer);

      if (isNaN(age) || age < 18) {
        console.log("Please enter a valid age of 18 or older.");
        continue;
      }

      userProfile[questionKeys[i]] = age;

      // Controleer of minMatchAge kleiner is dan maxMatchAge
      if (userProfile.minMatchAge >= userProfile.maxMatchAge) {
        console.log(
          "Minimum match age must be less than the maximum match age."
        );
        continue; // Vraag opnieuw om de input
      }

      isValid = true;
    }

    // Voeg het antwoord toe aan de answers array wanneer het geldig is
    if (isValid) {
      answers.push(answer.trim());
    }
  }
}

console.log(userProfile); // Toon het volledige object in de console
//console.log(answers); // Toon de array van antwoorden in de console (uiteindelijk niet voor gekozen)

// Match functie:
let matchCount = 0; // Variabele om het aantal matches bij te houden

// Toon het aantal matches en de resultaten
console.log(`Your dating matches are:`);

// Loop door de mockData om de matches te vinden
mockData.forEach((candidate) => {
  // Vergelijk de criteria voor een match
  let isMatch = true;

  // Controleer of de leeftijden overeenkomen
  if (
    !(
      userProfile.age >= candidate.min_age_interest &&
      userProfile.age <= candidate.max_age_interest
    ) &&
    !(
      candidate.age >= userProfile.minMatchAge &&
      candidate.age <= userProfile.maxMatchAge
    )
  ) {
    isMatch = false;
  }

  // Nieuwe manier of geslachten overeenkomen, rekening houdend met voorkeuren
  if (
    !(
      userProfile.interestedIn === candidate.gender ||
      candidate.interestedIn === userProfile.gender
    )
  ) {
    isMatch = false;
  }

  // Controleer of de locatie overeenkomt
  if (userProfile.location !== candidate.location) {
    isMatch = false;
  }

  // Als alles klopt, is het een match
  if (isMatch) {
    matchCount++;
    console.log(
      `${candidate.first_name} ${candidate.last_name}, Age: ${candidate.age}, Location: ${candidate.location}`
    );
  }
});
// Toon het aantal matches
console.log(`Number of matches: ${matchCount}`);
