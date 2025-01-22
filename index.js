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
  // userProfile[keys[i]] = answer; // Sla het antwoord op in userProfile met de juiste sleutel DIT HAD IK EERST
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
      userProfile[questionKeys[i]] = answer.trim(); // Sla het antwoord op
      isValid = true; // Markeer de invoer als geldig
    }

    // Validatie voor leeftijd (moet 18 of ouder zijn)
    else if (i === 2 || i === 6 || i === 7) {
      const age = Number(answer);
      if (isNaN(age) || age < 18) {
        console.log("You must be at least 18 years old to proceed.");
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
      const age = Number(answer);
      if (isNaN(age) || age < 18) {
        console.log("Please enter a valid age of 18 or older.");
        continue;
      }
      // Als het de maximale leeftijd is, controleer of deze groter is dan de minimale leeftijd
      if (i === 7 && userProfile.minMatchAge >= age) {
        console.log(
          "Maximum match age must be greater than the minimum match age."
        );
        continue;
      }
      userProfile[questionKeys[i]] = age;
      isValid = true;
    }
    // Voeg het antwoord toe aan de answers array wanneer het geldig is

    if (isValid) {
      answers.push(answer.trim());
    }
  }
}

console.log(userProfile); // Toon het volledige object in de console
//console.log(answers); // Toon de array van antwoorden in de console

// Nu gaan we de matchingsfunctionaliteit toevoegen

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
      userProfile.age >= candidate.minMatchAge &&
      userProfile.age <= candidate.maxMatchAge
    ) &&
    !(
      candidate.age >= userProfile.minMatchAge &&
      candidate.age <= userProfile.maxMatchAge
    )
  ) {
    isMatch = false;
  }
  //anders omschreven:
  //if (
  //  (userProfile.age < candidate.minMatchAge || userProfile.age > candidate.maxMatchAge) &&
  //(candidate.age < userProfile.minMatchAge || candidate.age > userProfile.maxMatchAge)
  //) {
  //isMatch = false;
  //}

  // Controleer of geslachten overeenkomen
  if (
    userProfile.gender !== candidate.interestedIn &&
    candidate.gender !== userProfile.interestedIn
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
//zonder apart te loggen: console.log(`Your dating matches are: ${matchCount}`);
// of: console.log("Your dating matches are: " + matchCount);
