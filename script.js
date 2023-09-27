let audioContext
let selectTypes = document.querySelector('#select-types')
let oscillatorTypes = ['', 'Sine', 'Square', 'Sawtooth', 'Triangle']

let container = document.querySelector('#container')
oscillatorTypes.forEach((type) => {
  const option = document.createElement('option')
  option.classList.add('option-oscillator')
  option.text = type
  selectTypes.appendChild(option)
})

function checkDuplicatedElements(type) {
  const element = document.querySelector(`.section-${type}`)
  if (element) return true
  return false
}

function generateTypeOscillatorSection(type) {
  console.log('retorno', checkDuplicatedElements(type))
  if (checkDuplicatedElements(type)) return
  const section = document.createElement('section')
  section.classList.add(`section-${type}`)
  section.innerHTML = `    <div class="label-section" >
    <h2>${type} </h2>
    <button> X </button>

   </div>
    <div class="pad-area">
      <button class='pad pad1'>Pad 1</button>
      <button class='pad pad2'>Pad 2</button>
      <button class='pad pad3'>Pad 3</button>
      <button class='pad pad4'>Pad 4</button>
      <button class='pad pad5'>Pad 5</button>
      <button class='pad pad6'>Pad 6</button>
    </div>
    `

  return section
}

selectTypes.addEventListener('change', () => {
  console.log(selectTypes.value)
  if (selectTypes.value) {
    const newElement = generateTypeOscillatorSection(selectTypes.value)
    if (newElement) container.appendChild(newElement)
    let pads = document.querySelectorAll('.pad')
    pads.forEach((pad) => {
      pad.addEventListener('click', () => {
        ensureAudioContext()
        startRhythmForPad(pad.classList[1])
        pad.classList.toggle('fade')
        pad.classList.toggle('pad-animated')
      })
    })
  }
})

let rhythmIntervals = {}
audioContext = new (window.AudioContext || window.webkitAudioContext)()
const bpm = 120 // Batidas por minuto
const beatDuration = 60 / bpm

// Função para criar um oscilador com uma frequência específica
function createOscillator(frequency) {
  const oscillator = audioContext.createOscillator()

  oscillator.type = 'triangle' // Pode ser 'sine', 'square', 'sawtooth' ou 'triangle'
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  return oscillator
}

// Função para criar um envelope de amplitude (para controlar o volume)
function createAmplitudeEnvelope() {
  const envelope = audioContext.createGain()
  envelope.gain.setValueAtTime(0, audioContext.currentTime)
  return envelope
}

// Função para tocar um som (oscilador) com um envelope de amplitude
function playSound(oscillator, envelope, duration) {
  oscillator.connect(envelope)
  envelope.connect(audioContext.destination)

  oscillator.start()
  envelope.gain.setValueAtTime(1, audioContext.currentTime)
  envelope.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  )
  oscillator.stop(audioContext.currentTime + duration)
}

function startRhythmForPad(padId) {
  if (rhythmIntervals[padId]) {
    clearInterval(rhythmIntervals[padId])
    delete rhythmIntervals[padId]
    return // Parar o ritmo se ele já estiver tocando
  }

  rhythmIntervals[padId] = setInterval(() => {
    let bassDrum, snareDrum

    if (padId === 'pad1') {
      bassDrum = createOscillator(180)
      playSound(bassDrum, createAmplitudeEnvelope(), 0.2)
    }
    if (padId === 'pad2') {
      bassDrum = createOscillator(250)
      playSound(bassDrum, createAmplitudeEnvelope(), 0.8)
    }

    if (padId === 'pad3') {
      snareDrum = createOscillator(330)
      playSound(snareDrum, createAmplitudeEnvelope(), 0.2)
    }
    if (padId === 'pad4') {
      snareDrum = createOscillator(480)
      playSound(snareDrum, createAmplitudeEnvelope(), 0.4)
    }
    if (padId === 'pad5') {
      snareDrum = createOscillator(560)
      playSound(snareDrum, createAmplitudeEnvelope(), 0.4)
    }
    if (padId === 'pad6') {
      snareDrum = createOscillator(950)
      playSound(snareDrum, createAmplitudeEnvelope(), 0.4)
    }

    // Adicione lógica para outros pads conforme necessário
  }, 1000) // Altere este valor conforme necessário para alterar a velocidade do ritmo
}
function ensureAudioContext() {
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
}
// Função para parar todos os ritmos
function stopAllRhythms() {
  for (const intervalId of Object.values(rhythmIntervals)) {
    clearInterval(intervalId)
  }
  rhythmIntervals = {}
  audioContext.close().then(() => {
    console.log('Audio context closed.')
  })
}

document.getElementById('stopButton').addEventListener('click', stopAllRhythms)
