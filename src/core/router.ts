import { RouteInfo } from "../types";
import View from "./view";

export default class Router {
  routeTable: RouteInfo[];
  defaultRoute: RouteInfo | null;

  constructor() {
    window.addEventListener("hashchange", this.route.bind(this)); // hash값이 변할때마다 event 호출

    this.defaultRoute = null;
    this.routeTable = [];
  }

  setDefaultPage(page: View): void {
    this.defaultRoute = { path: "", page };
  }

  addRoutePath(path: string, page: View): void {
    this.routeTable.push({
      path,
      page,
    });
  }

  route() {
    const routePath = location.hash;

    if (routePath === "" && this.defaultRoute) {
      this.defaultRoute.page.render();
    }

    for (const routeInfo of this.routeTable) {
      if (routePath.indexOf(routeInfo.path) >= 0) {
        routeInfo.page.render();
        break;
      }
    }
  }
}
