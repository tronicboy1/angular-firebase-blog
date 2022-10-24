import { MarkdownPipe } from './markdown.pipe';
import { DomSanitizer } from "@angular/platform-browser";

describe('MarkdownPipe', () => {
  it('create an instance', () => {
    const pipe = new MarkdownPipe(DomSanitizer.prototype);
    expect(pipe).toBeTruthy();
  });
});
