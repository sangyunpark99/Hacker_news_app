type Store = { // type alias
  currentPage:number;
  feeds: NewsFeed[];
}

// intersection 중복 타입 제거
type News = {
  id: number;
  time_ago: string;
  title: string;
  url: string;
  user: string;
  content: string;
};

type NewsFeed = News & {
  comments_count: number;
  points: number;
  read?: boolean; // optional
}

type NewsDetail = News & {
  content: string;
  comments:[];
}

type NewsComment = News & {
  comments: [];
  level: number;
}

const container:HTMLElement | null = document.getElementById("root");
const ajax:XMLHttpRequest = new XMLHttpRequest();
const content:HTMLDivElement = document.createElement("div");
const NEWS_URL:string = "https://api.hnpwa.com/v0/news/1.json";
const CONTENTS_URL:string = "https://api.hnpwa.com/v0/item/@id.json";
const store:Store = {
  currentPage: 1,
  feeds: [],
};

function getData<AjaxResponse>(url:string):AjaxResponse { // Generic
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
} // 요청 보내기

function makeFeed(feeds:NewsFeed[]): NewsFeed[] {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
}

function updateView(html:string): void{
  if(container!=null){
    container.innerHTML = html;
  }else{
    console.error('최상위 컨이너가 존재하지 않아 UI를 진행하지 못합니다');
  }
}

function newsFeed():void {
  // 글 목록 화면
  let newsFeed = store.feeds; // newsFeed 데이터 받아오기
  const newsList = [];
  let template = `
    <div class="bg-gray-600 min-h-screen">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="items-center justify-end">
            <a href="#/page/{{__prev_page__}}" class="text-gray-500">
              Previous
            </a>
            <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
              Next
            </a>
          </div>
        </div> 
      </div>
    </div>
    <div class="p-4 text-2xl text-gray-700">
      {{__news_feed__}}        
    </div>
  </div>
  `;

  if (newsFeed.length == 0) {
    newsFeed = store.feeds = getData<NewsFeed[]>(NEWS_URL);
  }

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // 한페이지에 10개씩 보여주기
    newsList.push(`
    <div class="p-6 ${
      newsFeed[i].read ? "bg-red-500" : "bg-white"
    } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
              newsFeed[i].comments_count
            }</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>  
        </div>
      </div>   
  `);
  }

  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    String(store.currentPage > 1 ? store.currentPage - 1 : 1)
  );
  template = template.replace(
    "{{__next_page__}}",
    String(store.currentPage < 3 ? store.currentPage + 1 : store.currentPage)
  );

  updateView(template);
}

function newsDetail():void{
  const id = location.hash.substring(7); // 7번째 index부터 사용

  const newsContent = getData<NewsDetail>(CONTENTS_URL.replace("@id", id));

  let template = `<div class="bg-gray-600 min-h-screen pb-8">
  <div class="bg-white text-xl">
    <div class="mx-auto px-4">
      <div class="flex justify-between items-center py-6">
        <div class="flex justify-start">
          <h1 class="font-extrabold">Hacker News</h1>
        </div>
        <div class="items-center justify-end">
          <a href="#/page/${store.currentPage}" class="text-gray-500">
            <i class="fa fa-times"></i>
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="h-full border rounded-xl bg-white m-6 p-4 ">
    <h2>${newsContent.title}</h2>
    <div class="text-gray-400 h-20">
      ${newsContent.content}
    </div>

    {{__comments__}}

  </div>
</div>
`;
  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(template.replace("{{__comments__}}",makeComment(newsContent.comments)))
}

function makeComment(comments:NewsComment[]):string {
  const commentString = [];

  for (let i = 0; i < comments.length; i++) {
    const comment:NewsComment = comments[i];

    commentString.push(
      `<div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>   `
    );

    if (comment.comments.length > 0) {
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join("");
}

function router() : void{
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
