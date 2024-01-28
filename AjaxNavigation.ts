import { AjaxList } from "./AjaxList.js";

export class AjaxNavigation {
    parentList: AjaxList;
    container: HTMLElement;
    indexSelector: HTMLElement;
    sizeSelector: HTMLSelectElement;

    constructor(navId: string, parentList: AjaxList) {
        this.parentList = parentList;
        this.container = document.querySelector(navId) as HTMLElement;
        this.indexSelector = this.container.querySelector("[data-role='indexSelector']") as HTMLElement;
        this.sizeSelector = this.container.querySelector("[data-role='sizeSelector'") as HTMLSelectElement;
        this.sizeSelector.addEventListener("change", () => {
            this.parentList.form.Search(null, 0);
        });
    }

    get pageIndex() {
        return this.parentList.result?.PageIndex ?? 0;
    }

    get pageSize() {
        return this.sizeSelector.value;
    }

    Update() {
        this.indexSelector.innerHTML = "";

        if (this.parentList.result?.TotalCount == 0) {
            this.indexSelector.classList.add("d-none");
            this.sizeSelector.classList.add("d-none");

            return;
        }

        this.indexSelector.classList.remove("d-none");
        this.sizeSelector.classList.remove("d-none");

        if (this.pageIndex > 0) {
            //Prev
            let prevItem = document.createElement("li");
            prevItem.classList.add("page-item");

            let prevLink = document.createElement("a");
            prevLink.classList.add("page-link");
            prevLink.href = "#";
            prevLink.textContent = "Prev";

            prevItem.appendChild(prevLink);
            prevItem.addEventListener("click", (event) => {
                event.preventDefault();
                this.parentList.form.Search(event, (this.pageIndex - 1));
            });
            this.indexSelector.appendChild(prevItem);

            //PageIndex - 1
            let prevIndexItem = document.createElement("li");
            prevIndexItem.classList.add("page-item");

            let prevIndexLink = document.createElement("a");
            prevIndexLink.classList.add("page-link");
            prevIndexLink.href = "#";
            prevIndexLink.textContent = this.pageIndex.toString();
            
            prevIndexItem.appendChild(prevIndexLink);
            prevIndexItem.addEventListener("click", (event) => {
                event.preventDefault();
                this.parentList.form.Search(event, (this.pageIndex - 1));
            });
            this.indexSelector.appendChild(prevIndexItem);
        }

        //PageIndex
        //PageIndex - 1
        let activeItem = document.createElement("li");
        activeItem.classList.add("page-item", "active");

        let activeLink = document.createElement("a");
        activeLink.classList.add("page-link");
        activeLink.href = "#";
        activeLink.textContent = (this.pageIndex + 1).toString();
        
        activeItem.appendChild(activeLink);
        activeItem.addEventListener("click", (event) => {
            event.preventDefault();
            this.parentList.form.Search(event, this.pageIndex);
        });
        this.indexSelector.appendChild(activeItem);

        if (this.parentList.result?.TotalPages! > (this.pageIndex + 1)) {
            //PageIndex - 1
            let nextIndexItem = document.createElement("li");
            nextIndexItem.classList.add("page-item");

            let nextIndexLink = document.createElement("a");
            nextIndexLink.classList.add("page-link");
            nextIndexLink.href = "#";
            nextIndexLink.textContent = (this.pageIndex + 2).toString();
            
            nextIndexItem.appendChild(nextIndexLink);
            nextIndexItem.addEventListener("click", (event) => {
                event.preventDefault();
                this.parentList.form.Search(event, (this.pageIndex + 1));
            });
            this.indexSelector.appendChild(nextIndexItem);

            //Next
            let nextItem = document.createElement("li");
            nextItem.classList.add("page-item");

            let nextLink = document.createElement("a");
            nextLink.classList.add("page-link");
            nextLink.href = "#";
            nextLink.textContent = "Next";

            nextItem.appendChild(nextLink);
            nextItem.addEventListener("click", (event) => {
                event.preventDefault();
                this.parentList.form.Search(event, (this.pageIndex + 1));
            });
            this.indexSelector.appendChild(nextItem);
        }

        this.sizeSelector.value = this.parentList.result?.PageSize.toString() ?? "5";
    }
}