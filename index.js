const canvas = document.querySelector("canvas");
const scoreCountElem = document.querySelector(".score-count")

canvas.width = innerWidth
canvas.height = innerHeight

const ctx = canvas.getContext('2d');

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color;
        ctx.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color;
        ctx.fill()
    }

    update() {
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.draw();
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color;
        ctx.fill()
    }

    update() {
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.draw();
    }
}

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let score = 0;
scoreCountElem.innerHTML = score;

const player = new Player(centerX, centerY, 30, "blue");


const projectiles = [];
const enemies = [];

// Animation loop
const animate = () => {
    console.log("animate");
    const animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach((projectile) => {
        projectile.draw();
        projectile.update();
    })
    enemies.forEach((enemy, enemyIdx) => {
        enemy.update();

        // Detecting collision with player
        const playerDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        console.log(playerDist)
        if (playerDist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
            alert(`Game over. Your score: ${score}`);
            location.reload();
        };

        projectiles.forEach((projectile, projectileIdx) => {
            // Detecting collision with projectile
            const projectileDist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (projectileDist - enemy.radius - projectile.radius < 1) {
                enemies.splice(enemyIdx, 1);
                projectiles.splice(projectileIdx, 1);
                score++;
                scoreCountElem.innerHTML = score;
            };
        })
    })
}

function spwanEnemies() {
    setInterval(() => {
        const radius = 30;

        let x;
        let y;
        if (Math.random() < 0.5) {
            x = (Math.random() < 0.5) ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = (Math.random() < 0.5) ? 0 - radius : canvas.height + radius;
        }
        const color = "green";
        const angle = Math.atan2(centerY - y, centerX - x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 3000)
}

window.addEventListener("click", (event) => {
    const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    }
    const projectile = new Projectile(centerX, centerY, 5, "red", velocity)
    projectiles.push(projectile)
})

animate();
spwanEnemies();