const $ = require("jquery")
const THREE = require('three')
const createOrbitViewer = require('three-orbit-viewer')(THREE)
const glslify = require('glslify')
const dat = require('dat.gui')

// label text
let dLabelText = document.createElement('div')
dLabelText.setAttribute('id', 'label-text')
let pFirst = document.createElement('p')
pFirst.setAttribute('id', 'lt-first')
let pSecond = document.createElement('p')
pSecond.setAttribute('id', 'lt-second')
let pThird = document.createElement('p')
pThird.setAttribute('id', 'lt-third')
let pFourth = document.createElement('p')
pFourth.setAttribute('id', 'lt-fourth')
dLabelText.appendChild(pFirst)
dLabelText.appendChild(pSecond)
dLabelText.appendChild(pThird)
dLabelText.appendChild(pFourth)

//add GUI
const gui = new dat.GUI({name: 'Sake Label Generator'})
const sakeParams = {
  'Brewing Region': 'Niigata',
  'Sake Style': 'Daiginjo',
  'Filtering Style': 'Namazake',  //?: more accurate name for prop? see sake book
  'Semai Buai': 50,
  'Sake Meter Value': 0.0
}
const c1 = gui.add(sakeParams, 'Brewing Region').options('Niigata', 'Nagano', 'Fukushima', 'Hiroshima', 'Akita', 'Ine')
const c2 = gui.add(sakeParams, 'Sake Style').options('Daiginjo', 'Ginjo', 'Junmai', 'Honjozo', 'Futsushu')
const c3 = gui.add(sakeParams, 'Filtering Style').options('Namazake', 'Hiyaoroshi', 'Nigori', 'Doburoku', 'Double Filtered')
const c4 = gui.add(sakeParams, 'Semai Buai', 10, 100, 10)
const c5 = gui.add(sakeParams, 'Sake Meter Value', -4.0, 10.0, 1.0)   //?: confirm SMV range in book
const c6 = gui.add({'Export Label Image': function() {
  console.log('Fake Export!')
}}, 'Export Label Image')
c1.onChange(d => {
  // Change gradient background of canvas.
  console.log("c1", d)
  if (d == "Niigata") {
/*
background:
        linear-gradient(45deg, rgba(255,0,0,.5), rgba(0,0,255,.5)),
        url('img/noise.svg');
*/

  } else if (d == "Nagano") {
    console.log("In Nagano!")
    $('body').removeClass().addClass('color2');
  }
})



const initLabelText = function() {
  document.body.appendChild(dLabelText)
  pFirst.textContent = c2.getValue() + " " + c3.getValue()
  pSecond.textContent = c1.getValue()
  pThird.textContent = "精米歩合 " + c4.getValue() + "%"
  pFourth.textContent = "日本酒度 " + c5.getValue()
  //?: do this here?
  $('body').addClass('color1')
}
initLabelText()

//our basic full-screen application and render loop
let time = 0
const app = createOrbitViewer({
  clearColor: 0x000000,
  clearAlpha: 0.0,
  fov: 65,
  position: new THREE.Vector3(0.85, 1, 50)
})

// const bgTexture = new THREE.TextureLoader().load("img/lady-face.jpg", ready)
// bgTexture.format = THREE.RGBFormat
// app.scene.background = bgTexture

//here we create a custom shader with glslify
//note USE_MAP is needed to get a 'uv' attribute
const mat = new THREE.ShaderMaterial({
  vertexShader: glslify('./vert.glsl'),
  fragmentShader: glslify('./frag.glsl'),
  uniforms: {
    // iChannel0: { type: 't', value: bgTexture },
    iGlobalTime: { type: 'f', value: 0 }
  },
  defines: {
    USE_MAP: ''
  }
})

const geo = new THREE.IcosahedronGeometry( 20, 5 )
const bubble = new THREE.Mesh(geo, mat)
bubble.visible = true
app.scene.add(bubble)

//provide our shader with iGlobalTime for cool effects
app.on('tick', dt => {
  time += dt / 1000
  mat.uniforms.iGlobalTime.value = time
})

//once texture is ready, show our bubble
// function ready() {
//   bubble.visible = true
// }
