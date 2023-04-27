import { NewsFeed, NewsDetail } from "../types";

export class Api {
  ajax: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  getRequest<AjaxResponse>(cb: (data: AjaxResponse) => void): AjaxResponse {
    this.ajax.open("GET", this.url);
    this.ajax.addEventListener("load", () => {
      cb(JSON.parse(this.ajax.response) as AjaxResponse);
    });
    this.ajax.send();

    return JSON.parse(this.ajax.response);
  }
}

export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getData(cb: (data: NewsFeed[]) => void): NewsFeed[] {
    return this.getRequest<NewsFeed[]>(cb);
  }
}

export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getData(cb: (data: NewsDetail) => void): NewsDetail {
    return this.getRequest<NewsDetail>(cb);
  }
}
