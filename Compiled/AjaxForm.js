import { Entity } from "./AjaxEntity.js";
export class AjaxForm {
    parentList;
    container;
    _searchButton;
    _resetButton;
    _inputs = [];
    _apiUrl;
    constructor(formId, parentList) {
        this.container = document.querySelector(formId);
        this.parentList = parentList;
        this.inputs = this.container.querySelectorAll("[data-property]");
        this._searchButton = this.container.querySelector("[data-action='search']");
        this._resetButton = this.container.querySelector("[data-action='reset']");
        this._apiUrl = this._searchButton.formAction;
        this.Initialize();
    }
    set inputs(fields) {
        fields.forEach(x => this._inputs.push(x));
    }
    Initialize() {
        this._searchButton.addEventListener("click", (event) => {
            this.Search(event, null);
        });
        this._resetButton.addEventListener("click", (event) => {
            this.Reset(event);
        });
        this._inputs.forEach(field => field.addEventListener("submit", (event) => {
            this.Search(event, null);
        }));
    }
    Reset(event) {
        this._inputs.forEach(x => {
            if (x instanceof HTMLInputElement)
                x.value = "";
            else if (x instanceof HTMLSelectElement)
                x.value = "";
        });
        this.Search(event, 0);
    }
    async Search(event, pageIndex) {
        if (event != null)
            event.preventDefault();
        pageIndex = pageIndex ?? 0;
        var pageSize = Number.parseInt(this.parentList.navigation.pageSize) ?? 5;
        var typedRequest;
        var paginatedRequest;
        if (this.parentList.entity == Entity.Announcement) {
            typedRequest = this.BuildAnnouncementRequest();
        }
        else {
            typedRequest = this.BuildReservationRequest();
        }
        paginatedRequest = {
            TypedRequest: typedRequest,
            PageIndex: pageIndex,
            PageSize: pageSize
        };
        var paginatedResult;
        var serverResponse = await fetch(this._apiUrl, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(paginatedRequest)
        });
        if (!serverResponse.ok)
            paginatedResult = {
                PageIndex: 0,
                PageSize: 0,
                TotalCount: 0,
                TotalPages: 0,
                Items: []
            };
        else
            paginatedResult = await serverResponse.json();
        this.parentList.result = paginatedResult;
    }
    BuildAnnouncementRequest() {
        var titleField = this._inputs.find(x => x.dataset.property == "Title");
        var firstNameField = this._inputs.find(x => x.dataset.property == "FirstName");
        var lastNameField = this._inputs.find(x => x.dataset.property == "LastName");
        var emailField = this._inputs.find(x => x.dataset.property == "Email");
        var typologyField = this._inputs.find(x => x.dataset.property == "Typology");
        var categoryField = this._inputs.find(x => x.dataset.property == "Category");
        var beginDateField = this._inputs.find(x => x.dataset.property == "BeginDate");
        var endDateField = this._inputs.find(x => x.dataset.property == "EndDate");
        var publishedBeginDateField = this._inputs.find(x => x.dataset.property == "PublishedBeginDate");
        var publishedEndDateField = this._inputs.find(x => x.dataset.property == "PublishedEndDate");
        var title = titleField ? titleField.value : "";
        var firstName = firstNameField ? firstNameField.value : "";
        var lastName = lastNameField ? lastNameField.value : "";
        var email = emailField ? emailField.value : "";
        var typology = typologyField ? typologyField.value : "";
        var category = categoryField ? categoryField.value : "";
        var beginDate = beginDateField ? beginDateField.value : "";
        var endDate = endDateField ? endDateField.value : "";
        var publishedBeginDate = publishedBeginDateField ? publishedBeginDateField.value : "";
        var publishedEndDate = publishedEndDateField ? publishedEndDateField.value : "";
        var announcementRequest = {
            Title: title,
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Typology: typology,
            Category: category,
            BeginDate: beginDate == "" ? null : new Date(beginDate),
            EndDate: endDate == "" ? null : new Date(endDate),
            PublishedBeginDate: publishedBeginDate == "" ? null : new Date(publishedBeginDate),
            PublishedEndDate: publishedEndDate == "" ? null : new Date(publishedEndDate)
        };
        return announcementRequest;
    }
    BuildReservationRequest() {
        var reservationRequest = {};
        return reservationRequest;
    }
}
