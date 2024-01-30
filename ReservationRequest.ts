export interface ReservationRequest {
    OfferId: number | null;
    ReservedByName: string;
    ReservedBySurname: string;
    ReservedByEmail: string;
    Category: string;
    Typology: string;
    ReservedDate: Date | null;
    ReservedStartingTime: string | null;
}