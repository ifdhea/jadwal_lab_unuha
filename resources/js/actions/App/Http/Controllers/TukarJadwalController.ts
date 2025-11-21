import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal'
 */
const calendar63440711c525b90fe29282f449b41bc0 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar63440711c525b90fe29282f449b41bc0.url(options),
    method: 'get',
})

calendar63440711c525b90fe29282f449b41bc0.definition = {
    methods: ["get","head"],
    url: '/tukar-jadwal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal'
 */
calendar63440711c525b90fe29282f449b41bc0.url = (options?: RouteQueryOptions) => {
    return calendar63440711c525b90fe29282f449b41bc0.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal'
 */
calendar63440711c525b90fe29282f449b41bc0.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar63440711c525b90fe29282f449b41bc0.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal'
 */
calendar63440711c525b90fe29282f449b41bc0.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendar63440711c525b90fe29282f449b41bc0.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal/calendar'
 */
const calendarfb7a711827d019a617ebcf119e3361dc = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendarfb7a711827d019a617ebcf119e3361dc.url(options),
    method: 'get',
})

calendarfb7a711827d019a617ebcf119e3361dc.definition = {
    methods: ["get","head"],
    url: '/tukar-jadwal/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal/calendar'
 */
calendarfb7a711827d019a617ebcf119e3361dc.url = (options?: RouteQueryOptions) => {
    return calendarfb7a711827d019a617ebcf119e3361dc.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal/calendar'
 */
calendarfb7a711827d019a617ebcf119e3361dc.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendarfb7a711827d019a617ebcf119e3361dc.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal/calendar'
 */
calendarfb7a711827d019a617ebcf119e3361dc.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendarfb7a711827d019a617ebcf119e3361dc.url(options),
    method: 'head',
})

export const calendar = {
    '/tukar-jadwal': calendar63440711c525b90fe29282f449b41bc0,
    '/tukar-jadwal/calendar': calendarfb7a711827d019a617ebcf119e3361dc,
}

/**
* @see \App\Http\Controllers\TukarJadwalController::index
 * @see app/Http/Controllers/TukarJadwalController.php:16
 * @route '/tukar-jadwal/requests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tukar-jadwal/requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::index
 * @see app/Http/Controllers/TukarJadwalController.php:16
 * @route '/tukar-jadwal/requests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::index
 * @see app/Http/Controllers/TukarJadwalController.php:16
 * @route '/tukar-jadwal/requests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TukarJadwalController::index
 * @see app/Http/Controllers/TukarJadwalController.php:16
 * @route '/tukar-jadwal/requests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TukarJadwalController::create
 * @see app/Http/Controllers/TukarJadwalController.php:95
 * @route '/tukar-jadwal/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tukar-jadwal/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::create
 * @see app/Http/Controllers/TukarJadwalController.php:95
 * @route '/tukar-jadwal/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::create
 * @see app/Http/Controllers/TukarJadwalController.php:95
 * @route '/tukar-jadwal/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TukarJadwalController::create
 * @see app/Http/Controllers/TukarJadwalController.php:95
 * @route '/tukar-jadwal/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TukarJadwalController::store
 * @see app/Http/Controllers/TukarJadwalController.php:189
 * @route '/tukar-jadwal'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tukar-jadwal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::store
 * @see app/Http/Controllers/TukarJadwalController.php:189
 * @route '/tukar-jadwal'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::store
 * @see app/Http/Controllers/TukarJadwalController.php:189
 * @route '/tukar-jadwal'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TukarJadwalController::getJadwalMitra
 * @see app/Http/Controllers/TukarJadwalController.php:153
 * @route '/tukar-jadwal/jadwal-mitra'
 */
export const getJadwalMitra = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getJadwalMitra.url(options),
    method: 'get',
})

