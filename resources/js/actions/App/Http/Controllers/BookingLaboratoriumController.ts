import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BookingLaboratoriumController::calendar
 * @see app/Http/Controllers/BookingLaboratoriumController.php:641
 * @route '/booking-lab'
 */
const calendarf17312bc2db323336ddfe3a3d8e69929 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendarf17312bc2db323336ddfe3a3d8e69929.url(options),
    method: 'get',
})

calendarf17312bc2db323336ddfe3a3d8e69929.definition = {
    methods: ["get","head"],
    url: '/booking-lab',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::calendar
 * @see app/Http/Controllers/BookingLaboratoriumController.php:641
 * @route '/booking-lab'
 */
calendarf17312bc2db323336ddfe3a3d8e69929.url = (options?: RouteQueryOptions) => {
    return calendarf17312bc2db323336ddfe3a3d8e69929.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::calendar
 * @see app/Http/Controllers/BookingLaboratoriumController.php:641
 * @route '/booking-lab'
 */
calendarf17312bc2db323336ddfe3a3d8e69929.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendarf17312bc2db323336ddfe3a3d8e69929.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingLaboratoriumController::calendar
 * @see app/Http/Controllers/BookingLaboratoriumController.php:641
 * @route '/booking-lab'
 */
calendarf17312bc2db323336ddfe3a3d8e69929.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendarf17312bc2db323336ddfe3a3d8e69929.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BookingLaboratoriumController::calendar
 * @see app/Http/Controllers/BookingLaboratoriumController.php:641
 * @route '/booking-lab/calendar'
 */
const calendar67d5a9ae8568ce7ef905dff1180107d3 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar67d5a9ae8568ce7ef905dff1180107d3.url(options),
    method: 'get',
})

calendar67d5a9ae8568ce7ef905dff1180107d3.definition = {
    methods: ["get","head"],
    url: '/booking-lab/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::calendar
 * @see app/Http/Controllers/BookingLaboratoriumController.php:641
 * @route '/booking-lab/calendar'
 */
calendar67d5a9ae8568ce7ef905dff1180107d3.url = (options?: RouteQueryOptions) => {
    return calendar67d5a9ae8568ce7ef905dff1180107d3.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::calendar
 * @see app/Http/Controllers/BookingLaboratoriumController.php:641
 * @route '/booking-lab/calendar'
 */
calendar67d5a9ae8568ce7ef905dff1180107d3.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar67d5a9ae8568ce7ef905dff1180107d3.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingLaboratoriumController::calendar
 * @see app/Http/Controllers/BookingLaboratoriumController.php:641
 * @route '/booking-lab/calendar'
 */
calendar67d5a9ae8568ce7ef905dff1180107d3.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendar67d5a9ae8568ce7ef905dff1180107d3.url(options),
    method: 'head',
})

export const calendar = {
    '/booking-lab': calendarf17312bc2db323336ddfe3a3d8e69929,
    '/booking-lab/calendar': calendar67d5a9ae8568ce7ef905dff1180107d3,
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::index
 * @see app/Http/Controllers/BookingLaboratoriumController.php:17
 * @route '/booking-lab/requests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/booking-lab/requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::index
 * @see app/Http/Controllers/BookingLaboratoriumController.php:17
 * @route '/booking-lab/requests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::index
 * @see app/Http/Controllers/BookingLaboratoriumController.php:17
 * @route '/booking-lab/requests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingLaboratoriumController::index
 * @see app/Http/Controllers/BookingLaboratoriumController.php:17
 * @route '/booking-lab/requests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::create
 * @see app/Http/Controllers/BookingLaboratoriumController.php:163
 * @route '/booking-lab/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/booking-lab/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::create
 * @see app/Http/Controllers/BookingLaboratoriumController.php:163
 * @route '/booking-lab/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::create
 * @see app/Http/Controllers/BookingLaboratoriumController.php:163
 * @route '/booking-lab/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingLaboratoriumController::create
 * @see app/Http/Controllers/BookingLaboratoriumController.php:163
 * @route '/booking-lab/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::store
 * @see app/Http/Controllers/BookingLaboratoriumController.php:301
 * @route '/booking-lab'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/booking-lab',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::store
 * @see app/Http/Controllers/BookingLaboratoriumController.php:301
 * @route '/booking-lab'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::store
 * @see app/Http/Controllers/BookingLaboratoriumController.php:301
 * @route '/booking-lab'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::checkAvailability
 * @see app/Http/Controllers/BookingLaboratoriumController.php:203
 * @route '/booking-lab/check-availability'
 */
export const checkAvailability = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkAvailability.url(options),
    method: 'post',
})

