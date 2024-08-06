import { Router } from '@angular/router';

export type ParameterMap = { [key: string]: string };
export type QueryMap = { [key: string]: string | undefined };
export type StateMap = { [key: string]: any };

export abstract class SimpleRouteData {
  public get parameters(): ParameterMap {
    return {};
  }

  public get query(): QueryMap {
    return {};
  }

  public get state(): StateMap | undefined {
    return undefined;
  }
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

    return encodeURI(path);
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
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
}
