const searchForm = document.getElementById("search-form");
const cards = document.getElementById("cards");
const timezone = document.getElementById("timezone");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getRecommendations();
});

function getRecommendations() {
  fetch("./travel_recommendation_api.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const query = document.getElementById("search-query").value;
      const filteredQuery = query.trim().toLowerCase();

      switch (filteredQuery) {
        case "beach":
        case "beaches":
          timezone.classList.add("hidden");
          addCards(data.beaches);
          break;
        case "temple":
        case "temples":
          timezone.classList.add("hidden");
          addCards(data.temples);
          break;
        default:
          let filteredData = [];
          Object.keys(data).forEach((category) => {data[category].forEach((item) => 
            {
              if (category === "countries" && item.name.toLowerCase().includes(filteredQuery)) {
                filteredData = [...filteredData, ...item.cities];
                const options = {timeZone: "Australia/Sydney", hour12: true, hour: "numeric", minute: "numeric", second: "numeric"};
                timezone.classList.remove("hidden");
                const cityTimezone = new Date().toLocaleTimeString("en-US",options);
                timezone.innerText = cityTimezone;
              }
              else if (item.name.toLowerCase().includes(filteredQuery)) {
                filteredData.push(item);
              }
            });
          });
          addCards(filteredData);
          break;
      }
    })
    .catch((error) => {
      console.log(error);
      alert("Something went wrong! Please try again.");
    });
}

function addCards(data) {
  cards.innerHTML = "";
  data.forEach((item) => {
    cards.innerHTML += `
          <div class="card">
              <img src="${item.imageUrl}" alt="${item.name}">
              <h2>${item.name}</h2>
              <p>${item.description}</p>
              <button>Visit</button>
          </div>
        `;
  });
}