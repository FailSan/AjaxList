import { AjaxList } from "./AjaxList.js";

export class AjaxNavigation {
    parentList: AjaxList;
    container: HTMLElement;
    sizeSelector: HTMLSelectElement;
    indexSelector: HTMLElement;

    constructor(navId: string, parentList: AjaxList) {
        this.parentList = parentList;
        this.container = document.querySelector(navId) as HTMLElement;
        this.sizeSelector = this.container.querySelector("[data-role='sizeSelector'") as HTMLSelectElement;
        this.indexSelector = this.container.querySelector("[data-role='indexSelector']") as HTMLElement;
    }

    Update() {
        
    }
}