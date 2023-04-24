import { NewsFeed, NewsDetail } from "../types";

export class Api {
  ajax: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    this.url = url;
    this.ajax = new XMLHttpRequest();
  }

  getRequest<AjaxResponse>(): AjaxResponse {
    this.ajax.open("GET", this.url, false);
    this.ajax.send();

    return JSON.parse(this.ajax.response);
  }
}

export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>();
  }
}

export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getData(id: string): NewsDetail {
    return this.getRequest<NewsDetail>();
  }
}
