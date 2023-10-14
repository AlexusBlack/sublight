<?php
$star_positions = json_decode(file_get_contents('stars.json'), true);
$star_systems_files = [ 'systems1.csv', 'systems2.csv', 'systems3.csv', 'systems4.csv' ];

function get_csv_headers($row) {
  $headers = [];
  foreach ($row as $idx => $value) {
    $headers[$value] = $idx;
  }
  return $headers;
}

$system_fields = ['primary star type', 'close companion exists?', 'close companion star type', 'distant companion exists?', 'distant companion star type', 'primary name', 'close companion name', 'distant companion name', 'age', 'primary luminosity', 'close companion luminosity', 'distant companion luminosity'];
$non_planet_fields = array_merge(['system index', 'id', 'v2.0.0'], $system_fields);

// csv headers
$systems = array();
$planets = array();
$planet_id = -1;
$system_id = 0;
$file_idx = 0;
$h = [];
$h_keys = [];
foreach ($star_systems_files as $file) {
    $handle = fopen($file, 'r');
    while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
      if($planet_id == -1) {
        $h = get_csv_headers($data);
        $h_keys = array_keys($h);
        $planet_id++;
        continue;
      }

      // Creating star system if it doesn't exist yet
      $system_id = intval(trim($data[$h['system index']])) + $file_idx*250;
      if(!isset($systems[$system_id])) {
        $systems[$system_id] = array();
        foreach($system_fields as $field) {
          $systems[$system_id][$field] = $data[$h[$field]];
        }
        $systems[$system_id]['planets'] = array();
        $systems[$system_id]['position'] = [ 'x' => $star_positions[$system_id]['x'], 'y' => $star_positions[$system_id]['y'] ];
      }

      // Creating planet
      $planet = ['id' => $planet_id];
      foreach($data as $idx => $value) {
        if(!in_array($h_keys[$idx], $non_planet_fields)) {
          $planet[$h_keys[$idx]] = $value;
        }
        $planet['in system id'] = $data[$h['id']];
      }
      $systems[$system_id]['planets'][] = $planet_id;
      $planets[$planet_id] = $planet;

      $planet_id++;
    }
    fclose($handle);
    $file_idx++;
}

// Saving data
file_put_contents('systems.json', json_encode($systems));
file_put_contents('planets.json', json_encode($planets));

// Report
echo 'Systems: ' . count($systems) . PHP_EOL;
echo 'Planets: ' . count($planets) . PHP_EOL;
?>
