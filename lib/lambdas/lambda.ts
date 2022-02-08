import * as path from "path"

export class Lambda {
  readonly yearQueryParam = "method.request.querystring.year"
  readonly monthQueryParam = "method.request.querystring.month"

  handlerPath(dirname: string) {
    return `${path.resolve(__dirname)}/../../src/handlers/${dirname}/handler.ts`
  }
}
