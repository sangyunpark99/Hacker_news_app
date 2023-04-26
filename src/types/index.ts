import View from "../core/view";

export interface NewsStore {
  getAllFeeds: () => NewsFeed[];
  getFeed: (position: number) => NewsFeed;
  setFeeds: (feeds: NewsFeed[]) => void;
  makeRead: (id: number) => void;
  currentPage: number;
  nextPage: number;
  prevPage: number;
  numberOfFeed: number;
  hasFeed: boolean;
}

// intersection 중복 타입 제거
export interface News {
  // readonly 값 변경 방지
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

export interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean; // optional
}

export interface NewsDetail extends News {
  readonly content: string;
  readonly comments: [];
}

export interface NewsComment extends News {
  readonly comments: [];
  readonly level: number;
}

export interface RouteInfo {
  path: string;
  page: View;
}
