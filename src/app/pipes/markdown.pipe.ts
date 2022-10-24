import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { marked } from "marked";
import sanitizeHTML from "sanitize-html";

type Options = typeof MarkdownPipe.defaultOptions;

@Pipe({
  name: "markdown",
})
export class MarkdownPipe implements PipeTransform {
  static defaultOptions = {
    includeImages: false,
    includeCodeBlockClassNames: false,
    loadingHTML: "<p>Loading...</p>",
    skipSanitization: false,
  };

  constructor(private sanitizer: DomSanitizer) {}

  private sanitizeHTMLWithOptions(rawHTML: string, options: Options): string {
    const allowedTags = options.includeImages
      ? [...sanitizeHTML.defaults.allowedTags, "img"]
      : sanitizeHTML.defaults.allowedTags;
    const allowedClasses: sanitizeHTML.IOptions["allowedClasses"] = options.includeCodeBlockClassNames
      ? { code: ["*"] }
      : {};
    return sanitizeHTML(rawHTML, { allowedTags, allowedClasses });
  }

  transform(rawMarkdown: string, options?: Options) {
    const mergedOptions = Object.assign(MarkdownPipe.defaultOptions, options ?? {});
    return new Promise<string>((resolve, reject) => {
      marked.parse(rawMarkdown, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    }).then((rawHTML) => {
      if (mergedOptions.skipSanitization) {
        return Promise.resolve(rawHTML);
      }
      const sanitizedHTML = this.sanitizeHTMLWithOptions(rawHTML, mergedOptions);
      const bypassedHTML = this.sanitizer.bypassSecurityTrustHtml(sanitizedHTML);
      return Promise.resolve(bypassedHTML);
    });
  }
}
