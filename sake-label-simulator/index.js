const $ = require("jquery")
const THREE = require('three')
const createOrbitViewer = require('three-orbit-viewer')(THREE)
const glslify = require('glslify')
const dat = require('dat.gui')

let lt1,
    lt2,
    lt3,
    lt4,
    lt5
const sb10Color = 0xffffff,
      sb100Color = 0xffd800

//add GUI
const gui = new dat.GUI({name: 'Sake Label Generator'})

let sakeParams = {
  'Brewing Region': 'Nagano',
  'Sake Style': 'Daiginjo',
  'Filtering Style': 'Namazake',  // 'filtering' name ok?
  'Semai Buai': 50,
  'Sake Meter Value': 3.0
}
let brewingRegionOptions = ['Nagano', 'Fukushima', 'Akita', 'Ine']
let sakeStyleOptions = ['Daiginjo', 'Ginjo', 'Junmai', 'Honjozo', 'Futsushu']
let filteringStyleOptions = ['Namazake', 'Hiyaoroshi', 'Nigori', 'Doburoku', 'Double Filtered']

const c1 = gui.add(sakeParams, 'Brewing Region', brewingRegionOptions)
const c2 = gui.add(sakeParams, 'Sake Style', sakeStyleOptions)
const c3 = gui.add(sakeParams, 'Filtering Style', filteringStyleOptions)
const c4 = gui.add(sakeParams, 'Semai Buai', 10, 100, 10)
const c5 = gui.add(sakeParams, 'Sake Meter Value', -4.0, 10.0, 1.0)   //?: confirm SMV range in book
const c6 = gui.add({'Export Label Image': function() {
  console.log('Fake Export!')
}}, 'Export Label Image')
c1.onChange(d => {
  // update label text
  lt3.text(d)
  //
  $('body').removeClass().addClass(d)
  $('#lt-second').text(d)
})
c2.onChange(d => {
  // update label text
  lt1.text(d)
  // presets for other attributes?
})
c3.onChange(d => {
  // update label text
  lt2.text(d)
  // blurring
})
c4.onChange(d => {
  // update label text
  lt4.text(d)
  // Semai Buai changes liquid's color.
  const normalized = (sakeParams['Semai Buai'] - 10.0) / 90.0
  mat.uniforms.iColorFill.value = getSemaiBuaiColor(normalized)
})
c5.onChange(d => {
  // update label text
  lt5.text(formatSVM(d))
  // Sake Meter Value changes deformation & speed of liquid
  const deformAmt = mapRange(sakeParams['Sake Meter Value'], -4.0, 10.0, 10.0, 1.0)
  mat.uniforms.iDeformAmt.value = deformAmt
  mat.uniforms.iTimeMod.value = reverseNumber(deformAmt, 1.0, 10.0);
})

const init = function() {
  // TIP: use appendTo() if you want it to return the new element
  const dLabelText = $('<div id="label-text"></div>').appendTo('body')
  $('<p><span id="lt-1"></span> <span id="lt-2"></span></p>'+
    '<p><span id="lt-3"></span></p>'+
    '<p>精米歩合 <span id="lt-4"></span>%</p>'+
    '<p>日本酒度 <span id="lt-5"></span></p>'
    ).appendTo(dLabelText)
  lt1 = $('#lt-1').text(c2.getValue())
  lt2 = $('#lt-2').text(c3.getValue())
  lt3 = $('#lt-3').text(c1.getValue())
  lt4 = $('#lt-4').text(c4.getValue())
  lt5 = $('#lt-5').text(formatSVM(c5.getValue()))

  //?: do this here?
  $('body').addClass('Nagano')
}()

//our basic full-screen application and render loop
let time = 0
const app = createOrbitViewer({
  clearColor: 0x000000,
  clearAlpha: 0.0,
  fov: 65,
  position: new THREE.Vector3(0.85, 1, 50)
})

console.log(app.engine)

const texture = new THREE.TextureLoader().load("img/nagano-bg.png", ready)
texture.format = THREE.RGBFormat
// app.scene.background = texture

//here we create a custom shader with glslify
//note USE_MAP is needed to get a 'uv' attribute
const mat = new THREE.ShaderMaterial({
  vertexShader: glslify('./vert.glsl'),
  fragmentShader: glslify('./frag.glsl'),
  uniforms: {
    iGlobalTime: {type: 'f', value: 0},
    iTimeMod: {type: 'f', value: 1},
    iDeformAmt: {type: 'f', value: sakeParams['Sake Meter Value']},
    iColorFill: {value: new THREE.Color(0xffffff)},
    iResolution: {value: new THREE.Vector2(app.engine.width, app.engine.height)},
    iChannel0: { type: 't', value: texture }
  },
  defines: {
    USE_MAP: ''
  }
})

const geo = new THREE.IcosahedronGeometry( 20, 5 )
const bubble = new THREE.Mesh(geo, mat)
bubble.visible = false
app.scene.add(bubble)

//provide our shader with iGlobalTime for cool effects
app.on('tick', dt => {
  time += dt / 1000
  mat.uniforms.iGlobalTime.value = time
})

//once texture is ready, show our bubble
function ready() {
  bubble.visible = true
}

function formatSVM(d) {
  return Math.sign(d) === 1 ? '+'+d : d
}

// amount: between 0.0 and 1.0
function getSemaiBuaiColor(amount) {
  return new THREE.Color(lerpColor(sb10Color, sb100Color, amount))
}

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

// If range is 1-to-10 and you have 2, the reverse is 9 (1 away from opposite edge)
function reverseNumber(value, min, max) {
    return (max + min) - value;
}

// THREE.Color.lerp() stops responding after the first few frames, so I'm lerping colors myself.
const lerpColor = function(a, b, amount) {
    const ar = a >> 16,
          ag = a >> 8 & 0xff,
          ab = a & 0xff,

          br = b >> 16,
          bg = b >> 8 & 0xff,
          bb = b & 0xff,

          rr = ar + amount * (br - ar),
          rg = ag + amount * (bg - ag),
          rb = ab + amount * (bb - ab);

    return (rr << 16) + (rg << 8) + (rb | 0);
};