const MOVE_SPEED = 200
const INVADER_SPEED = 100 
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 100
const TIME_LEFT = 30
const BULLET_SPEED = 400

layer(['obj', 'ui', 'bk'], 'obj')

addLevel([
  '!^^^^^^^^^^^^^^^     &',
  '!^^^^^^^^^^^^^^^     &',
  '!^^^^^^^^^^^^^^^     &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
  '!                    &',
], {
  width: 30, 
  height: 22,
  '^' : [sprite('space_invader'), scale(0.7), 'space_invader'],
  '!' : [sprite('wall'), 'left-wall'],
  '&' : [sprite('wall'), 'right-wall'],
})

const player = add([
  sprite('tank'),
  pos(width() / 2, height()/ 2),
  origin('center')
])



keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

function spawnBullet(p){
  add([
    rect(6,18), 
    pos(p), 
    origin('center'), 
    color(0.5, 0.5, 1),
    'bullet'
    ])
}

keyPress('space', () => {
  spawnBullet(player.pos.add(0, -25))
})


action('bullet', (b)=> {
  b.move(0, -BULLET_SPEED)
  if(b.pos.y < 0){
    destroy(b)
  }
})

collides('bullet', 'space_invader', (b,s)=>{
  camShake(4),
  destroy(b),
  destroy(s),
  score.value++
  score.text = score.value
})

const score = add([
  text('0'),
  pos(150, 320),
  layer('ui'),
  scale(3),
  {
    value: 0,
  }
])



const timer = add([
  text('0'),
  pos(500, 320),
  scale(2),
  layer('ui'),
  {
    time: TIME_LEFT,
  },
])

timer.action(() => {
  timer.time -= dt()
  timer.text = timer.time.toFixed(2)
  if(timer.time <= 0 ) {
    go('lose', {score: score.value})
  }
})



action('space_invader', (s) => {
  s.move(CURRENT_SPEED, 0);
})

collides('space_invader', 'right-wall', () => {
  CURRENT_SPEED = -INVADER_SPEED
  every('space_invader', (s) =>{
    s.move(0, LEVEL_DOWN)
  })
})

collides('space_invader', 'left-wall', () => {
  CURRENT_SPEED = INVADER_SPEED
  every('space_invader', (s) =>{
    s.move(0, LEVEL_DOWN)
  })
})

player.overlaps('space_invader', () => {
  go('lose', {score: score.value})
})

action('space_invader', (s) => {
  if(s.pos.y >= (12 * 22)) {
    go('lose', {score: score.value})
  }
} )