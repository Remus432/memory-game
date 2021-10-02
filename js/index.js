setTimeout(() => {

const themeEl = document.querySelector(".theme")
const playersCountEl = document.querySelector(".players-count")
const gridSizeEl = document.querySelector(".grid-size")
const startGameBtn = document.querySelector(".game-start__btn")

class GameSettings {
  constructor(selectedTheme, playersCount, gridSize) {
    this.selectedTheme = selectedTheme
    this.playersCount = playersCount
    this.gridSize = gridSize
  }

  selectTheme(e) {
    this.selectedTheme = e.target.innerText.toLowerCase()
    this.updateClass(e.target)
  }

  selectPlayerCount(e) {
    this.playersCount = +e.target.innerText
    this.updateClass(e.target)
  }

  selectGridSize(e) {
    this.gridSize = e.target.innerText
    this.updateClass(e.target)
  }

  updateClass(el) {
    const options = el.parentElement.children;
    [...options].forEach(option => option.classList.remove("selected"))
    el.classList.add("selected")
  }

  startGame() {
    const gameSettings = {
      theme: this.selectedTheme,
      playersCount: this.playersCount,
      gridSize: this.gridSize
    }

    window.history.pushState(gameSettings, null, "game.html")
    
    this.updatePage()
  }

  async updatePage() {
    const res = await fetch("http://localhost:5500/game.html")
    const data = await res.text()

    document.open()
    document.write(data)
    document.close()
  }
}

const game = new GameSettings("numbers", 1, "4x4")

themeEl.addEventListener("click", e => game.selectTheme(e))
playersCountEl.addEventListener("click", e => game.selectPlayerCount(e))
gridSizeEl.addEventListener("click", e => game.selectGridSize(e))
startGameBtn.addEventListener("click", () => game.startGame())

}, 0)