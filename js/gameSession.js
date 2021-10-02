class GameSession {
  constructor(playersCount, playersEl) {
    this.playersCount = playersCount
    this.playersEl = playersEl
  }

  renderPlayers() { 
    if (this.playersCount > 1) {

    } else {
      this.playersEl.innerHTML = `
        <div class="player solo">
          <div class="player__time">
            <span class="player__time-label label">Time</span>
            <span class="player__time-amount amount">00:00</span>
          </div>
          <div class="player__moves">
            <span class="player__moves-label label">Moves</span>
            <span class="player__moves-amount amount">0</span>
          </div>
        </div>
      `
    }
  }


}

export default GameSession