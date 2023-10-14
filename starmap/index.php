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
    <div class="starmap__object starmap__star starmap__star--settled" style="--x: 6; --y: 6;" id="target" data-type="star" data-year="1977"  data-population="4200" data-name="Sol" data-x="6" data-y="6">
      <div class="starmap__star-body" data-star-type="2"></div>
      <label class="starmap__star-name">Sol</label>
      <div class="starmap__spaceships"></div>
    </div>

  </div>
</section>

<section class="resources starmap__resources">
  <div class="resources__item" data-name="Month" style="min-width: 120px;">January</div>
  <div class="resources__item" data-name="Year">1977</div>
  <div class="resources__item" data-name="UVR" data-change="5">1000</div>
</section>

<section class="starmap-info">
  <div class="starmap-info__field" data-title="Type">Star</div>
  <div class="starmap-info__field" data-title="Name">Sol</div>
  <div class="starmap-info__field" data-title="Distance">0.00 LY</div>
  <div class="starmap-info__field" data-title="Year">1977</div>
  <div class="starmap-info__field" data-title="Population">4,200 mil</div>
</section>

<section class="system-info__box system-info--hidden">
  <div class="system-info">
    <button class="system-info__close">X</button>
    <ul class="system-info__list">
      <li class="system-info__item">
        <article class="system-info__item-line">
          <div class="system-info__field" data-title="Type">Star</div>
          <div class="system-info__field" data-title="Name">Sol</div>
        </article>
        <ul class="system-info__list">
          <li class="system-info__item">
            <article class="system-info__item-line">
              <div class="system-info__field" data-title="Type">Planet</div>
              <div class="system-info__field" data-title="Name">Mercury</div>
            </article>
          </li>
          <li class="system-info__item">
            <article class="system-info__item-line">
              <div class="system-info__field" data-title="Type">Planet</div>
              <div class="system-info__field" data-title="Name">Venus</div>
            </article>
          </li>
          <li class="system-info__item">
            <article class="system-info__item-line">
              <div class="system-info__field" data-title="Type">Planet</div>
              <div class="system-info__field" data-title="Name">Earth</div>
              <div class="system-info__field" data-title="Population">4,200 mil</div>
            </article>
            <ul class="system-info__list">
              <li class="system-info__item">
                <article class="system-info__item-line">
                  <div class="system-info__field" data-title="Type">Moon</div>
                  <div class="system-info__field" data-title="Name">Luna</div>
                </article>
              </li>
            </ul>
          </li>
      </li>
    </ul>
  </div>
</section>

<script src="/scripts/defines.js"></script>
<script src="/scripts/class/Utils.js"></script>
<script src="/scripts/class/Time.js"></script>
<script src="/scripts/class/Ship.js"></script>
<script src="/scripts/class/Player.js"></script>
<script src="/scripts/class/Galaxy.js"></script>
<script src="/scripts/starmap.js"></script>
<script src="/scripts/starmap__info.js"></script>
<script src="/scripts/resources.js"></script>
<script src="/scripts/system-info.js"></script>
