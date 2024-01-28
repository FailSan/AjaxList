import { Entity, RequestType, ResponseType } from "./AjaxEntity.js";
import { PaginatedRequest } from "./PaginatedRequest.js";
import { PaginatedResult } from "./PaginatedResult.js";
import { AnnouncementRequest } from "./AnnouncementRequest.js";
import { ReservationRequest } from "./ReservationRequest.js";
import { AjaxList } from "./AjaxList.js";

export class AjaxForm {
    parentList: AjaxList;
    container: HTMLElement;
    private _searchButton: HTMLButtonElement;
    private _resetButton: HTMLButtonElement;
    private _inputs: Array<HTMLElement> = [];
    private _apiUrl: string;

    constructor(formId: string, parentList: AjaxList) {
        this.container = document.querySelector(formId) as HTMLElement;
        this.parentList = parentList;
        this.inputs = this.container.querySelectorAll("[data-property]") as NodeListOf<HTMLElement>;
        this._searchButton = this.container.querySelector("[data-action='search']") as HTMLButtonElement;
        this._resetButton = this.container.querySelector("[data-action='reset']") as HTMLButtonElement;
        this._apiUrl = this._searchButton.formAction;

        this.Initialize();
        this.Reset(null);
    }
    
    private set inputs(fields: NodeListOf<HTMLElement>) {
        fields.forEach(x => this._inputs.push(x));
    }

    Initialize(): void {
        this._searchButton.addEventListener("click", (event) => {
            this.Search(event);
        });

        this._resetButton.addEventListener("click", (event) => {
            this.Reset(event);
        });

        this._inputs.forEach(field => field.addEventListener("submit", (event) => {
            this.Search(event);
        }))
    }

    Reset(event: Event | null): void {
        this._inputs.forEach(x => {
            if (x instanceof HTMLInputElement)
                (<HTMLInputElement>x).value = "";
            else if (x instanceof HTMLSelectElement)
                (<HTMLSelectElement>x).value = "";
        });
        this.Search(event);
    }

    async Search(event: Event | null) : Promise<void> {
        if (event != null)
            event.preventDefault();

        var pageIndex = 0;
        var pageSize = 5;

        var typedRequest: RequestType;
        var paginatedRequest: PaginatedRequest<RequestType>;

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

        var paginatedResult: PaginatedResult<ResponseType>;

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
            }

        else
            paginatedResult = await serverResponse.json();

        this.parentList.result = paginatedResult;
    }

    BuildAnnouncementRequest() : AnnouncementRequest {
        var titleField = (<HTMLInputElement>this._inputs.find(x => x.dataset.property == "Title"));
        var firstNameField = (<HTMLInputElement>this._inputs.find(x => x.dataset.property == "FirstName"));
        var lastNameField = (<HTMLInputElement>this._inputs.find(x => x.dataset.property == "LastName"));
        var emailField = (<HTMLInputElement>this._inputs.find(x => x.dataset.property == "Email"));
        var typologyField = (<HTMLSelectElement>this._inputs.find(x => x.dataset.property == "Typology"));
        var categoryField = (<HTMLSelectElement>this._inputs.find(x => x.dataset.property == "Category"));
        var beginDateField = (<HTMLInputElement>this._inputs.find(x => x.dataset.property == "BeginDate"));
        var endDateField = (<HTMLInputElement>this._inputs.find(x => x.dataset.property == "EndDate"));
        var publishedBeginDateField = (<HTMLInputElement>this._inputs.find(x => x.dataset.property == "PublishedBeginDate"));
        var publishedEndDateField = (<HTMLInputElement>this._inputs.find(x => x.dataset.property == "PublishedEndDate"));

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

        var announcementRequest = 
        {
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

    BuildReservationRequest() : ReservationRequest {
        var reservationRequest = <ReservationRequest> {

        };

        return reservationRequest;
    }
}