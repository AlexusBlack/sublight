<section class="planet-info__box modal__box modal--hidden">
  <div class="planet-info modal">
    <div class="modal__info">
      <h2 class="modal__title">Planet Info</h2>
      <button class="system-info__close modal__close-btn">X</button>
    </div>
    <div class="modal__content">
      <section class="tabs" data-active-tab="1">
        <div class="tabs__buttons">
          <button class="planet-info__geo-tab-btn tabs__button tabs__button--active">Geology</button>
          <button class="planet-info__factions-tab-btn tabs__button">Factions</button>
          <button class="planet-info__history-tab-btn tabs__button">History</button>
        </div>
        <div class="tabs__items">
          <article class="planet-info__geo-tab tabs__item tabs__item--active">
            <div class="grid" style="--cols: 8fr 4fr;">
              <div class="planet-info__left">
                <div class="planet-info__image"></div>
                <div class="planet-info__geo-description">
                  Planet description here
                </div>
              </div>
              <ul class="planet-info__right planet-info__geo-attributes">
                <li class="planet-info__field" data-name="Size" data-unit="Earths">0.00016</li>
              </ul>
            </div>
          </article>
          <article class="planet-info__factions-tab tabs__item">
            <div class="planet-info__factions-chart-box"></div>
          </article>
          <article class="planet-info__history-tab tabs__item"></article>
        </div>
      </section>
    </div>
  </div>
</section>

