export class AjaxNavigation {
    parentList;
    container;
    sizeSelector;
    indexSelector;
    constructor(navId, parentList) {
        this.parentList = parentList;
        this.container = document.querySelector(navId);
        this.sizeSelector = this.container.querySelector("[data-role='sizeSelector'");
        this.indexSelector = this.container.querySelector("[data-role='indexSelector']");
    }
    Update() {
    }
}
