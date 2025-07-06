let sites = [];
let fuse;

async function loadSites() {
  const res = await fetch('./sites.json');
  sites = await res.json();

  fuse = new Fuse(sites, {
    keys: ["title", "description", "tags"],
    threshold: 0.4,
    includeMatches: true
  });
}

function searchSites(query) {
  if (!query) return [];  // Return empty array if no input
  return fuse.search(query).map(result => result.item);
}


function highlight(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query})`, "gi");
  return text.replace(re, '<mark>$1</mark>');
}

function showResults(results, query) {
  const resultsList = document.getElementById("results");
  resultsList.innerHTML = "";

  if (results.length === 0) {
    resultsList.innerHTML = "<li>No results found :c</li>";
    return;
  }

  results.forEach(site => {
    const li = document.createElement("li");

    const favicon = site.icon ?
  `<img src="${site.icon}" alt="icon" class="favicon">` :
  "";


    li.innerHTML = `
      <div class="result-entry">
        ${favicon}
        <div class="result-text">
          <a href="${site.url}">${highlight(site.title, query)}</a><br>
          <small>${highlight(site.description, query)}</small><br>
          <small><i>${site.tags.join(', ')}</i></small>
        </div>
      </div>
    `;
    resultsList.appendChild(li);
  });
}


document.addEventListener("DOMContentLoaded", async () => {
  await loadSites();

  const input = document.getElementById("searchInput");

  function updateResults() {
    const query = input.value.trim();
    const results = searchSites(query);
    showResults(results, query);
  }

  input.addEventListener("input", updateResults);
  updateResults();
});
