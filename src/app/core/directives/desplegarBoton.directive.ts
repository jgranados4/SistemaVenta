import {
  Directive,
  ElementRef,
  inject,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';

@Directive({
  selector: '[appDesplegarBoton]',
  standalone: true,
  host: {
    '(click)': 'toggleDropdown($event)',
  },
})
export class DesplegarBotonDirective {
  private el = inject(ElementRef);
  private render = inject(Renderer2);
  private isOpen = signal<boolean>(false);

  toggleDropdown(event: Event) {
    const clickedInside = this.el.nativeElement.contains(event.target);
    const dropdownMenu = document.querySelector('#dropdown-user');
    console.log('clcik', clickedInside);
    console.log('classcik', dropdownMenu);
    if (clickedInside) {
      this.isOpen.set(!this.isOpen());
    } else {
      this.isOpen.set(false);
    }

    if (dropdownMenu) {
      if (this.isOpen()) {
        dropdownMenu.classList.remove('hidden');
      } else {
        dropdownMenu.classList.add('hidden');
      }
    }
  }
}
