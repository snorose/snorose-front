import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LayoutService {

    public bodyHeight!: string;

    public getMainHeight() {
        this.bodyHeight = `${window.innerHeight - 128}px`;
        return this.bodyHeight;
    }

    public getHeightWithoutHeader() {
        this.bodyHeight = `${window.innerHeight - 60}px`;
        return this.bodyHeight;
    }

}