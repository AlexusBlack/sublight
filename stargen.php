<?php
ini_set('display_errors', 1); ini_set('display_startup_errors', 1); error_reporting(E_ALL);

define('PI', pi());

function RandFloat() {
  return mt_rand() / mt_getrandmax();
}

function RandEl($arr) {
  return $arr[floor(RandFloat() * count($arr))];
}

$greekNames= ["Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta","Iota","Kappa","Lambda","Mu","Nu","Xi","Omicron","Pi","Rho","Sigma","Tau","Upsilon","Phi","Chi","Psi","Omega"];
$animalsLatin =["Albus Kados","Lacertus","Formica","Oryx Illaqueatus","Papio","Melis","Vespertilio","Ursa","Castori Concedite","Apes","Avem","Aper","Gloria","Cattus","Silurus","Sacrorum","Cellariarius","Colubra","Uaccam","Cancer","Cicero","Corvus","Cervus","Canis","Asinus","Columba","Draco","Draco Volant","Mea","Aquila","Elephantus","Atropurpureum","Vulpes","Rana","Silvis","Stilio","Rodentia","Capra","Anser","Lepus","Accipiter","Erinaceus","Serm","Equus","Hummingbird","Hyaenis","Ibis","Fontem Draconis","Macropus","Lemurem","Pardus","Leo","Lacerta","Cammarus","Lynx","Mascarene","Simia","Mus","Adonias","Ocelot","Ptilium","Lutra","Noctua","Bovi","Parror","Pellicane","Phasianum","Porcus","Columbam","Absentia","Lepus","Corvus","Warner","Salmo","Larus","Phoca","Serpenti","Pistris","Ovium","Anguis","Passer","Aranea","Sciurus","Maris Stella","Ciconia","Hirundo","Olor","Tapir","Tigris","Testudo","Vulturius","Vespa","Balena","Lupus"];
$thingsLatin = ["Altaris","Incus","Sagittarius","Sagitta","Ferrum","Liber","Scopulus","Pontem","Scopae","Peniculus","Lucerna","Plaustrum","Arce","Cathedra","Pectus","Ccalprum","Capsule","Horologium","Circuitus","Conus","Couldron","Crucis","Coronam","Calix","Pugione","Adamas","Guttula","Tympanum","Oculus","Pluma","Ignis","Vexillum","Flamma","Flos","Gloria","Furca","fons","Fornacem","Porta","Gemma","Malleus","Galerum","Ascia","Cordis","Galeam","Ungula","Cornu","Clepsydra","Domum","Cultro","Miues","Lancea","Lumina","Folium","Lux","Miserere","Mons","Acus","Laminae","Dolabra","Tibia","Pyramidis","circulum","Flumen","Flumen","Tunicae","Virga","Surculus","Fascia","Sceptrum","Stupra","Volumen","Crusta","Clypeus","Navis","Calvaria","Militus","Ligonem","Hastam","Dicula","Gladio","Mensa","Templum","Throni","Dente","Facem","Turrim","Arbor","Triangulum","Vase","Fluctus","Rotam","Wing"];
$prefixLatin = ["Maior", "Minor", "Magnum", "Parvus", "Australis", "Borealis","Occidentalis","Orientalis", "Minima", "Magna", "Volantes"];
function GetRandomName() {
  global $greekNames, $animalsLatin, $thingsLatin, $prefixLatin;
  $name = '';
  if(RandFloat() > 0.5) {
    $name = RandEl($greekNames) . " " . RandEl($animalsLatin);
  } else {
    $name = RandEl($greekNames) . " " . RandEl($thingsLatin);
  }
  if(RandFloat() > 0.3) {
    $name = $name . " " . RandEl($prefixLatin);
  }
  if(RandFloat() > 0.5) {
    $name = RandEl($greekNames) . "-" . mt_rand(1, 1000);
  }
  return $name;
}

$numArms = 2;
$numStars = 1000;
$armSeparationDistance = 2 * PI / $numArms;
$armOffsetMax = 1.0;
$rotationFactor = 9;
$randomOffsetXY = 0.15;

$starPositions = [];
for($i = 0; $i < $numStars; $i++) {
    // Choose a distance from the center of the galaxy.
    $distance = RandFloat();
    $distance = pow($distance, 2);

    // Choose an angle between 0 and 2 * PI.
    $angle = RandFloat() * 2 * PI;
    $armOffset = RandFloat() * $armOffsetMax;
    $armOffset = $armOffset - $armOffsetMax / 2;
    $armOffset = $armOffset * (1 / $distance);

    $squaredArmOffset = pow($armOffset, 2);
    if($armOffset < 0)
        $squaredArmOffset = $squaredArmOffset * -1;
    $armOffset = $squaredArmOffset;

    $rotation = $distance * $rotationFactor;

    $angle = intval($angle / $armSeparationDistance) * $armSeparationDistance + $armOffset + $rotation;

    // Convert polar coordinates to 2D cartesian coordinates.
    $starX = cos($angle) * $distance;
    $starY = sin($angle) * $distance;

    $randomOffsetX = RandFloat() * $randomOffsetXY;
    $randomOffsetY = RandFloat() * $randomOffsetXY;

    $starX += $randomOffsetX;
    $starY += $randomOffsetY;

    // Now we can assign xy coords.
    $name = GetRandomName();
    $starType = floor(RandFloat() * 4);
    /*
     * 0 = Red Dwarf
     * 1 = Yellow
     * 2 = Blue
     * 3 = White Dwarf
     */
    $starPositions[$i] = array(
      'x' => $starX,
      'y' => $starY,
      'name' => $name,
      'type' => $starType
    );
}

// save to stars.json
file_put_contents('stars.json', json_encode($starPositions));
?>
