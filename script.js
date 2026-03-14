"use strict"

// TODO: this should be configurable by the exercise page.
const homonymsArray = [
  ["A", "À", "AS"],
  ["AIRE", "ERRE", "ÈRE", "AIR"],
  ["ANCRE", "ENCRE"],
  ["AU", "EAU", "HAUT"],
  ["BOIS", "BOIT"],
  ["BON", "BOND"],
  ["CERF", "SERT", "SERS", "SERRE", "SERF"],
  ["CET", "SEPT"],
  ["CHAMPS", "CHANT"],
  ["CHAÎNE", "CHÊNE"],
  ["COMPTE", "COMTE", "CONTE"],
  ["COQ", "COQUE"],
  ["COU", "COUP", "COÛT"],
  ["COUR", "COURS"],
  ["DANS", "DENT"],
  ["DO", "DOS"],
  ["ET", "EST", "ES"], // not really homonyms...
  ["FAIM", "FIN"],
  ["FAUT", "FAUX"],
  ["HAIT", "HAIS", "EST", "HAIE", "ES"],
  ["MA", "M'A", "M'AS"],
  ["MAIRE", "MÈRE", "MER"],
  ["MAÎTRE", "METTRE", "MÈTRE"],
  ["MI", "MIE"],
  ["MONT", "MON"],
  ["MUR", "MÛRE"],
  ["ON", "ONT"],
  ["OU", "OÙ"],
  ["PAIRE", "PÈRE"],
  ["PATTE", "PÂTE"],
  ["PIN", "PAIN", "PEINT"],
  ["PRÊT", "PRÈS"],
  ["RÉ", "RAIE"],
  ["SAIT", "SAIS", "CES", "C'EST", "S'EST", "SES"],
  ["SAUT", "SOT", "SEAU"],
  ["SE", "CE"],
  ["SEL", "SELLE"],
  ["SENS", "SENT", "SANG", "SANS"],
  ["SOLE", "SOL"],
  ["SON", "SONT"],
  ["TAIRE", "TERRE"],
  ["TANT", "TEMPS"],
  ["TOI", "TOIT"],
  ["VER", "VERRE", "VERS", "VERT"],
  ["ÇA", "SA"],
];

let gSentences = [];
let gShuffledSentences = null;
let currentSentence;
let gCorrectedAnswers;

function addSentences(sentences) {
  gSentences.push.apply(gSentences, sentences);
}

function addMultiplicationTable(n) {
  for (let i = 2; i <= 9; i++) {
    gSentences.push(`${n} × ${i} = (${n * i}).`);
  }
}

function addAllMultiplicationTables() {
  for (let i = 2; i <= 9; i++) {
    for (let j = 2; j <= i; j++) {
      if (Math.random() < .5)
        gSentences.push(`${i} × ${j} = (${i * j}).`);
      else
        gSentences.push(`${j} × ${i} = (${i * j}).`);
    }
  }
}

function appendCorrection(aContainer, aSentence) {
  let div = document.createElement("div");
  div.className = "correction";
  div.textContent = aSentence;
  aContainer.appendChild(div);
}

function appendContinueButton(aContainer, aTextContent) {
  let div = document.createElement("div");
  let button = document.createElement("button");
  button.textContent = aTextContent;
  button.onclick = nextSentence;
  div.appendChild(button);
  aContainer.appendChild(div);
}

