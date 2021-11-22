const field = document.querySelector('#field')
const game = document.querySelector('#game')
const startGameBtn = document.querySelector('#startGameBtn')
const pen = field.getContext('2d')
const scoreBlock = document.querySelector('.game-header__score')
const modal = document.createElement('div')
const soundSuccess = './sound/sound_success.mp3'
const soundGameOver = './sound/sound_game_over.mp3'
const soundTurn = './sound/sound_turn.mp3'
let flag = true
let score = 0
let padding = 8

const cfg = {
  step: 0,
  maxStep: 30,
  sizeSquare: 32,
  sizeFood: 32 / 3
}
const snake = {
  x: 120,
  y: 240,
  driveX: cfg.sizeSquare + padding,
  driveY: 0,
  tails: [],
  maxTails: 3
}
const food = {
  x: 400,
  y: 200
}


startGameBtn.addEventListener('click', () => {
  startGameBtn.parentElement.remove()
  requestAnimationFrame(gameLoop)
})

document.addEventListener('keydown', (event) => {
  if (flag) {
    if (event.key === 'ArrowUp' && snake.y <= snake.tails[1].y) {
      snake.driveY = -cfg.sizeSquare - padding
      snake.driveX = 0
      if (snake.y >= snake.tails[1].y) playSound(soundTurn)
    } else if (event.key === 'ArrowLeft' && snake.x <= snake.tails[1].x) {
      snake.driveX = -cfg.sizeSquare - padding
      snake.driveY = 0
      if (snake.x >= snake.tails[1].x) playSound(soundTurn)
    } else if (event.key === 'ArrowDown' && snake.y >= snake.tails[1].y) {
      snake.driveY = cfg.sizeSquare + padding
      snake.driveX = 0
      if (snake.y <= snake.tails[1].y) playSound(soundTurn)
    } else if (event.key === 'ArrowRight' && snake.x >= snake.tails[1].x) {
      snake.driveX = cfg.sizeSquare + padding
      snake.driveY = 0
      if (snake.x <= snake.tails[1].x) playSound(soundTurn)
    }
  } else if (event.key === 'Enter' || event.key === 'Escape') refreshGame()
})

function gameLoop () {
  if (flag) {
    requestAnimationFrame(gameLoop)
    if (++cfg.step < cfg.maxStep) return

    cfg.step = 0
    pen.clearRect(0, 0, field.width, field.height)

    drawFood()
    drawSnake()
  }
  }

function drawSnake () {
  snake.x += snake.driveX
  snake.y += snake.driveY
  snake.tails.unshift({x: snake.x, y: snake.y})

  collisionBorder()

  if (snake.tails.length > snake.maxTails) snake.tails.pop()
  snake.tails.forEach((elem, index) => {
    index ? pen.fillStyle = '#31604a' : pen.fillStyle = '#74e7b2'

    pen.fillRect(elem.x, elem.y, cfg.sizeSquare, cfg.sizeSquare)

    if (snake.x === food.x && snake.y === food.y) {
      snake.maxTails++
      score++
      drawScore()
      playSound(soundSuccess, true)
      randomPositionFood()
    }
  })
  for (let i = 1; i < snake.tails.length; i++) {
    if (snake.x === snake.tails[i].x && snake.y === snake.tails[i].y) {
      stopGame()
    }
  }
}

function collisionBorder() {
  if (snake.x < 0 || snake.x >= field.width) stopGame()
  if (snake.y < 0 || snake.y >= field.height) stopGame()
}

function stopGame () {
  flag = false
  const title = document.createElement('h2')
  const scoreModal = document.createElement('span')
  const btn = document.createElement('button')
  modal.classList.add('modal')
  title.classList.add('modal__title')
  scoreModal.classList.add('modal__score')
  btn.classList.add('modal__btn')
  btn.addEventListener('click', refreshGame)
  title.innerHTML = 'game over'
  scoreModal.innerHTML = score.toString()
  btn.innerHTML = 'click to continue'
  modal.append(title)
  modal.append(scoreModal)
  modal.append(btn)
  game.append(modal)

  playSound(soundGameOver)
}

function refreshGame () {
  flag = true
  modal.innerHTML = ''
  modal.remove()

  score = 0
  snake.x = 120
  snake.y = 240
  snake.driveX = cfg.sizeSquare + padding
  snake.driveY = 0
  snake.tails = []
  snake.maxTails = 3

  gameLoop()
  drawScore()
  randomPositionFood()
}

function randomPositionFood () {
  food.x = gerRandomNumber(0, field.width / (cfg.sizeSquare + padding)) * (cfg.sizeSquare + padding)
  food.y = gerRandomNumber(0, field.height / (cfg.sizeSquare + padding)) * (cfg.sizeSquare + padding)
}

function drawFood () {
  pen.beginPath()
  pen.fillStyle = '#e50f0f'
  pen.arc(food.x + (cfg.sizeSquare / 2), food.y + (cfg.sizeSquare / 2), cfg.sizeFood, 0, 2 * Math.PI)
  pen.fill()
}

function drawScore () {
  scoreBlock.innerHTML = score.toString()
}

function playSound (track, call) {
  const sound = new Audio()
  sound.src = track
  call ? sound.volume = 0.1 : sound.volume = 0.5
  sound.play()
}

const gerRandomNumber = (max, min) => Math.floor(Math.random() * (max - min) + min)

drawScore()



