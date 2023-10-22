<section class="planet-info__box modal__box modal--hidden">
  <div class="planet-info modal">
    <div class="modal__info">
      <h2 class="modal__title">Planet Info</h2>
      <button class="system-info__close modal__close-btn">X</button>
    </div>
    <div class="modal__content">
      <section class="tabs" data-active-tab="1">
        <div class="tabs__buttons">
          <button class="tabs__button tabs__button--active">Geology</button>
          <button class="tabs__button">Factions</button>
        </div>
        <div class="tabs__items">
          <article class="tabs__item tabs__item--active">
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
          <article class="tabs__item">
            Planet factions overview
          </article>
        </div>
      </section>
    </div>
  </div>
</section>

