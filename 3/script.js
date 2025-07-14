// https://forkify-api.jonas.io/

const wrapper = document.querySelector(".wrapper");
const searchForm = document.querySelector(".search-form");
const results = document.querySelector(".results");

const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
  },
};

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const loadind = function (el) {
  const markup = ` <p>Loading</p>`;
  el.insertAdjacentHTML("afterend", markup);
};

const renderError = function (message = "Default error!") {
  const markup = ` 
      <div class="error">
        <h3 class="error__title">There is an error.</h3>
        <p class="error__text">${message}</p>
      </div>
      `;
  wrapper.innerHTML = "";
  wrapper.insertAdjacentHTML("afterend", markup);
};

const getJSON = async function (url, sec) {
  try {
    const res = await Promise.race([fetch(url), timeout(sec)]);
    console.log(res);
    const data = await res.json();
    if (!res.ok) throw new Error(`оооооой ${data.message} (${res.status})`);

    return data;
  } catch (err) {
    // alert(err);
    renderError(err);
  }
};
//https://forkify-api.jonas.io/api/v2/recipes?search=pizza&key=<insert your key>

// getJSON("https://forkify-api.jonas.io/api/v2/recipes/664c8f193e7aa067e94e8297", 10);
// getJSON("https://forkify-api.jonas.io/api/v2/recipes/664c8f193e7aa067e94e8297", 0); // ошибка долго ждать данные
// getJSON("https://forkify-api.jonas.io/api/v2/recipes/664c8f193e7aa067e94e8297zzzz", 10); // ошибка нет такого рецепта

const loadSearchResults = async function () {
  try {
    const query = searchForm.querySelector(".search-form__input").value;
    if (!query) return;
    state.search.query = query;
    loadind(results);
    const data = await getJSON(`https://forkify-api.jonas.io/api/v2/recipes?search=${query}`, 30);

    state.search.results = data.data.recipes.map((rec) => {
      // console.log(rec);
      return {
        id: rec.id,
        title: rec.title,
        publicher: rec.publisher,
        image: rec.image_url,
      };
    });
    resultsView(state.search.results);
  } catch (err) {
    renderError(err);
  }
};

const resultsView = function (data) {
  const markup = data
    .map(
      (item) =>
        ` <li class="results__item">
          <figure class="results__fig">
            <img class="results__img" src="${item.image}" alt="${item.title}" />
          </figure>
          <h3 class="results__title">${item.title}</h3>
          <p class="results__publisher">${item.publicher}</p>
          <a href="#${item.id}" class="results__link">Link</a>
        </li>`
    )
    .join("");
  results.insertAdjacentHTML("afterend", markup);
};

// listeners
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  loadSearchResults();
});
