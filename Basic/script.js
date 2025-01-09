//world constant
deg = Math.PI/180;

//add the player class
function player(x,y,z,rx,ry){
	this.x = x;
	this.y = y;
	this.z = z;
	this.rx = rx;
	this.ry = ry;
}

var map = [
	//x,y,z,rx,ry,rz,width,height,color
	
	//maze main walls
	[0,0,-1000,0,0,0,2000,200,"Patterns/wall1.avif",0.5], //in front of
	[0,0,1000,0,0,0,2000,200,"Patterns/wall2.avif",0.5], //behind
	[1000,0,0,0,90,0,2000,200,"#C0F0FF"], //right
	[-1000,0,0,0,90,0,2000,200,"#C0F0FF"], //left
	[0,100,0,90,0,0,2000,2000,"Patterns/ground2.avif"], //background
	[0,0,-1000,0,0,0,150,150,"Patterns/window.jpeg"] //window
]

var coins = [
	[800,30,-600,0,0,0,50,50,"#FFFF00",1,50],
	[100,30,300,0,0,0,50,50,"#FFFF00",1,50],
	[-900,30,100,0,0,0,50,50,"#FFFF00",1,50],
]

var keys = [
	[600,30,-800,0,0,0,50,50,"#FF0000"],
	[-300,30,100,0,0,0,50,50,"#FF0000"],
	[-100,30,900,0,0,0,50,50,"#FF0000"],
]

var coinSound = new Audio;
coinSound.src = "Sounds/coin.wav";

var keySound = new Audio;
keySound.src = "Sounds/key.wav";

//variables for movement
var PressLeft = 0;
var PressRight = 0;
var PressForward = 0;
var PressBack = 0;
var PressUp = 0;
var MouseX = 0;
var MouseY = 0;

//variable for container
var container = document.getElementById("container");

//variable for locked mouse
var lock = false;

//if it is possible to lock the cursor
var canlock = false;

//if the mouse is pressed
container.onclick = function(){
	if(canlock) container.requestPointerLock();
}

//is the key is pressed
document.addEventListener("keydown", (event) => {
	if(event.key == "a"){
		PressLeft = 5;
	}
	if(event.key == "d"){
		PressRight = 5;
	}
	if(event.key == "w"){
		PressForward = 5;
	}
	if(event.key == "s"){
		PressBack = 5;
	}
	if(event.keyCode == 32){
		PressUp = 1;
	}
})

//if the key is released
document.addEventListener("keyup", (event) => {
	if(event.key == "a"){
		PressLeft = 0;
	}
	if(event.key == "d"){
		PressRight = 0;
	}
	if(event.key == "w"){
		PressForward = 0;
	}
	if(event.key == "s"){
		PressBack = 0;
	}
	if(event.keyCode == 32){
		PressUp = 0;
	}
})

//if the mouse is locked (locked mouse listener)
document.addEventListener("pointerlockchange", (event) => {
	lock = !lock;
})

document.addEventListener("mousemove", (event) => {
	MouseX = event.movementX;
	MouseY = event.movementY;
})

var pawn = new player(0,0,0,0,0);

var world = document.getElementById("world");

function update(){
	//count movement
	//dx = PressRight - PressLeft;
	//dz = - (PressForward - PressBack);
	dx = Math.cos(pawn.ry * deg) * (PressRight - PressLeft) - Math.sin(pawn.ry * deg) * (PressForward - PressBack);
	dz = - Math.sin(pawn.ry * deg) * (PressRight - PressLeft) - Math.cos(pawn.ry * deg) * (PressForward - PressBack);
	dy = - PressUp;
	drx = MouseY;
	dry = - MouseX;
	MouseX = MouseY = 0;
	
	//add movement to the coordinates
	pawn.x = pawn.x + dx;
	pawn.y = pawn.y + dy;
	pawn.z = pawn.z + dz;
	if (lock){
		pawn.rx = pawn.rx + drx;
		pawn.ry = pawn.ry + dry;
	}
	
	//move the world
	world.style.transform = "translateZ(600px)" + 
							"rotateX(" + (-pawn.rx) + "deg)" + 
							"rotateY(" + (-pawn.ry) + "deg)" +
							"translate3d(" + (-pawn.x) + "px," + (-pawn.y) + "px," + (-pawn.z) + "px)";
}

function CreateNewWorld(){
	CreateSquares(map,"map");
}

function CreateSquares(squares,string){
	for (i = 0; i < squares.length; i++){
		
		//define styles of squares
		let newElement = document.createElement("div");
		newElement.className = string +" square";
		newElement.id = string + i;
		newElement.style.width = squares[i][6] + "px";
		newElement.style.height = squares[i][7] + "px";
		newElement.style.background = squares[i][8];
		newElement.style.backgroundImage = "url(" + squares[i][8] + ")";
		newElement.style.opacity = squares[i][9];
		newElement.style.borderRadius = squares[i][10] + "px";
		newElement.style.transform = "translate3d(" + 
										(600 - squares[i][6]/2 + squares[i][0]) + "px," +
										(400 - squares[i][7]/2 + squares[i][1])+ "px," + 
										squares[i][2] + "px)" +
										"rotateX(" + squares[i][3] + "deg)" + 
										"rotateY(" + squares[i][4] + "deg)" + 
										"rotateZ(" + squares[i][5] + "deg)";
		//add squares to the world
		world.append(newElement);
	}	
}

function interact(objects,string,objectSound){
	for(i = 0; i < objects.length; i++){
		let dto = (objects[i][0] - pawn.x)**2 + (objects[i][1] - pawn.y)**2 + (objects[i][2] - pawn.z)**2;
		let wo = objects[i][6]**2;
		console.log(dto,wo);
		if(dto < wo){
			objectSound.play();
			document.getElementById(string + i).style.display = "none";
			objects[i][0] = 1000000;
			objects[i][1] = 1000000;
			objects[i][2] = 1000000;
		}
	}
}



function repeatFunction(){
	update();
	interact(coins,"coin",coinSound);
	interact(keys,"key",keySound);
}

