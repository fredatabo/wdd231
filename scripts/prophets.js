// prophets.js

// 1. URL of the JSON resource
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// 2. Select the div#cards element
const cards = document.querySelector('#cards');

// 3. Async function to fetch prophet data
async function getProphetData() {
  try {
    const response = await fetch(url);
    // convert response to JSON
    const data = await response.json();

    // console.table to check data (optional, commented after verification)
    // console.table(data);   // uncomment to inspect

    // Pass the prophets array to display function
    displayProphets(data.prophets);
  } catch (error) {
    console.error('Error fetching prophet data:', error);
  }
}

// 4. Arrow function to display prophets – builds cards
const displayProphets = (prophets) => {
  // clear any existing content (just in case)
  cards.innerHTML = '';

  prophets.forEach((prophet) => {
    // create section card
    const card = document.createElement('section');

    // create h2 element (full name)
    const fullName = document.createElement('h2');
    // template string: combine first and last name
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;

    // create img element
    const portrait = document.createElement('img');
    // set attributes using setAttribute
    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width', '200');
    portrait.setAttribute('height', '260');

    // append heading and image to card
    card.appendChild(fullName);
    card.appendChild(portrait);

    // append card to the #cards container
    cards.appendChild(card);
  });
};

// 5. Call the function to fetch and display data
getProphetData();