# Sake Label Maker

For exhibition at Creative Code Tokyo, September 2019.

## TODO

- add dat.gui to control sake label params
  - [TOCONFIRM]
    - sake region -> background gradient color (Ine = red (inemankai), Akita = white (doburoku))
    - sake style (junmai, gingjo, daiginjo, honjozo, futsushu) -> shortcut for param presets? (modifies all other params to certain settings)
    - SMV -> liquid thickness (sweet is thicker, acidic is thinner)
    - semai buai -> liquid color (dark to clear)
    - filtering style (nama, hiyaoroshi, pasturized, muroka, nigori, doburoku) -> blurring of liquid
    - ... change texture img added to liquid (like in fireball example) for changing... what param?... sake region?
    - ... others for deformation intensity, anim speed, etc.
- add sake label text to canvas foreground
- connect dat.gui changes to label text (eg. region changes to "Niigata" -> change text to that)
- add printing file export (or screenshot?)(should be quite long to go around bottle; important?)

dat.gui notes:
- string options allows arrays
- presets exist