checkAvailability.definition = {
    methods: ["post"],
    url: '/booking-lab/check-availability',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::checkAvailability
 * @see app/Http/Controllers/BookingLaboratoriumController.php:203
 * @route '/booking-lab/check-availability'
 */
checkAvailability.url = (options?: RouteQueryOptions) => {
    return checkAvailability.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::checkAvailability
 * @see app/Http/Controllers/BookingLaboratoriumController.php:203
 * @route '/booking-lab/check-availability'
 */
checkAvailability.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkAvailability.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::cancel
 * @see app/Http/Controllers/BookingLaboratoriumController.php:573
 * @route '/booking-lab/{bookingLab}/cancel'
 */
export const cancel = (args: { bookingLab: number | { id: number } } | [bookingLab: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/booking-lab/{bookingLab}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::cancel
 * @see app/Http/Controllers/BookingLaboratoriumController.php:573
 * @route '/booking-lab/{bookingLab}/cancel'
 */
cancel.url = (args: { bookingLab: number | { id: number } } | [bookingLab: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bookingLab: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bookingLab: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bookingLab: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bookingLab: typeof args.bookingLab === 'object'
                ? args.bookingLab.id
                : args.bookingLab,
                }

    return cancel.definition.url
            .replace('{bookingLab}', parsedArgs.bookingLab.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::cancel
 * @see app/Http/Controllers/BookingLaboratoriumController.php:573
 * @route '/booking-lab/{bookingLab}/cancel'
 */
cancel.post = (args: { bookingLab: number | { id: number } } | [bookingLab: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::adminIndex
 * @see app/Http/Controllers/BookingLaboratoriumController.php:95
 * @route '/admin/booking-lab'
 */
export const adminIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adminIndex.url(options),
    method: 'get',
})

adminIndex.definition = {
    methods: ["get","head"],
    url: '/admin/booking-lab',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::adminIndex
 * @see app/Http/Controllers/BookingLaboratoriumController.php:95
 * @route '/admin/booking-lab'
 */
adminIndex.url = (options?: RouteQueryOptions) => {
    return adminIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::adminIndex
 * @see app/Http/Controllers/BookingLaboratoriumController.php:95
 * @route '/admin/booking-lab'
 */
adminIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adminIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingLaboratoriumController::adminIndex
 * @see app/Http/Controllers/BookingLaboratoriumController.php:95
 * @route '/admin/booking-lab'
 */
adminIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: adminIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::approve
 * @see app/Http/Controllers/BookingLaboratoriumController.php:521
 * @route '/booking-lab/{bookingLab}/approve'
 */
export const approve = (args: { bookingLab: number | { id: number } } | [bookingLab: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/booking-lab/{bookingLab}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::approve
 * @see app/Http/Controllers/BookingLaboratoriumController.php:521
 * @route '/booking-lab/{bookingLab}/approve'
 */
approve.url = (args: { bookingLab: number | { id: number } } | [bookingLab: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bookingLab: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bookingLab: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bookingLab: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bookingLab: typeof args.bookingLab === 'object'
                ? args.bookingLab.id
                : args.bookingLab,
                }

    return approve.definition.url
            .replace('{bookingLab}', parsedArgs.bookingLab.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::approve
 * @see app/Http/Controllers/BookingLaboratoriumController.php:521
 * @route '/booking-lab/{bookingLab}/approve'
 */
approve.post = (args: { bookingLab: number | { id: number } } | [bookingLab: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::reject
 * @see app/Http/Controllers/BookingLaboratoriumController.php:547
 * @route '/booking-lab/{bookingLab}/reject'
 */
export const reject = (args: { bookingLab: number | { id: number } } | [bookingLab: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/booking-lab/{bookingLab}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::reject
 * @see app/Http/Controllers/BookingLaboratoriumController.php:547
 * @route '/booking-lab/{bookingLab}/reject'
 */
reject.url = (args: { bookingLab: number | { id: number } } | [bookingLab: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bookingLab: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bookingLab: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bookingLab: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bookingLab: typeof args.bookingLab === 'object'
                ? args.bookingLab.id
                : args.bookingLab,
                }

    return reject.definition.url
            .replace('{bookingLab}', parsedArgs.bookingLab.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingLaboratoriumController::reject
 * @see app/Http/Controllers/BookingLaboratoriumController.php:547
 * @route '/booking-lab/{bookingLab}/reject'
 */
reject.post = (args: { bookingLab: number | { id: number } } | [bookingLab: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})
const BookingLaboratoriumController = { calendar, index, create, store, checkAvailability, cancel, adminIndex, approve, reject }

export default BookingLaboratoriumController