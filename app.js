const container = document.getElementById("root");
const ajax = new XMLHttpRequest();
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENTS_URL = "https://api.hnpwa.com/v0/item/@id.json";
const store = {
  // 공유되는 자원
  currentPage: 1,
};

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
} // 요청 보내기

function newsFeed() {
  // 글 목록 화면
  const newsFeed = getData(NEWS_URL); // newsFeed 데이터 받아오기
  const newsList = [];
  let template = `
    <div class="container mx-auto p-4">
      <h1>Hacker News</h1>
      <ul>
        {{__news_feed__}}
      </ul>
      <div>
        <a href="#/page/{{__prev_page__}}">이전 페이지</a>
        <a href="#/page/{{__next_page__}}">다음 페이지</a>
      </div>
    </div>
  `;

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // 한페이지에 10개씩 보여주기
    newsList.push(`
    <li>
      <a href="#/show/${newsFeed[i].id}">
        ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
  `);
  }

  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    store.currentPage > 1 ? store.currentPage - 1 : 1
  );
  template = template.replace(
    "{{__next_page__}}",
    store.currentPage < 3 ? store.currentPage + 1 : store.currentPage
  );

  container.innerHTML = template;
}

function newsDetail() {
  const id = location.hash.substring(7); // 7번째 index부터 사용

  const newsContent = getData(CONTENTS_URL.replace("@id", id));

  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
  `;
}

function router() {
  const routePath = location.hash;

  if (routePath === "") {
    // location.hash에 #만 들어있는 경우 빈문자열을 반환한다.
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    // #/page/라는 값이 존재한다면
    store.currentPage = Number(routePath.substring(7)); // 7번째 index부터 사용
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router); // hash값이 변할때마다 event 호출
router();
