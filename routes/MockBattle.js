const express = require('express');
const app = express();
const path = require('path');
const prompt=require("prompt-sync")({sigint:true});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('index', { animals: animals});
});

app.listen(3000, () => console.log('Server started on port 3000'));

const fs = require('fs');
const filePath = path.join(__dirname, '..', 'models', 'animals.json');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const animalData = JSON.parse(fileContent);
// Load the animal database from the JSON file

// Define the battle function
function battle() {
  // Randomly assign animals to user and CPU
  const userAnimal = animalData[Math.floor(Math.random() * animalData.length)];
  const userAnimal2 = animalData[Math.floor(Math.random() * animalData.length)];
  const cpuAnimal = animalData[Math.floor(Math.random() * animalData.length)];
  const cpuAnimal2 = animalData[Math.floor(Math.random() * animalData.length)];

  // Initialize health for both animals
  let userHealth = userAnimal.hp;
  let userHealth2 = userAnimal2.hp;
  let cpuHealth = cpuAnimal.hp;
  let cpuHealth2 = cpuAnimal2.hp;

  // Initialize turn counter and flag for game end
  let turnCount = 1;
  let gameOver = false;

  // Game loop
  while (!gameOver) {
    console.log(`Turn ${turnCount}:`);

    // User selects their attack and target animal
    const uap = prompt(`Choose an attack for ${userAnimal.name}: \n1. ${userAnimal.atk1.name} \n2. ${userAnimal.atk2.name} \n3. ${userAnimal.atk3.name} \n4. ${userAnimal.atk4.name}`);
    const utp = prompt(`Choose a target for your attack: \n1. ${cpuAnimal.name} \n2. ${cpuAnimal2.name}`);
    const uap2 = prompt(`Choose an attack for ${userAnimal2.name}: \n1. ${userAnimal2.atk1.name} \n2. ${userAnimal2.atk2.name} \n3. ${userAnimal2.atk3.name} \n4. ${userAnimal2.atk4.name}`);
    const utp2 = prompt(`Choose a target for your attack: \n1. ${cpuAnimal.name} \n2. ${cpuAnimal2.name}`);
  

    let userAttack;
    let userAttack2;
    let cpuAttack;
    let cpuAttack2;
    let userTarget;
    let userTarget2;
    let cpuTarget;
    let cpuTarget2;
    if(uap == '1'){
         userAttack = userAnimal.atk1;
    }else if(uap == '2'){
         userAttack = userAnimal.atk2;
    }else if(uap == '3'){
         userAttack = userAnimal.atk3;
    }else {
         userAttack = userAnimal.atk4;
    }
    if(utp == '1'){
         userTarget = cpuAnimal;
    }else{
         userTarget = cpuAnimal2;
    }
    if(uap2 == '1'){
         userAttack = userAnimal2.atk1;
    }else if(uap2 == '2'){
         userAttack = userAnimal2.atk2;
    }else if(uap2 == '3'){
         userAttack2 = userAnimal2.atk3;
    }else{
         userAttack2 = userAnimal2.atk4;
        
    }
    if(utp2 == '1'){
         userTarget2 = cpuAnimal;
    }else{
         userTarget2 = cpuAnimal2;
    }
    // CPU randomly selects their attack and target animal
    const cpua = Math.floor(Math.random() * 4) + 1;
    const cput = Math.floor(Math.random() * 2) + 1;
    const cpua2 = Math.floor(Math.random() * 4) + 1;
    const cput2 = Math.floor(Math.random() * 2) + 1;
    if(cpua == 1){
         cpuAttack = cpuAnimal.atk1;
    }else if(cpua == 2){
         cpuAttack = cpuAnimal.atk2;
    }else if(cpua == 3){
         cpuAttack = cpuAnimal.atk3;
    }else {
         cpuAttack = cpuAnimal.atk4;
    }
    if(cput == 1){
        cpuTarget = userAnimal;
    }else{
         cpuTarget = userAnimal2;
    }
    if(cpua2 == 1){
         cpuAttack2 = cpuAnimal2.atk1;
    }else if(cpua2 == 2){
         cpuAttack2 = cpuAnimal2.atk2;
    }else if(cpua2 == 3){
         cpuAttack2 = cpuAnimal2.atk3;
    }else {
         cpuAttack2 = cpuAnimal2.atk4;
    }
    if(cput2 == 1){
        cpuTarget2 = userAnimal;
    }else{
         cpuTarget2 = userAnimal2;
    }
    // Create an array of all the animals in the game
    const animals = [
      { name: userAnimal.name, attack: userAttack, speed: userAttack.spd, damage: userAttack.pwr, target: userTarget },
      { name: cpuAnimal.name, attack: cpuAttack, speed: cpuAttack.spd, damage: cpuAttack.pwr, target: cpuTarget },
      { name: userAnimal2.name, attack: userAttack2, speed: userAttack2.spd, damage: userAttack2.pwr, target: userTarget },
      { name: cpuAnimal.name, attack: cpuAttack2, speed: cpuAttack2.spd, damage: cpuAttack2.pwr, target: cpuTarget2 }
    ];

    // Sort the animals by speed in descending order
    animals.sort((a, b) => b.speed - a.speed);

    // Perform each attack in order of speed
    
    animals.forEach((animal) => {
      // Check if the target is still alive
      if (animal.target.hp <= 0) {
        console.log(`${animal.target.name} is already knocked out!`);
        return;
      }


      // Subtract the damage from the target's health
      animal.target.hp -= animal.attack.pwr;

      // Log the result of the attack
      console.log(`${animal.name} used ${animal.attack.name} on ${animal.target.name} and dealt ${animal.attack.pwr} damage!`);

      // Check if the target has been knocked out
      if (animal.target.hp <= 0) {
        console.log(`${animal.target.name} has been knocked out!`);
        if (animal.target === userAnimal) {
          gameOver = true;
          console.log(`Game over! CPU wins!`);
        } else {
          // Assign a new animal to the user
          userAnimal = animalData[Math.floor(Math.random() * animalData.length)];
          userHealth = userAnimal.hp;
          console.log(`You have been assigned a new animal: ${userAnimal.name} with ${userHealth} health!`);
        }
      }
    });
/*
console.log(`${userAnimal.name} used ${userAttack} on ${userTarget} and dealt ${userAttack.pwr} damage!`);
userAnimal.userTarget.hp -= userAttack.pwr;
console.log(`${userAnimal2.name} used ${userAttack2} on ${userTarget2} and dealt ${userAttack2.pwr} damage!`);
userAnimal2.userTarget2.hp -= userAttack2.pwr;
console.log(`${cpuAnimal.name} used ${cpuAttack} on ${cpuTarget} and dealt ${cpuAttack.pwr} damage!`);
cpuAnimal.cpuTarget.hp -= cpuAttack.pwr;
console.log(`${cpuAnimal2.name} used ${cpuAttack2} on ${cpuTarget2} and dealt ${cpuAttack2.pwr} damage!`);
cpuAnimal2.cpuTarget.hp -= cpuAttack2.pwr;
*/
    // Increment the turn counter
    turnCount++;
  }
}

// Call the battle function to start the game
battle();