var canvas = document.querySelector("canvas");
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var img = document.getElementById("raft");
var hedefX = innerWidth/2 - img.width/2;
var hedefY = innerHeight/2 - img.height/2
var raftX =  innerWidth/2 - img.width/2
var raftY = innerHeight/2 - img.height/2

function drawRaft(){
    ctx.drawImage(img, raftX, raftY);
}


function drawWave(x, y, angle){
    var img = document.getElementById("wave");
    ctx.save();
    ctx.translate(x, y);        
    ctx.rotate(angle);
    ctx.drawImage(img, img.width/-2, img.height/-2)
    ctx.restore();
}

//ctx.clearRect(0, 0, canvas.width, canvas.height)

/*
var down = 100;
var random = Math.floor(Math.random() * innerWidth);
var angle = Math.atan2(hedefY - 100, hedefX - random) + (Math.PI/2);
*/

function GenerateWaves(){
    this.random = Math.floor(Math.random() * innerWidth);
    this.angle = Math.atan2(hedefY - 100, hedefX - this.random) + (Math.PI/2);
    this.down = 100;

    this.drawWave = function(){
        this.down += -1*Math.cos(this.angle);
        this.random += 1*Math.sin(this.angle);
        drawWave(this.random, this.down, this.angle);
        drawRaft();
    }
}

function lose(){
    clearInterval(game);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "65px Arial";
    let fail = ["BAŞARAMADIN YEĞENİM!", "BECERİKSİZ!", "YAPAMADIN!", "OLMADI!", "Bİ İŞİ DE BECER!", "MAL!", "YUH!", "ULAN ETRAFA TIKLIYCAN ALT TARAFI!", "TIKLAMAYI BİLE BECEREMİYOSUN!"];


    let a = setInterval(function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillText(fail[0], Math.floor(Math.random()*(innerWidth/2)), Math.floor(Math.random()*innerHeight)-100);
            fail.splice(0, 1);
            if(fail.length === 0){clearInterval(a);}
    }, 500)
}

var waves = [];
for (let index = 0; index < 8; index++) {
    waves.push(new GenerateWaves());
}
var score = 0;
var game = setInterval(function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillText(`Score: ${score}`, 10, 50);
    console.log();
    if(waves.length > 0){
        waves.forEach(wave => {
            wave.drawWave();
            if(wave.down > raftY){
                lose();
            }
        });
    }else{
        for (let index = 0; index < 8; index++) {
            waves.push(new GenerateWaves());
        }
        waves.forEach(wave => {
            wave.drawWave();
        });
    }
}, 10);


function check(waves, x, y){
    let differences = {};
    let k = [];
    waves.forEach(wave => {
        var difference = Math.abs(wave.random - x) + Math.abs(wave.down - y);
        differences[difference] = wave;
        k.push(difference)
    });
    var min = Math.min.apply(Math, k);

    let bruh = differences[min]

    waves.forEach(wave => {
        if(wave === bruh){
            waves.splice(waves.indexOf(wave), 1)
        }
    });
}

canvas.addEventListener("mousedown", (e) => {
    var p = ctx.getImageData(e.clientX, e.clientY, 1, 1).data;
    if((p[0] == 168 && p[1] == 201 && p[2] == 223) || (p[0] == 97 && p[1] == 173 && p[2] == 223) || (p[0] == 88 && p[1] == 123 && p[2] == 145) || p[0] == 187 && p[1] == 224 && p[2] == 248){
        score += 1;
        check(waves, e.clientX, e.clientY);
    }else{
        score -= 1;
    }
    if (score < 0){
        lose();
    }
});



/*
TODO
* restore wave.png
*/
