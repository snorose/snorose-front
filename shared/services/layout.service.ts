import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LayoutService {

    public isShowHeader: boolean = true;
    public bodyHeight!: string;

    public getMainHeight() {
        this.bodyHeight = `${window.innerHeight - 128}px`;
        return this.bodyHeight;
    }

}