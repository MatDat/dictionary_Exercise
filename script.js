"use strict";

let globalArrayOfWords;

window.addEventListener("load", setup);

async function setup() {
  console.log("Javascript running!");

  const response = await fetch("../data/ddo_fullforms_2023-10-11.csv");
  const rawText = await response.text();

  globalArrayOfWords = rawText.split("\n").map((line) => {
    const parts = line.split("\t");
    return {
      variant: parts[0],
      headword: parts[1],
      homograph: parts[2],
      partofSpeech: parts[3],
      id: parts[4],
    };
  });
  globalArrayOfWords.sort((a, b) => a.variant.localeCompare(b.variant));

  //console.log(globalArrayOfWords);

  //Performance forsøg herfra
  performance.mark("operation-start");
  const startTimer = Date.now();

  binarySearchCompare("skole", globalArrayOfWords, compare);

  const endTimer = Date.now();
  const time = endTimer - startTimer;
  console.log(`Took ${time} milliseconds`);

  performance.mark("operation-end");
  performance.measure("operation-duration", "operation-start", "operation-end");
  const measurements = performance.getEntriesByName("operation-duration");
  console.log(measurements);
  //Performance forsøg hertil

  let wordToFind = "skole";
  const index = globalArrayOfWords.findIndex(
    (wordObject) => wordObject.variant === wordToFind
  );

  console.log(`Direct search: ${wordToFind} found at index: ${index}`);
}

function compare(value, target) {
  if (value === target.variant) {
    return 0;
  } else if (value > target.variant) {
    return 1;
  } else {
    return -1;
  }
}

function binarySearchCompare(value, globalArrayOfWords, compare) {
  let start = 0;
  let end = globalArrayOfWords.length - 1;
  let iterations = 0;

  while (start <= end) {
    iterations++;
    let middle = Math.floor((end + start) / 2);
    let cmp = compare(value, globalArrayOfWords[middle]);

    if (cmp === 0) {
      //console.log(`Binary Search found: ${value}, at index: ${middle}`);
      //console.log(`Iterations: ${iterations}`);
      return middle;
    } else if (cmp === 1) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }
  //console.log(`${value} was not found.`);
  //console.log(`Iterations: ${iterations}`);
  return -1;
}
