import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  // selector is [if] so you can use *if="condition"
  selector: '[if]',
  standalone: true
})
export class IfDirective {
  private hasView = false;

  constructor(private vcr: ViewContainerRef, private tpl: TemplateRef<any>) {}

  @Input()
  set if(condition: any) {
    const isTrue = !!condition;
    if (isTrue && !this.hasView) {
      this.vcr.createEmbeddedView(this.tpl);
      this.hasView = true;
    } else if (!isTrue && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }
}
