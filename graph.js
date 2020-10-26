let canvas, context;
let graphCanvas,graphContext;
let persons = new Array();
let elapsedTime;
let timer = null;

class Person {
    constructor(status) {
        this.x = 0;
        this.y = 0;
        this.r = 10;
        this.v = 0;
        this.angle = 0;
        this.status = status;
    }
    move() {
        console.log("move");
        this.x += this.v * Math.cos(this.angle);
        this.y += this.v * Math.sin(this.angle);
        if((this.x < this.r)||(this.x > canvas.width - this.r)) {
            this.angle = Math.PI - this.angle;
            if(this.x < this.r) this.x = this.r;
            if(this.x > canvas.width - this.r) {
                this.x = canvas.width - this.r;
            }
        }
        if((this.y < this.r)||(this.y > canvas.height - this.r)) {
            this.angle = Math.PI*2 - this.angle;
            if(this.y < this.r) this.y = this.r;
            if(this.y > canvas.height - this.r) {
                this.y = canvas.height - this.r;
            }
        }
    }
    collide(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const d  = (dx ** 2 + dy ** 2)**0.5;
        if(d<this.r*2){
            if(this.status == "positive") target.status = "positive";
            if(target.status == "positive") this.status = "positive";
            target.angle = Math.atan2(dy,dx);
            this.angle = Math.PI - this.angle + target.angle *2;
            if((this.v > 0)&&(target.v > 0)) {
                this.v = (target.v + this.v)/2;
                target.v = this.v;
            }
            this.move();
            target.move();
        }
    }
    draw() {
        context.strokeStyle = "#666666";
        context.fillStyle = "#ffffff";
        if (this.status == "positive") context.fillStyle = "#000000";
        context.beginPath();
        context.arc(this.x,this.y,this.r,0,Math.PI*2);
        context.fill();
        context.stroke();
    }
}

const init = () => {
    canvas = document.getElementById("city");
    context = canvas.getContext("2d");
    graphCanvas = document.getElementById("graph");
    graphContext = graphCanvas.getContext("2d");
    initCanvas();
}

const initCanvas = () => {
    context.clearRect(0,0,canvas.width,canvas.height);
    graphContext.clearRect(0,0,graphCanvas.width,graphCanvas.height);
    graphContext.strokeStyle = "#6666FF";
    graphContext.beginPath();
    graphContext.moveTo(0,graphCanvas.height/2);
    graphContext.stroke();
    persons = [];
    const num = document.getElementById("num").value;
    for (let i = 0; i<100; i++) {
        const person = new Person("negative");
        if (i==0) person.status = "positive";
        if (i < num) {
            person.v = 1;
            person.angle = Math.random() * Math.PI+2;
        }
        persons.push(person);
    }
    for (let i=persons.length-1; i>0; i--) {
        let j = Math.floor(Math.random()*i);
        [persons[i],persons[j]] = [persons[j],persons[i]];
    }
    for (let y=0; y<10; y++) {
        for (let x=0; x<10; x++) {
            const index = x + y * 10;
            persons[index].x = x * 60 + 30;
            persons[index].y = y * 60 + 30;
            persons[index].draw();
        }
    }
}

const startSimulation = () => {
    initCanvas();
    elapsedTime = 0;
    if (timer != null) clearInterval(timer);
    timer = setInterval(simulate,20);
}

const simulate = () => {
    for (const person of persons) {
        person.move();
        for (const target of persons) {
            if(person != target) person.collide(target);
        }
    }
    let cnt = 0;
    context.clearRect(0,0,canvas.width,canvas.height);
    for (const person of persons) {
        person.draw();
        if(person.status == "positive") cnt++;
    }
    graphContext.strokeStyle = "#000000";
    graphContext.beginPath();
    graphContext.moveTo(elapsedTime,graphCanvas.height);
    graphContext.lineTo(elapsedTime,graphCanvas.height - cnt);
    graphContext.stroke();
    elapsedTime++;
    if(elapsedTime > 600) {
        clearInterval(timer);
        timer = null;
    }
}
