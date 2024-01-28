export interface ReservationRequest {
    OfferId: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Typology: string;
    Day: Date | null;
    Hour: string;
}