function nextSentence() {
  let container = document.getElementById("container");

  // Show next sentence.
  if (gShuffledSentences && gShuffledSentences.length == 0) {
    let note = (20*(gSentences.length - gCorrectedAnswers.length)/gSentences.length).toFixed(1).replace(".0", "");
    document.getElementById("stats").innerHTML = `${note}/20`;
    container.innerHTML = "L'exercice est terminé !<br>";
    if (gCorrectedAnswers.length == 0) {
      container.innerHTML += "Félicitations, c'est un sans-faute !";
    } else {
      container.innerHTML += " Voici ce que tu dois réviser :";
      gCorrectedAnswers.forEach(sentence => appendCorrection(container, sentence));
    }
    appendContinueButton(container, "Recommencer");
    gShuffledSentences = null;
    return;
  }

  if (!gShuffledSentences || gShuffledSentences.length == 0) {
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#JavaScript_implementation
    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
    gShuffledSentences = structuredClone(gSentences);
    shuffleArray(gShuffledSentences);
    currentSentence = 0;
    gCorrectedAnswers = [];
  }

  // Show current stats.
  currentSentence++;
  let stats = `Question ${currentSentence}/${gSentences.length}`;
  stats +=` ; ${gCorrectedAnswers.length} erreur${gCorrectedAnswers.length >= 2 ? "s" : ""}`;
  document.getElementById("stats").innerHTML = stats;

  let question = gShuffledSentences.pop();

  function verifyAnswer(aCorrect) {
    if (aCorrect) {
      nextSentence();
    } else {
      container.innerHTML = "";
      let correctedAnswer = question.replace(/[()]/g, "").toUpperCase();
      gCorrectedAnswers.push(correctedAnswer);
      appendCorrection(container, correctedAnswer);
      appendContinueButton(container, "Continuer");
    }
  }

  convertStringToHTMLWithSelectMenu(document.getElementById("container"),
                                    question,
                                    mistakeCount =>
                                    verifyAnswer(mistakeCount == 0));
}
onload = function() {
  gSentences.forEach(sentence =>
    convertStringToHTMLWithSelectMenu(document.createElement("div"), sentence, _ => _)
  );
  nextSentence();
}

// This function takes a string with placeholders delimited by parentheses, and
// sets the content of a HTML container to the input string with placeholders
// replaced with <select> options (with the default option being "?"). When all
// <select> options are set to some non-default value, the callback is called
// with the number of mistakes as argument.
//
// @param aContainer: HTML div whose content is set to the input string with
// placeholders replaced by <select> elements.
// @param aString: Input string with placeholders delimited by parentheses.
// Currently, placeholders are inferred from the input string can either be:
// - Homonyms (ça, sa).
// - An integer between 1 and 99.
// @param aCallback: Callback that will the number of mistakes when all
// options are set to a non-default value during validation. Validation is
// performed each time a <select> option is changed.
function convertStringToHTMLWithSelectMenu(aContainer, aString, aCallback) {
  const notSelected = "?";
  aString = aString.toUpperCase();

  function appendSubstring(startIndex, endIndex) {
    if (startIndex < endIndex) {
      aContainer.appendChild(document.createTextNode(aString.substring(startIndex, endIndex)))
    }
  }

  function validateSelection() {
    let selectElements = Array.from(aContainer.getElementsByTagName("select"));
    if (selectElements.find(select => select.value === notSelected))
      return;

    let mistakeCount = 0;
    selectElements.forEach(select => {
      if (select.selectedOptions[0].dataset.correct !== "true")
        mistakeCount++;
    });
    aCallback(mistakeCount);
  }

  function appendSelect(matchedString) {
    let select = document.createElement("select");
    select.onchange = validateSelection;
    let option = document.createElement("option");
    option.textContent = notSelected;
    select.appendChild(option);

    let number = parseInt(matchedString, 10);
    if (!isNaN(number)) {
      if (number < 1 || number >= 100) {
        throw new Error(`"${number}" is not between 1 and 99!`);
      }
      for (let i = 1; i < 100; i++) {
        option = document.createElement("option");
        option.textContent = i.toString();
        option.dataset.correct = i === number;
        select.appendChild(option);
      }
      aContainer.appendChild(select);
      return;
    }

    let homonyms = homonymsArray.find(array => array.includes(matchedString));
    if (homonyms !== undefined) {
      for (const homonym of homonyms) {
        option = document.createElement("option");
        option.textContent = homonym;
        option.dataset.correct = homonym === matchedString;
        select.appendChild(option);
      }
      aContainer.appendChild(select);
      return;
    }
    throw new Error(`Cannot create <select> element for "${matchedString}"!`);
  }

  aContainer.innerHTML = "";

  const regexp  = /\([^\)]+\)/g;
  const matches = aString.matchAll(regexp);
  let lastIndex = 0;
  for (const match of matches) {
    appendSubstring(lastIndex, match.index);
    appendSelect(match[0].substr(1, match[0].length - 2));
    lastIndex = match.index + match[0].length;
  }
  appendSubstring(lastIndex, aString.length);
}
