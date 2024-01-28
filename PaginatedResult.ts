export interface PaginatedResult<T> {
    Items: Array<T>;
    PageIndex: number;
    PageSize: number;
    TotalPages: number;
    TotalCount: number;
}