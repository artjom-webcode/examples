// ===============================
// Приложение рецептов: Forkify v2
// Файл: recipeApp_commented.js
// Описание: отображает выбранный по hash‑id рецепт,
//           используя публичное API Forkify.
// ===============================

// --- Выбор DOM‑элементов -------------------------------------------
// Контейнер, в который будет рендериться разметка рецепта
const recipeContainer = document.querySelector(".recipe");

// Путь к SVG‑спрайту с иконками (лежит в корне «icons.svg»)
const icons = "icons.svg";

// --- Константы ------------------------------------------------------
// Базовый URL публичного API Forkify (v2)
// Документация: https://forkify-api.herokuapp.com/v2
// -------------------------------------------------------------------

///////////////////////////////////////
// Функция‑утилита: рендеринг спиннера
///////////////////////////////////////
/**
 * Вставляет SVG‑спиннер в *parentEl*, очищая его содержимое.
 * Используется для отображения индикатора загрузки
 * во время асинхронного запроса к API.
 *
 * @param {HTMLElement} parentEl - DOM‑элемент‑контейнер
 */
const renderSpinner = function (parentEl) {
  const markup = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
  `;
  // Сбрасываем текущее содержимое и вставляем спиннер в начало
  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("afterbegin", markup);
};

///////////////////////////////////////
// Основная функция: showRecipe
///////////////////////////////////////
/**
 * Загружает данные рецепта по ID из location.hash и
 * отрисовывает детальную карточку рецепта в DOM.
 * Пошагово:
 *  1. Получаем id из URL (#<id>).
 *  2. Если id отсутствует — выходим.
 *  3. Показываем спиннер в контейнере рецепта.
 *  4. Запрашиваем рецепт по API.
 *  5. Обрабатываем возможные ошибки запроса.
 *  6. Нормализуем пришедшие данные (создаём объект recipe).
 *  7. Генерируем HTML‑разметку рецепта и вставляем в DOM.
 */
const showRecipe = async function () {
  try {
    // 1. id берём из #hash ("#5ed6604591c37cdc054bcd09" → "5ed660..." )
    const id = window.location.hash.slice(1);
    // 2. Guard clause: если hash пустой, ничего не делаем
    if (!id) return;

    // 3. Спиннер загрузки
    renderSpinner(recipeContainer);

    // 4. Fetch‑запрос к API Forkify v2
    const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes/${id}`);
    const data = await res.json();

    // 5. Проверка ответа: если статус не OK, бросаем ошибку
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // 6. Извлекаем и переименовываем нужные поля из ответа API
    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    // Для отладки смотрим, что получилось
    console.log(recipe);

    // 7. Шаблон разметки карточки рецепта (используем template literals)
    const markup = `
        <figure class="recipe__fig">
          <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <!-- Кнопки изменения порций (пока без логики) -->
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${recipe.ingredients
            .map((ing) => {
              /*
               * Для каждого ингредиента создаём элемент списка.
               * Шаблон разбит на строки для читаемости, затем объединяется join("").
               */
              return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity ?? ""}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit ?? ""}</span>
                ${ing.description}
              </div>
            </li>
            `;
            })
            .join("")}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${recipe.publisher}</span>.
            Please check out directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;

    // Очищаем контейнер и вставляем готовую разметку
    recipeContainer.innerHTML = "";
    recipeContainer.insertAdjacentHTML("afterbegin", markup);
  } catch (err) {
    // Если что‑то пошло не так — покажем alert
    alert(err);
  }
};

// --- Обработчики событий ------------------------------------------
// При изменении hash или при первой загрузке страницы
// вызываем showRecipe, чтобы отобразить нужный рецепт
window.addEventListener("hashchange", showRecipe);
window.addEventListener("load", showRecipe);
