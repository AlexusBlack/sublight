<link rel="stylesheet" href="/styles/_all.css" />

<?php
//$stars = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/stars.json'), true);
$systems = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/systems.json'), true);
?>
<section class="starmap" style="--w: 22; --h: 22;">
  <div class="starmap__body">
    <?php foreach($systems as $idx => $system): ?>
    <div class="starmap__object starmap__star" style="--x: <?php echo $system['position']['x'] * 10 ?>; --y: <?php echo $system['position']['y'] * 10 ?>;" data-system-id="<?php echo $idx ?>"  data-type="star" data-name="<?php echo $system['primary name'] ?>" data-x="<?php echo $system['position']['x'] * 10 ?>" data-y="<?php echo $system['position']['y'] * 10 ?>">
        <div class="starmap__star-body" data-star-type="<?php echo $system['primary star type'] ?>"></div>
        <?php if($system['close companion exists?'] == 'true'): ?>
          <div class="starmap__star-body starmap__star-body--close" data-star-type="<?php echo $system['close companion star type'] ?>"></div>
        <?php endif; ?>
        <?php if($system['distant companion exists?'] == 'true'): ?>
          <div class="starmap__star-body starmap__star-body--distant" data-star-type="<?php echo $system['distant companion star type'] ?>"></div>
        <?php endif; ?>
        <label class="starmap__star-name"><?php echo $system['primary name'] ?></label>
        <div class="starmap__spaceships"></div>
      </div>
    <?php endforeach; ?>
    <?php /*
    <div class="starmap__object starmap__star starmap__star--settled" style="--x: 6; --y: 6;" id="target" data-system-id="1000" data-type="star" data-year="1977"  data-population="4200" data-name="Sol" data-x="6" data-y="6">
      <div class="starmap__star-body" data-star-type="2"></div>
      <label class="starmap__star-name">Sol</label>
      <div class="starmap__spaceships"></div>
    </div>
    */ ?>

  </div>
</section>

<?php include($_SERVER['DOCUMENT_ROOT'] . '/parts/resources-bar.php') ?>
<?php include($_SERVER['DOCUMENT_ROOT'] . '/parts/starmap-info.php') ?>
<?php include($_SERVER['DOCUMENT_ROOT'] . '/parts/system-info.php') ?>
<?php include($_SERVER['DOCUMENT_ROOT'] . '/parts/planet-info.php') ?>

<script src="/vendor/chart.min.js"></script>
<script src="/vendor/random.js"></script>

<script src="/scripts/defines.js"></script>
<script src="/scripts/class/Utils.js"></script>
<script src="/scripts/class/Ethics.js"></script>
<script src="/scripts/class/Time.js"></script>

<script src="/scripts/class/Events.js"></script>
<script src="/scripts/events/economic_events.js"></script>
<script src="/scripts/events/culture_events.js"></script>
<script src="/scripts/events/political_events.js"></script>
<script src="/scripts/events/diplomatic_events.js"></script>
<script src="/scripts/class/Modifiers.js"></script>
<script src="/scripts/modifiers/economic_modifiers.js"></script>
<script src="/scripts/modifiers/culture_modifiers.js"></script>
<script src="/scripts/modifiers/political_modifiers.js"></script>


<script src="/scripts/class/Ship.js"></script>
<script src="/scripts/class/Player.js"></script>
<script src="/scripts/class/Faction.js"></script>
<script src="/scripts/class/Planet.js"></script>
<script src="/scripts/class/Galaxy.js"></script>
<script src="/scripts/modal.js"></script>
<script src="/scripts/tabs.js"></script>
<script src="/scripts/starmap.js"></script>
<script src="/scripts/starmap__info.js"></script>
<script src="/scripts/resources.js"></script>
<script src="/scripts/system-info.js"></script>
<script src="/scripts/planet-info.js"></script>
