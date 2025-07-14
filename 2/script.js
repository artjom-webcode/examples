const wrapper = document.querySelector(".wrapper");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
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
    const data = await res.json();
    if (!res.ok) throw new Error(`оооооой ${data.message} (${res.status})`);
    wrapper.insertAdjacentText("beforebegin", JSON.stringify(data));

    console.log(data);
    return data;
  } catch (err) {
    // alert(err);
    renderError(err);
  }
};

getJSON("https://forkify-api.jonas.io/api/v2/recipes/664c8f193e7aa067e94e8297", 10);
// getJSON("https://forkify-api.jonas.io/api/v2/recipes/664c8f193e7aa067e94e8297", 0); // ошибка долго ждать данные
// getJSON("https://forkify-api.jonas.io/api/v2/recipes/664c8f193e7aa067e94e8297zzzz", 10); // ошибка нет такого рецепта
