let horses = []
Array(5)
    .fill(0)
    .forEach((_, i) => horses.push({ name: `${i + 1}번` }))

const settings = {
    trackLength: 1600,
    raceIntervalMs: 1,
    speedInfluence: 0.2,
    randomInfluence: 10,
}

let race = {
    status: 0,
    finishedCount: 0,
}

const horseInit = (horse, index) => {
    const horseRow = document.createElement('div')
    horseRow.className = 'horse-row'

    const nameBox = document.createElement('div')
    nameBox.className = 'horse-name'
    nameBox.innerText = horse.name

    const trackWrapper = document.createElement('div')
    trackWrapper.className = 'track-wrapper'

    const input = document.createElement('input')
    input.type = 'range'
    input.className = 'racetrack'
    input.min = 0
    input.max = settings.trackLength
    input.value = 0
    input.disabled = true
    input.id = `horse-track-${index}`
    horse._input = input

    const badge = document.createElement('span')
    badge.className = 'badge d-none'
    badge.id = `horse-place-${index}`
    horse._badge = badge

    trackWrapper.appendChild(input)
    trackWrapper.appendChild(badge)

    horseRow.appendChild(nameBox)
    horseRow.appendChild(trackWrapper)

    return horseRow
}

function initRace() {
    race.finishedCount = 0
    race.status = 0
    const wrapper = document.getElementById('racetrack-wrapper')
    wrapper.innerHTML = ''

    horses.forEach((horse, index) => {
        horse.speed = Math.floor(Math.random() * 9) + 1
        horse.position = 0
        horse.placing = 0
        horse.finished = false

        wrapper.appendChild(horseInit(horse, index))
    })
}

function moveHorse(horse, index) {
    if (!horse.finished) {
        const randomFactor = settings.randomInfluence * Math.random()
        const speedFactor = settings.speedInfluence * horse.speed
        horse.position += Math.round((randomFactor + speedFactor) / 2)

        if (horse.position >= settings.trackLength) {
            horse.position = settings.trackLength
            horse.finished = true
            race.finishedCount++
            horse.placing = race.finishedCount
            const badge = horse._badge
            badge.textContent = '#' + horse.placing
            badge.classList.remove('d-none')

            if (horse.placing == horses.length) badge.classList.add('bg-fail')
            badge.classList.add(horse.placing < 4 ? 'bg-success' : 'bg-secondary')
        }

        horse._input.value = horse.position
        if (!horse.finished) {
            horse._input.classList.add('running')
        } else {
            horse._input.classList.remove('running')
        }
    }
}

const startBtn = document.getElementById('startBtn')
const resetBtn = document.getElementById('resetBtn')
const playerInput = document.getElementById('players')

let raceInterval

function startRace() {
    if (race.status === 1) return
    race.status = 1

    startBtn.disabled = true
    resetBtn.disabled = false
    playerInput.disabled = true

    // 레이스 시작
    raceInterval = setInterval(() => {
        horses.forEach((horse, i) => moveHorse(horse, i))
        if (race.finishedCount === horses.length) {
            clearInterval(raceInterval)
            race.status = 0
            startBtn.disabled = true
        }
    }, settings.raceIntervalMs)
}

function resetRace() {
    clearInterval(raceInterval) // 레이스 멈춤
    race.status = 0
    race.finishedCount = 0

    // 말들의 위치 초기화
    horses.forEach((horse) => {
        horse.position = 0
        horse.finished = false
        horse._input.value = 0
        horse._badge.classList.add('d-none')
        horse._input.classList.remove('running')
    })

    // UI 초기화
    startBtn.disabled = false
    resetBtn.disabled = true
    playerInput.disabled = false
}

// 버튼 이벤트 리스너
startBtn.addEventListener('click', () => {
    initRace()
    startRace()
})

resetBtn.addEventListener('click', resetRace)

// Init once on page load
initRace()

playerInput.addEventListener('input', (e) => {
    const splited = e.target.value.split(',').map((e) => {
        return { name: e.trim() }
    })
    horses = splited
    initRace()
})