getJadwalMitra.definition = {
    methods: ["get","head"],
    url: '/tukar-jadwal/jadwal-mitra',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::getJadwalMitra
 * @see app/Http/Controllers/TukarJadwalController.php:153
 * @route '/tukar-jadwal/jadwal-mitra'
 */
getJadwalMitra.url = (options?: RouteQueryOptions) => {
    return getJadwalMitra.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::getJadwalMitra
 * @see app/Http/Controllers/TukarJadwalController.php:153
 * @route '/tukar-jadwal/jadwal-mitra'
 */
getJadwalMitra.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getJadwalMitra.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TukarJadwalController::getJadwalMitra
 * @see app/Http/Controllers/TukarJadwalController.php:153
 * @route '/tukar-jadwal/jadwal-mitra'
 */
getJadwalMitra.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getJadwalMitra.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TukarJadwalController::approve
 * @see app/Http/Controllers/TukarJadwalController.php:358
 * @route '/tukar-jadwal/{tukarJadwal}/approve'
 */
export const approve = (args: { tukarJadwal: number | { id: number } } | [tukarJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/tukar-jadwal/{tukarJadwal}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::approve
 * @see app/Http/Controllers/TukarJadwalController.php:358
 * @route '/tukar-jadwal/{tukarJadwal}/approve'
 */
approve.url = (args: { tukarJadwal: number | { id: number } } | [tukarJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tukarJadwal: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tukarJadwal: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tukarJadwal: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tukarJadwal: typeof args.tukarJadwal === 'object'
                ? args.tukarJadwal.id
                : args.tukarJadwal,
                }

    return approve.definition.url
            .replace('{tukarJadwal}', parsedArgs.tukarJadwal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::approve
 * @see app/Http/Controllers/TukarJadwalController.php:358
 * @route '/tukar-jadwal/{tukarJadwal}/approve'
 */
approve.post = (args: { tukarJadwal: number | { id: number } } | [tukarJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TukarJadwalController::reject
 * @see app/Http/Controllers/TukarJadwalController.php:524
 * @route '/tukar-jadwal/{tukarJadwal}/reject'
 */
export const reject = (args: { tukarJadwal: number | { id: number } } | [tukarJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/tukar-jadwal/{tukarJadwal}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::reject
 * @see app/Http/Controllers/TukarJadwalController.php:524
 * @route '/tukar-jadwal/{tukarJadwal}/reject'
 */
reject.url = (args: { tukarJadwal: number | { id: number } } | [tukarJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tukarJadwal: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tukarJadwal: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tukarJadwal: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tukarJadwal: typeof args.tukarJadwal === 'object'
                ? args.tukarJadwal.id
                : args.tukarJadwal,
                }

    return reject.definition.url
            .replace('{tukarJadwal}', parsedArgs.tukarJadwal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::reject
 * @see app/Http/Controllers/TukarJadwalController.php:524
 * @route '/tukar-jadwal/{tukarJadwal}/reject'
 */
reject.post = (args: { tukarJadwal: number | { id: number } } | [tukarJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TukarJadwalController::cancel
 * @see app/Http/Controllers/TukarJadwalController.php:551
 * @route '/tukar-jadwal/{tukarJadwal}/cancel'
 */
export const cancel = (args: { tukarJadwal: number | { id: number } } | [tukarJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/tukar-jadwal/{tukarJadwal}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::cancel
 * @see app/Http/Controllers/TukarJadwalController.php:551
 * @route '/tukar-jadwal/{tukarJadwal}/cancel'
 */
cancel.url = (args: { tukarJadwal: number | { id: number } } | [tukarJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tukarJadwal: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tukarJadwal: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tukarJadwal: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tukarJadwal: typeof args.tukarJadwal === 'object'
                ? args.tukarJadwal.id
                : args.tukarJadwal,
                }

    return cancel.definition.url
            .replace('{tukarJadwal}', parsedArgs.tukarJadwal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::cancel
 * @see app/Http/Controllers/TukarJadwalController.php:551
 * @route '/tukar-jadwal/{tukarJadwal}/cancel'
 */
cancel.post = (args: { tukarJadwal: number | { id: number } } | [tukarJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})
const TukarJadwalController = { calendar, index, create, store, getJadwalMitra, approve, reject, cancel }

export default TukarJadwalController