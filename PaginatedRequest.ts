export interface PaginatedRequest<T> {
    PageIndex: number;
    PageSize: number;
    TypedRequest: T;
}