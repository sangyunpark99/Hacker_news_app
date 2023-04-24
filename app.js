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

function newsFeed() {
  // 글 목록 화면
  const newsFeed = getData(NEWS_URL); // newsFeed 데이터 받아오기ß
  const newsList = [];

  newsList.push("<ul>");

  for (let i = 0; i < newsFeed.length; i++) {
    newsList.push(`
    <li>
      <a href="#${newsFeed[i].id}">
        ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
  `);
  }

  newsList.push("</ul>");
  container.innerHTML = `${newsList.join("")}`;
}

function newsDetail() {
  const id = location.hash.substring(1); // 1번째 index부터 사용

  const newsContent = getData(CONTENTS_URL.replace("@id", id));

  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#">목록으로</a>
    </div>
  `;
}

function router() {
  const routePath = location.hash;
  console.log(routePath);

  if (routePath === "") {
    // location.hash에 #만 들어있는 경우 빈문자열을 반환한다.
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router);
router();
