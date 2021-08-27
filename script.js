const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 750;
canvas.height = 850;

const plyerCar = new Image();
plyerCar.src = "img/car2.png";
const fon = new Image();
fon.src = "img/fon.png"
const shot = new Image();
shot.src = "img/shot.png";
const enemy = new Image();
enemy.src = "img/vrag.png";

const liser_audio = new Audio();
liser_audio.src = "audio/laser.mp3"
const bang_audio = new Audio();
bang_audio.src = "audio/взрыв.mp3"
const fon_audio = new Audio();
fon_audio.src = "audio/fon.mp3"


//size
const sizePlay = 120;
const sizeShot = 20;
const sizeEnemy = 100;

let velY = 0,
    velX = 0,
    speed = 3, // max speed
    friction = 0.97 // friction


const ply = {
	x: canvas.width/2 - sizePlay/2,
	y: (canvas.height - sizePlay) * 95 / 100
}

let shots = [];
let enemys = [];

const keys = { 
	KeyW : false,
	KeyA : false,
	KeyD : false,
	KeyS : false,
	KeySpace : true
}
let sound = true;

function time(){
	let date = new Date();
	return date.getSeconds()
}

function draw(){
	time();
	control_player();

    ctx.drawImage(fon, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(plyerCar, ply.x, ply.y, sizePlay, sizePlay);
	fly_emeny();
	fly_shot();
	kill();
}

setInterval(draw, 10);

setInterval(() =>{
	enemys.push({
		x: getRandom(0, canvas.width-sizeEnemy),
		y: -sizeEnemy
	});
}, 3000)

function shotKill(){
	shots.push({
		x: ply.x + sizePlay/2 - sizeShot/2,
		y: ply.y - sizeShot
	});
	liser_audio.play();
}

function kill(){
	for(let i = 0; i < enemys.length; i++){
		for(let j = 0; j < shots.length; j++){
			if(shots[j].x > enemys[i].x && shots[j].x < enemys[i].x+sizeEnemy
				&& shots[j].y > enemys[i].y && shots[j].y < enemys[i].y+sizeEnemy*0.7){
				enemys[i].y = canvas.height
				shots[j].y = 0
				bang_audio.play();
				break;
			}
		}
	}
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function fly_emeny(){
	let time_enemys = []
	for(let i = 0; i < enemys.length; i++){
		if(enemys[i].y < canvas.height){
			ctx.drawImage(enemy,  enemys[i].x, enemys[i].y, sizeEnemy, sizeEnemy);
			enemys[i].y += 1;
			time_enemys.push(enemys[i]);
		}
	}
	enemys = time_enemys;
}

function fly_shot(){
	let time_shots = []
	for(let i = 0; i < shots.length; i++){
		if(shots[i].y > 0){
			ctx.drawImage(shot, shots[i].x, shots[i].y, sizeShot, sizeShot*2);
			shots[i].y -= 1;
			time_shots.push(shots[i]);
		}
	}
	shots = time_shots;
}

function control_player(){
	if(keys.KeyW == true && velY > -speed){
      velY--;
	}
	if(keys.KeyA == true && velX > -speed){
      velX--;
	}
	if(keys.KeyD == true && velX < speed){
      velX++;
	}
	if(keys.KeyS == true && velY < speed){
      velY++;
	}

	 // apply some friction to y velocity.
    velY *= friction;
    ply.y += velY;
    // apply some friction to x velocity.
    velX *= friction;
    ply.x += velX;

        // bounds checking
    if (ply.x >= canvas.width - sizePlay) {
        ply.x = canvas.width - sizePlay;
    } else if (ply.x <= 0) {
        ply.x = 0;
    }

    if (ply.y > canvas.height - sizePlay) {
        ply.y = canvas.height - sizePlay;
    } else if (ply.y <= 0) {
        ply.y = 0;
    }
}

document.addEventListener("keydown", function (e) {
	if(e.code == "Space"){
		if(keys.KeySpace){
			shotKill();
		}
		keys.KeySpace = false;
	}
	if(e.code == "KeyW" || e.code == "ArrowUp"){
		keys.KeyW = true;
	}
	if(e.code == "KeyA" || e.code == "ArrowLeft"){
		keys.KeyA = true;
	}
	if(e.code == "KeyD" || e.code == "ArrowRight"){
		keys.KeyD = true;
	}
	if(e.code == "KeyS" || e.code == "ArrowDown"){
		keys.KeyS = true;
	}
});

document.addEventListener("keyup", function (e) {
	if(e.code == "Space"){
		keys.KeySpace = true;
		if(sound == true){
			fon_audio.play();
		}
		else {
			fon_audio.pause();
		}
	}
   if(e.code == "KeyW" || e.code == "ArrowUp"){
		keys.KeyW = false;
	}
	if(e.code == "KeyA" || e.code == "ArrowLeft"){
		keys.KeyA = false;
	}
	if(e.code == "KeyD" || e.code == "ArrowRight"){
		keys.KeyD = false;
	}
	if(e.code == "KeyS" || e.code == "ArrowDown"){
		keys.KeyS = false;
	}
});

function soundPlay(){
	if(sound == true){
		sound = false
	}
	else {
		sound = true
	}
}