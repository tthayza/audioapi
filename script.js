let audioContext
let selectTypes = document.querySelector('#select-types')
let oscillatorTypes = ['', 'Sine', 'Square', 'Sawtooth', 'Triangle']

// Criando opções de tipo de oscilador a partir do array oscillatorTypes
let container = document.querySelector('#container')
oscillatorTypes.forEach((type) => {
  const option = document.createElement('option')
  option.classList.add('option-oscillator')
  option.text = type
  selectTypes.appendChild(option)
})

// Verificando se determinado elemento é duplicado a partir de um option selecionado
function checkDuplicatedElements(type) {
  const element = document.querySelector(`.section-${type}`)
  if (element) return true
  return false
}

// Gerando a section com pads de acordo com cada tipo de oscilador
function generateTypeOscillatorSection(type) {
  const typeLowerCase = type.toLowerCase()
  if (checkDuplicatedElements(type)) return
  const section = document.createElement('section')
  section.innerHTML = `    <div class="label-section" >
  <h2>${type} </h2>
  <button> X </button>

 </div>
  `
  const padArea = document.createElement('div')
  padArea.classList.add('pad-area')
  section.classList.add(`section-${type}`)
  for (let i = 1; i <= 6; i++) {
    const button = document.createElement('button')
    button.setAttribute('id', `pad${i}-${typeLowerCase}`)
    button.addEventListener('click', () => {
      ensureAudioContext()

      startRhythmForPad(button.id)
      button.classList.toggle('pad-animated')
      button.classList.toggle('fade')
    })

    button.classList.add('pad')
    button.textContent = `Pad ${i}`
    padArea.appendChild(button)
  }
  section.appendChild(padArea)

  return section
}

selectTypes.addEventListener('change', () => {
  if (selectTypes.value) {
    const newElement = generateTypeOscillatorSection(selectTypes.value)

    if (newElement) container.appendChild(newElement)
  }
})

let rhythmIntervals = {}
audioContext = new (window.AudioContext || window.webkitAudioContext)()
const bpm = 120 // Batidas por minuto
const beatDuration = 60 / bpm

// Função para criar um oscilador com uma frequência específica
function createOscillator(frequency, currentType) {
  const oscillator = audioContext.createOscillator()
  oscillator.type = currentType // Pode ser 'sine', 'square', 'sawtooth' ou 'triangle'
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
    const padIdFormated = padId.slice(0, 4)

    if (padIdFormated === 'pad1') {
      bassDrum = createOscillator(180, padId.slice(5))
      playSound(bassDrum, createAmplitudeEnvelope(), 0.2)
    }
    if (padIdFormated === 'pad2') {
      bassDrum = createOscillator(250, padId.slice(5))
      playSound(bassDrum, createAmplitudeEnvelope(), 0.8)
    }

    if (padIdFormated === 'pad3') {
      snareDrum = createOscillator(330, padId.slice(5))
      playSound(snareDrum, createAmplitudeEnvelope(), 0.2)
    }
    if (padIdFormated === 'pad4') {
      snareDrum = createOscillator(480, padId.slice(5))
      playSound(snareDrum, createAmplitudeEnvelope(), 0.4)
    }
    if (padIdFormated === 'pad5') {
      snareDrum = createOscillator(560, padId.slice(5))
      playSound(snareDrum, createAmplitudeEnvelope(), 0.4)
    }
    if (padIdFormated === 'pad6') {
      snareDrum = createOscillator(950, padId.slice(5))
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
