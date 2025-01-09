//variables for navigation
var menu1 = document.getElementById("menu1");
var menu2 = document.getElementById("menu2");
var button1 = document.getElementById("button1");
var button2 = document.getElementById("button2");
var button3 = document.getElementById("button3");

button1.onclick = function(){
	menu1.style.display = "none";
	CreateNewWorld();
	CreateSquares(coins,"coin");
	CreateSquares(keys,"key");	
	TimerGame = setInterval(repeatFunction,10);
	canlock = true;
}

button2.onclick = function(){
	menu1.style.display = "none";
	menu2.style.display = "block";
}

button3.onclick = function(){
	menu2.style.display = "none";
	menu1.style.display = "block";
}

