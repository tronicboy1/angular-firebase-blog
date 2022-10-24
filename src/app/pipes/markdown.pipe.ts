import { Pipe, PipeTransform } from "@angular/core";
import { marked } from "marked";

@Pipe({
  name: "markdown",
})
export class MarkdownPipe implements PipeTransform {
  /**
   * This Pipe requires the use of AsyncPipe operator, async.
   *
   * @example
   * <div [innerHTML]="`# Title` | markdown | async">
   */
  transform(rawMarkdown: string) {
    return new Promise<string>((resolve, reject) => {
      marked.parse(rawMarkdown, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
