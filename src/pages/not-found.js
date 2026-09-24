export function render({ outlet }) {
  outlet.innerHTML = `
    <div class="page-404">
      <div class="illustration-404">
        <div class="ill-404-num">404</div>
        <div class="ill-bubble b1"><span class="emoji">🔍</span>Не нашлось</div>
        <div class="ill-bubble b2"><span class="emoji">💸</span>Цены рядом</div>
        <div class="ill-bubble b3"><span class="emoji">📦</span>Товары тут</div>
      </div>

      <h1>Страница улетела в поиск</h1>
      <p class="desc">
        Мы не нашли эту страницу. Возможно, ссылка устарела, товар снят с продажи, или вы опечатались в адресе.
      </p>

      <div class="actions">
        <a href="#/" data-link class="btn btn-primary">← На главную</a>
        <a href="#/tracking" data-link class="btn btn-ghost">Отслеживаемые</a>
      </div>

      <div class="help-grid">
        <a href="#/" data-link class="help-card">
          <div class="icon">🔍</div>
          <h3>Найти товар</h3>
          <p>Введите название — сравним цены в 4 магазинах</p>
        </a>
        <a href="#/tracking" data-link class="help-card">
          <div class="icon">🔔</div>
          <h3>Отслеживаемые</h3>
          <p>Посмотрите товары, за ценой которых вы следите</p>
        </a>
        <a href="#/profile" data-link class="help-card">
          <div class="icon">👤</div>
          <h3>Профиль</h3>
          <p>Настройки уведомлений и история поиска</p>
        </a>
      </div>
    </div>
  `;
}