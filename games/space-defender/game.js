const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 750;
canvas.height = 500;


// ================================
// NAVE
// ================================

const nave = {
    x: canvas.width / 2,
    y: canvas.height - 80,

    largura: 40,
    altura: 50,

    velocidade: 6
};


// ================================
// ESTADO DO JOGO
// ================================

const teclas = {};
const tiros = [];
const inimigos = [];

let pontuacao = 0;
let vidas = 3;
let gameOver = false;


// ================================
// TECLAS
// ================================

document.addEventListener("keydown", (evento) => {

    // Reiniciar quando estiver em Game Over
    if (evento.key === "Enter" && gameOver) {
        reiniciarJogo();
        return;
    }

    teclas[evento.key.toLowerCase()] = true;

    // Atirar
    if (evento.code === "Space" && !gameOver) {
        atirar();
    }
});

document.addEventListener("keyup", (evento) => {
    teclas[evento.key.toLowerCase()] = false;
});


// ================================
// MOVIMENTO DA NAVE
// ================================

function atualizarNave() {

    if (teclas["arrowleft"] || teclas["a"]) {
        nave.x -= nave.velocidade;
    }

    if (teclas["arrowright"] || teclas["d"]) {
        nave.x += nave.velocidade;
    }

    if (teclas["arrowup"] || teclas["w"]) {
        nave.y -= nave.velocidade;
    }

    if (teclas["arrowdown"] || teclas["s"]) {
        nave.y += nave.velocidade;
    }


    // Impede a nave de sair da tela

    if (nave.x < nave.largura / 2) {
        nave.x = nave.largura / 2;
    }

    if (nave.x > canvas.width - nave.largura / 2) {
        nave.x = canvas.width - nave.largura / 2;
    }

    if (nave.y < nave.altura / 2) {
        nave.y = nave.altura / 2;
    }

    if (nave.y > canvas.height - nave.altura / 2) {
        nave.y = canvas.height - nave.altura / 2;
    }
}


// ================================
// DESENHAR NAVE
// ================================

function desenharNave() {

    ctx.save();

    ctx.translate(nave.x, nave.y);

    ctx.beginPath();

    ctx.moveTo(0, -25);
    ctx.lineTo(-20, 25);
    ctx.lineTo(0, 15);
    ctx.lineTo(20, 25);

    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.fill();

    ctx.restore();
}


// ================================
// TIROS
// ================================

function atirar() {

    tiros.push({
        x: nave.x,
        y: nave.y - nave.altura / 2,

        largura: 4,
        altura: 15,

        velocidade: 9
    });
}


function atualizarTiros() {

    for (let i = tiros.length - 1; i >= 0; i--) {

        tiros[i].y -= tiros[i].velocidade;

        if (tiros[i].y < 0) {
            tiros.splice(i, 1);
        }
    }
}


function desenharTiros() {

    for (const tiro of tiros) {

        ctx.fillStyle = "white";

        ctx.fillRect(
            tiro.x - tiro.largura / 2,
            tiro.y,
            tiro.largura,
            tiro.altura
        );
    }
}


// ================================
// INIMIGOS
// ================================

function criarInimigo() {

    const tamanho = 35;

    inimigos.push({

        x: Math.random() * (canvas.width - tamanho) + tamanho / 2,

        y: -tamanho,

        largura: tamanho,
        altura: tamanho,

        velocidade: 2
    });
}


function atualizarInimigos() {

    for (let i = inimigos.length - 1; i >= 0; i--) {

        inimigos[i].y += inimigos[i].velocidade;

        if (inimigos[i].y > canvas.height + inimigos[i].altura) {
            inimigos.splice(i, 1);
        }
    }
}


function desenharInimigos() {

    for (const inimigo of inimigos) {

        ctx.fillStyle = "white";

        ctx.beginPath();

        ctx.arc(
            inimigo.x,
            inimigo.y,
            inimigo.largura / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// Criar inimigo a cada 1 segundo
setInterval(() => {

    if (!gameOver) {
        criarInimigo();
    }

}, 1000);


// ================================
// COLISÃO TIRO + INIMIGO
// ================================

function verificarColisoes() {

    for (let i = tiros.length - 1; i >= 0; i--) {

        for (let j = inimigos.length - 1; j >= 0; j--) {

            const tiro = tiros[i];
            const inimigo = inimigos[j];

            const distanciaX = tiro.x - inimigo.x;
            const distanciaY = tiro.y - inimigo.y;

            const distancia = Math.sqrt(
                distanciaX * distanciaX +
                distanciaY * distanciaY
            );

            if (distancia < inimigo.largura / 2) {

                tiros.splice(i, 1);
                inimigos.splice(j, 1);

                pontuacao += 10;

                atualizarPontuacao();

                break;
            }
        }
    }
}


// ================================
// PONTUAÇÃO
// ================================

function atualizarPontuacao() {

    document.getElementById("pontuacao").textContent = pontuacao;
}


// ================================
// VIDAS
// ================================

function atualizarVidas() {

    document.getElementById("vidas").textContent = vidas;
}


// ================================
// COLISÃO INIMIGO + NAVE
// ================================

function verificarColisaoComNave() {

    for (let i = inimigos.length - 1; i >= 0; i--) {

        const inimigo = inimigos[i];

        const distanciaX = nave.x - inimigo.x;
        const distanciaY = nave.y - inimigo.y;

        const distancia = Math.sqrt(
            distanciaX * distanciaX +
            distanciaY * distanciaY
        );

        if (
            distancia <
            (nave.largura + inimigo.largura) / 2
        ) {

            inimigos.splice(i, 1);

            vidas--;

            atualizarVidas();

            if (vidas <= 0) {

                gameOver = true;
            }
        }
    }
}


// ================================
// GAME OVER
// ================================

function desenharGameOver() {

    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle = "white";

    ctx.textAlign = "center";


    ctx.font = "50px Arial";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2 - 40
    );


    ctx.font = "24px Arial";

    ctx.fillText(
        "Pontuação: " + pontuacao,
        canvas.width / 2,
        canvas.height / 2 + 10
    );


    ctx.font = "20px Arial";

    ctx.fillText(
        "Pressione ENTER para jogar novamente",
        canvas.width / 2,
        canvas.height / 2 + 60
    );
}


// ================================
// REINICIAR JOGO
// ================================

function reiniciarJogo() {

    vidas = 3;

    pontuacao = 0;

    gameOver = false;


    // Limpa tiros e inimigos

    tiros.length = 0;

    inimigos.length = 0;


    // Volta a nave para a posição inicial

    nave.x = canvas.width / 2;

    nave.y = canvas.height - 80;


    // Atualiza a interface

    atualizarPontuacao();

    atualizarVidas();
}


// ================================
// LOOP DO JOGO
// ================================

function jogo() {

    // Limpa a tela

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Se estiver em Game Over

    if (gameOver) {

        desenharNave();

        desenharGameOver();

    } else {

        atualizarNave();

        atualizarTiros();

        atualizarInimigos();

        verificarColisoes();

        verificarColisaoComNave();


        desenharNave();

        desenharTiros();

        desenharInimigos();
    }


    // Continua o loop

    requestAnimationFrame(jogo);
}


// ================================
// INICIAR JOGO
// ================================

jogo();