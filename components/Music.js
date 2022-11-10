class Music extends Component {
  constructor() {
    super({
      template: `<div>
      <audio ref='bgm' src="./assets/audio/bgm.mp3" loop="loop"></audio>
      <audio ref='carry' src="./assets/audio/load.mp3"></audio>
      <audio ref='refresh' src="./assets/audio/refresh.mp3"></audio>
      <audio ref='inbound' src="./assets/audio/inbound.mp3"></audio>
      <audio ref='outbound' src="./assets/audio/outbound.mp3"></audio>
      </div>
`
    })
  }

  replay(type) {
    this.refs?.[type] && (this.refs[type][0].currentTime = 0)
    this.refs?.[type]?.[0]?.play()
  }

  play(type) {
    this.refs?.[type]?.[0]?.play()
  }

  pause(type) {
    this.refs?.[type]?.[0]?.pause()
  }
}
