const container = document.getElementById("root");
const ajax = new XMLHttpRequest();
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENTS_URL = "https://api.hnpwa.com/v0/item/@id.json";

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
} // 요청 보내기

const newsFeed = getData(NEWS_URL);

const ul = document.createElement("ul");

window.addEventListener("hashchange", function () {
  const id = location.hash.substring(1); // 1번째 index부터 사용

  const newsContent = getData(CONTENTS_URL.replace("@id", id));
  const title = document.createElement("h1");
  title.innerHTML = newsContent.title;

  content.appendChild(title);
});

for (let i = 0; i < newsFeed.length; i++) {
  const div = document.createElement("div");

  div.innerHTML = `
    <li>
      <a href="#${newsFeed[i].id}">
        ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
  `;
  ul.appendChild(div.firstElementChild);
}

container.appendChild(ul);
container.appendChild(content);
