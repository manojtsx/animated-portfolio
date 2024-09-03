setInterval(() => {
  fetch(
    "https://sgp1.blynk.cloud/external/api/get?token=-Suu9pGlY3Kw9uNTWdM726riQP9Ww_jn&v0"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data === -1) {
        document.getElementById("garbageLevel").innerText =
          "The dustbin lid is open";
        document.getElementById("garbageLevel").style.backgroundColor = "yellow";
        return;
      } else if (data > 28) {
        document.getElementById("garbageLevel").innerText =
          "The dustbin lid may be open";
        document.getElementById("garbageLevel").style.backgroundColor = "orange";
        return;
      }

      const garbageLevel = data
        ? (((23 - data) * 100) / 23).toFixed(2)
        : "N/A";

      if (garbageLevel > 100) {
        document.getElementById("garbageLevel").innerText =
          `Garbage Level: 100 %`;
      } else if (garbageLevel < 0) {
        document.getElementById("garbageLevel").innerText =
          `Garbage Level: 0 %`;
      } else {
        if (garbageLevel > 80) {
          document.getElementById("garbageLevel").style.backgroundColor = "red";
        } else {
          document.getElementById("garbageLevel").style.backgroundColor = "white";
        }
        document.getElementById("garbageLevel").innerText =
          `Garbage Level: ${garbageLevel} %`;
      }
    })
    .catch((error) => {
      console.error("Error fetching garbage level:", error);
      document.getElementById("garbageLevel").innerText = "Error fetching data";
    });
}, 1000);

const btn = document.querySelector("#btn");
btn.addEventListener("click", () => {
  if (btn.innerText === "Open") {
    btn.innerText = "Close";
    btn.classList.remove("open");
    btn.classList.add("close");
  } else {
    btn.innerText = "Open";
    btn.classList.remove("close");
    btn.classList.add("open");
  }
});
