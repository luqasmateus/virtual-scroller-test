import { CdkVirtualScrollViewport, VirtualScrollStrategy } from "@angular/cdk/scrolling";
import { Inject, Injectable } from "@angular/core";
import { distinctUntilChanged, Subject } from "rxjs";

const BUFFER = 500;
type item = { size: number, acc: number }[]

@Injectable({ providedIn: 'root' })
export class MobileCalendarStrategy implements VirtualScrollStrategy {
    private index$ = new Subject<number>();

    private viewport: CdkVirtualScrollViewport | null = null;

    scrolledIndexChange = this.index$.pipe(distinctUntilChanged());

    calculatedHeights: item;
    heights: number[];
    numCols = 1;

    constructor() { }

    attach(viewport: CdkVirtualScrollViewport): void {
        this.viewport = viewport;
        this.updateTotalContentSize();
    }

    detach(): void {
        this.index$.complete();
        this.viewport = null;
    }

    onContentScrolled(): void {
        this.updateRenderedRange();
    }

    onDataLengthChanged(): void {
        //throw new Error("Method not implemented.");
    }

    onContentRendered(): void {
        //throw new Error("Method not implemented.");
    }

    onRenderedOffsetChanged(): void {
        //throw new Error("Method not implemented.");
    }

    scrollToIndex(index: number, behavior: ScrollBehavior): void {
        if (!this.viewport) return;

        this.viewport.scrollToOffset(this.getOffsetForIndex(index, this.viewport), behavior)
    }

    updateRenderedRange() {
        if (!this.viewport) return;

        const offset = this.viewport.measureScrollOffset();
        const { start, end } = this.viewport.getRenderedRange();
        const viewportSize = this.viewport.getViewportSize();
        const dataLength = this.viewport.getDataLength();
        const newRange = { start, end };
        const firstVisibleIndex = this.getIndexForOffset(offset);
        const startBuffer = offset - this.getOffsetForIndex(start, this.viewport);

        if (startBuffer < BUFFER && start !== 0) {
            newRange.start = Math.max(0, this.getIndexForOffset(offset - BUFFER * 2));
            newRange.end = Math.min(
                dataLength,
                this.getIndexForOffset(offset + viewportSize + BUFFER)
            );
        } else {
            const endBuffer = this.getOffsetForIndex(end, this.viewport) - offset - viewportSize;

            if (endBuffer < BUFFER && end !== dataLength) {
                newRange.start = Math.max(0, this.getIndexForOffset(offset - BUFFER));
                newRange.end = Math.min(
                    dataLength,
                    this.getIndexForOffset(offset + viewportSize + BUFFER * 2)
                );
            }
        }

        this.viewport.setRenderedRange(newRange);
        this.viewport.setRenderedContentOffset(this.getOffsetForIndex(newRange.start, this.viewport));
        this.index$.next(firstVisibleIndex);
    }

    getIndexForOffset(offset: number): number {
        return this.calculatedHeights.findIndex(height => {
            return height.acc == offset;
        });
    }

    getOffsetForIndex(index: number, viewport: CdkVirtualScrollViewport): number {
        if (!this.calculatedHeights[index]) return viewport.measureScrollOffset();

        return this.calculatedHeights[index].acc;
    }

    mapItemHeights(heights: number[]) {
        let acc = 0;
        
        if (this.numCols == 1) {
            let item;
            this.calculatedHeights = heights.map((size) => {
                item = { size, acc };
                acc += size;
                return item;
            });
        } else {
            let max = 0;
            this.calculatedHeights = heights.map((size, i) => {
                if (i % this.numCols == 0 && i > 0) {
                    acc += max;
                    max = 0;
                }
                max = Math.max(max, size);
                return { size, acc };
            });
        }
        console.log(this.heights);
        console.log(this.calculatedHeights);
    }

    updateItemHeights(heights: number[]) {
        this.heights = heights;
        this.updateTotalContentSize();
    }

    updateCols(numCols: number) {
        this.numCols = numCols;
        this.updateTotalContentSize();
    }

    updateTotalContentSize() {
        this.mapItemHeights(this.heights);
        this.viewport?.setTotalContentSize(this.getTotalContentSize());
    }

    getTotalContentSize() {
        return this.calculatedHeights[this.calculatedHeights.length - 1].acc;
    }
}