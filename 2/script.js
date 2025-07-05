const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const getJSON = async function (url, sec) {
  try {
    const res = await Promise.race([fetch(url), timeout(sec)]);
    const data = await res.json();
    document.querySelector(".wrapper").insertAdjacentText("beforebegin", JSON.stringify(data));
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    console.log(data);
    return data;
  } catch (err) {
    alert(err);
  }
};

getJSON("https://forkify-api.jonas.io/api/v2/recipes/664c8f193e7aa067e94e8297", 10);
