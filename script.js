"use strict"

const homonymsArray = [
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
  ["FAIM", "FIN"],
  ["FAUT", "FAUX"],
  ["HAIT", "HAIS", "EST", "HAIE", "ES"],
  ["MAIRE", "MÈRE", "MER"],
  ["MAÎTRE", "METTRE", "MÈTRE"],
  ["MI", "MIE"],
  ["MONT", "MON"],
  ["MUR", "MÛRE"],
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

const sentences = [
////////////////////////////////////////////////////////////////////////////////
  "(Ce) (coq) chante (faux), il a besoin de (cours) de (chant).",
  "Il (faut) (mettre) du (sel) quand tu cuisines de la (sole) ou de la (raie).",
  "J'ai (faim), allons faire un (saut) au magasin pour acheter du (pain) de (mie).",
  "J'ai (tant) mangé de (pâte)s que je ne trouve plus cela (bon).",
  "Je regarde le film « les (dent)s de la (mer) » par (temps) de pluie.",
  "L'(aire) d'autoroute est bordée de (pin)s et de (chêne)s.",
  "La girafe a des (patte)s et un (cou) très longs, on (compte) six (mètre)s du (sol) (au) (haut) de sa tête.",
  "La (paire) d'enceintes de la (chaîne) hifi fait entendre les notes « (do), (ré), (mi), fa, (sol) »",
  "(Cet) homme est (sot) : il verse l'(encre) du stylo dans un (seau).",
  "La (selle) du vélo de ma (mère) est cassée.",
  "Le bateau possède une (coque) et une (ancre).",
  "Le (comte) me (sert) dans (ses) bras en me donnant des tapes amicales dans le (dos).",
  "Le (coût) d'une baguette de (pain) se situe (vers) les 50 centimes.",
  "Le lapin fait un (bond) en voyant un (ver) de (terre).",
  "Le (maire) de St Denis (erre) dans sa ville.",
  "Le (maître) d'école (boit) l'(eau) du (verre).",
  "Les (cerf)s sauvages donnent des (coup)s avec leurs (bois).",
  "Les enfants doivent se (taire) jusqu'à la (fin) du (conte) de fée.",
  "Mon (père) a (peint) le (mur) de la (cour) en (vert).",
  "Va cueillir les (mûre)s dans la (serre) du jardin.",
  "A l'(ère) médiévale, les (serf)s travaillent (dans) les (champs).",
////////////////////////////////////////////////////////////////////////////////
  "(Ce) garçon (se) lève.",
  "(Ce) n'est pas (ce) chat.",
  "Elle (se) prépare pour (ce) soir.",
  "Il (se) (sent) seul (ce) matin.",
  "(Ça) n'est pas dans (sa) valise.",
  "(Sa) fille n'est pas rentrée et (ça) l'inquiète.",
  "(Ça) (c'est) vraiment (toi). (Ça) (se) (sent) que (c'est) (toi).",
  "Le (toit) de (sa) maison (s'est) envolé après la tornade.",
  "(Mon) (père) a gravi le (mont) Blanc.",
  "Ils (sont) chez (son) oncle.",
  "(Cet) enfant (est) seul chez (son) (père).",
  "Ils (sont) (sept) enfants.",
  "Je (sais) que (c'est) (son) frère.",
  "Il (s'est) blessé chez (ses) amis.",
  "(Ces) deux garçons (sont) (ses) fils.",
  "Je ne te (hais) point.",
  "Tu (es) (prêt) pour couper la (haie).",
  "Le (maire) du village (est) loin d'être (prêt).",
  "(Sa) (mère) habite (près) de la (mer).",
  "Mon frère (EST) masseur",
  "Mon frère (HAIT) ma sœur",
  "Après 3 mois en (mer), voilà enfin la (terre) ferme !",
];

// Add questions for multiplications.
for (let i = 2; i <= 9; i++) {
  for (let j = 2; j <= i; j++) {
    if (Math.random() < .5)
      sentences.push(`${i} × ${j} = (${i * j}).`);
    else
      sentences.push(`${j} × ${i} = (${i * j}).`);
  }
}

// Silently run all questions once, to catch any errors.
sentences.forEach(sentence =>
  convertStringToHTMLWithSelectMenu(document.createElement("div"), sentence, _ => _)
);

let questionsCount = 0;
let correctAnswersCount = 0;
let shuffledSentences = [];

function nextSentence() {
  // Show current score.
  document.getElementById("score").innerHTML = `Score : ${Math.ceil(100*correctAnswersCount/(questionsCount||1))}%`;

  // Show next sentence.
  if (shuffledSentences.length == 0) {
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#JavaScript_implementation
    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
    shuffledSentences = structuredClone(sentences);
    shuffleArray(shuffledSentences);
  }
  let question = shuffledSentences.pop();
  let container = document.getElementById("container");

  function verifyAnswer(aCorrect) {
    questionsCount++;
    if (aCorrect) {
      correctAnswersCount++;
      nextSentence();
    } else {
      container.innerHTML = "";
      let div = document.createElement("div");
      div.className = "correction";
      div.textContent = question.replace(/[()]/g, "").toUpperCase();
      container.appendChild(div);
      let button = document.createElement("button");
      button.textContent = "Continuer";
      button.onclick = nextSentence;
      container.appendChild(button);
    }
  }

  convertStringToHTMLWithSelectMenu(document.getElementById("container"),
                                    question,
                                    mistakeCount =>
                                    verifyAnswer(mistakeCount == 0));
}
onload = nextSentence;

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
