import { Directive, ElementRef, Renderer2, Input, HostListener } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})

export class DropdownDirective{
    className: string =  'open'

    constructor(private element: ElementRef, private renderer: Renderer2) {}

    @HostListener('click') onClick(eventData: Event) {        
        if (!this.element.nativeElement.classList.contains(this.className)) {
            this.renderer.addClass(this.element.nativeElement, this.className)
        }
        else{
            this.renderer.removeClass(this.element.nativeElement, this.className)
        }
    }
}