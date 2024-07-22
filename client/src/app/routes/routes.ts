import { Router } from '@angular/router';

export abstract class SimpleRouteData {
  public parameters: { [key: string]: string } = {};
  public query: { [key: string]: string } = {};
  public state?: { [key: string]: any };
}

export abstract class BaseRoute {
  constructor(private readonly segment: string) {}

  public path(): string {
    return this.segment;
  }

  protected generateFullPath(): string {
    const path = this.isChildRoute()
      ? `${this.parent.fullPath()}/${this.path()}`
      : this.path();

    if (path.startsWith('/')) {
      return path;
    }

    return `/${path}`;
  }

  private isChildRoute(): this is ChildRoute<SimpleRoute> {
    return 'parent' in this;
  }
}

export class SimpleRoute extends BaseRoute {
  constructor(segment: string) {
    super(segment);
  }

  public go(router: Router): void {
    router.navigateByUrl(this.generateFullPath());
  }

  public fullPath(): string {
    return this.generateFullPath();
  }
}

export interface ChildRoute<T extends SimpleRoute> {
  parent: T;
}

export class SimpleDataRoute<T extends SimpleRouteData> extends BaseRoute {
  constructor(segment: string) {
    super(segment);
  }

  public go(router: Router, data: T): void {
    router.navigateByUrl(this.fullPath(data), {
      state: data.state,
    });
  }

  public fullPath(data: T): string {
    let path = this.generateFullPath();
    path = this.injectParameters(path, data);
    path = this.appendQuery(path, data);

    return path;
  }

  private injectParameters(path: string, data: T): string {
    for (const [key, value] of Object.entries(data.parameters)) {
      path = path.replaceAll(`:${key}`, value);
    }

    return path;
  }

  private appendQuery(path: string, data: T): string {
    const query = this.buildQuery(data);

    if (query) {
      return `${path}?${query}`;
    }

    return path;
  }

  private buildQuery(data: T): string | null {
    return Object.entries(data.query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
}
