import GameSession from "./gameSession.js"

setTimeout(() => {

  let { theme, playersCount, gridSize } = window.history.state

  class Game {
    constructor(theme, playersCount, gridSize) {
      this.theme = theme
      this.playersCount = playersCount
      this.gridSize = 0
      this.grid = gridSize
      this.gridEl = document.querySelector(".grid")
      this.randomNumArr = []
      this.shuffledArr = []
      this.completeNumSet = []
      this.secondsPassed = 0
      this.moves = 0
      this.tiles = []
      this.click = 0
      this.matches = 0
      this.timePassed = ""
      this.timerId = 0
    }

    defineGrid() {
      if (this.grid.includes("4")) this.gridSize = 16
      if (this.grid.includes("6")) this.gridSize = 36
    }

    renderGrid() {
      this.gridEl.classList.add(`${this.gridSize === 16 ? "small" : "large"}`)

      this.generateRandomNumArray()
      for (let i = 1; i <= this.gridSize; i++) {
        this.gridEl.innerHTML += `
          <div class="grid__item">
            <div class="grid__item-inner">
              <div class="grid__item-front"></div>
              <div class="grid__item-back">
                ${this.completeNumSet[i-1]}
              </div>
            </div>
          </div>
        `
      }
    }

    generateRandomNumArray() {
      for (let i = 1; i <= (this.gridSize / 2); i++) {
        let randNum = this.generateRandomNum()

        if (!this.randomNumArr.includes(randNum)) {
          this.randomNumArr = [...this.randomNumArr, randNum]
        } else {
          randNum = this.generateRandomNum()
          this.randomNumArr = [...this.randomNumArr, randNum]
        }
      }

      this.shuffledArr = this.shuffleArray([...this.randomNumArr])
      this.completeNumSet = [...this.randomNumArr, ...this.shuffledArr]
    }

    shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }

      return arr
    }

    generateRandomNum() {
      return Math.floor(Math.random() * (this.gridSize * 2))
    }

    startTimer(el) {
      game.gridEl.removeEventListener("click", startTimer)

      if (el.classList.contains("grid__item-front")) {
        this.timerID = setInterval(() => {
          this.secondsPassed++
          this.timePassed = new Date(this.secondsPassed * 1000).toISOString().substr(14, 5)
          document.querySelector(".player__time-amount").textContent = this.timePassed
        }, 1000)
        
      }
    }

    updateMoves(el) {
      if (el.classList.contains("grid__item-front")) {
        if (this.tiles.length === 2) {
          this.moves++
          document.querySelector(".player__moves-amount").textContent = this.moves
        }
      }
    }

    matchTiles(el) {
      if (el.classList.contains("grid__item-front")) {
        this.click++
        if (this.click === 2) {
          el.parentElement.classList.add("selected")
          this.tiles = [...this.tiles, el.nextElementSibling.innerText]
          this.updateMoves(el)
          this.updateTiles()
          
        } else {
          el.parentElement.classList.add("selected")
          this.tiles = [...this.tiles, el.nextElementSibling.innerText]
          this.updateMoves(el)
        }
      }
    }

    updateTiles() {
      if (this.tiles[0] === this.tiles[1]) {
        setTimeout(() => {
          document.querySelectorAll(".selected").forEach(item => item.classList.replace("selected", "matched"))
          this.tiles = []
          this.click = 0
          this.matches++
          if (this.matches === this.gridSize / 2) this.gameFinished()
        }, 500)
      } else {
        setTimeout(() => {
          document.querySelectorAll(".selected").forEach(item => item.classList.remove("selected"))
          this.tiles = []
          this.click = 0
        }, 500)
      }
    }

    gameFinished() {
      document.body.classList.add("overlay")
      document.querySelector(".gameover__time-elapsed-amount").textContent = this.timePassed
      document.querySelector(".gameover__moves-taken-amount").textContent = `${this.moves} Moves`
      document.querySelector(".gameover__overlay").style.display = "inline-block"
      clearInterval(this.timerID)
    }
  }

  const startTimer = e => game.startTimer(e.target)

  const game = new Game(theme, playersCount, gridSize)
  const gameSession  = new GameSession(playersCount, document.querySelector(".players"))

  game.defineGrid()
  game.renderGrid()
  gameSession.renderPlayers()
  
  game.gridEl.addEventListener("click", startTimer)
  game.gridEl.addEventListener("click", e => game.matchTiles(e.target))
  document.querySelector(".restart").addEventListener("click", () => window.location.reload())
  document.querySelector(".new-game").addEventListener("click", async () => { 
    window.history.pushState("", null, "index.html")

    const res = await fetch("http://localhost:5500/index.html")
    const data = await res.text()

    document.open()
    document.write(data)
    document.close()
  })
}, 0)