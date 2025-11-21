import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\BookingLaboratoriumController::index
 * @see app/Http/Controllers/BookingLaboratoriumController.php:95
 * @route '/admin/booking-lab'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/booking-lab',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::index
 * @see app/Http/Controllers/BookingLaboratoriumController.php:95
 * @route '/admin/booking-lab'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::index
 * @see app/Http/Controllers/BookingLaboratoriumController.php:95
 * @route '/admin/booking-lab'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingLaboratoriumController::index
 * @see app/Http/Controllers/BookingLaboratoriumController.php:95
 * @route '/admin/booking-lab'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const bookingLab = {
    index: Object.assign(index, index),
}

export default bookingLab