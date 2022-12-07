import { VIRTUAL_SCROLL_STRATEGY } from "@angular/cdk/scrolling"
import { Directive, forwardRef, OnChanges, ElementRef, ChangeDetectorRef, Input, SimpleChanges } from "@angular/core"
import { MobileCalendarStrategy } from "./calendar"

function factory (dir: CustomVirtualScrollDirective) {
    return dir.scrollStrategy
}

@Directive({
    selector: 'cdk-virtual-scroll-viewport[customVirtualScrollStrategy]',
    providers: [{
        provide: VIRTUAL_SCROLL_STRATEGY,
        useFactory: factory,
        deps: [forwardRef(() => CustomVirtualScrollDirective)]
    }],
})
export class CustomVirtualScrollDirective implements OnChanges {
    constructor(private elRef: ElementRef, private cd: ChangeDetectorRef) { }
    @Input() numCols: number = 1;
    @Input() itemHeights: number[] = [];

    scrollStrategy: MobileCalendarStrategy = new MobileCalendarStrategy();
    ngOnChanges(changes: SimpleChanges) {
        if ('itemHeights' in changes) {
            this.scrollStrategy.updateItemHeights(this.itemHeights);
            this.cd.detectChanges();
        }

        if ('numCols' in changes) {
            this.scrollStrategy.updateCols(this.numCols);
            this.cd.detectChanges();
        }
    }
}