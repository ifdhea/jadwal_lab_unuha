import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TukarJadwalController::index
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tukar-jadwal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::index
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::index
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TukarJadwalController::index
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal/calendar'
 */
export const calendar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})

calendar.definition = {
    methods: ["get","head"],
    url: '/tukar-jadwal/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal/calendar'
 */
calendar.url = (options?: RouteQueryOptions) => {
    return calendar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal/calendar'
 */
calendar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TukarJadwalController::calendar
 * @see app/Http/Controllers/TukarJadwalController.php:573
 * @route '/tukar-jadwal/calendar'
 */
calendar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendar.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TukarJadwalController::requests
 * @see app/Http/Controllers/TukarJadwalController.php:16
 * @route '/tukar-jadwal/requests'
 */
export const requests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requests.url(options),
    method: 'get',
})

requests.definition = {
    methods: ["get","head"],
    url: '/tukar-jadwal/requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::requests
 * @see app/Http/Controllers/TukarJadwalController.php:16
 * @route '/tukar-jadwal/requests'
 */
requests.url = (options?: RouteQueryOptions) => {
    return requests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::requests
 * @see app/Http/Controllers/TukarJadwalController.php:16
 * @route '/tukar-jadwal/requests'
 */
requests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requests.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TukarJadwalController::requests
 * @see app/Http/Controllers/TukarJadwalController.php:16
 * @route '/tukar-jadwal/requests'
 */
requests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: requests.url(options),
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
* @see \App\Http\Controllers\TukarJadwalController::jadwalMitra
 * @see app/Http/Controllers/TukarJadwalController.php:153
 * @route '/tukar-jadwal/jadwal-mitra'
 */
export const jadwalMitra = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jadwalMitra.url(options),
    method: 'get',
})

jadwalMitra.definition = {
    methods: ["get","head"],
    url: '/tukar-jadwal/jadwal-mitra',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TukarJadwalController::jadwalMitra
 * @see app/Http/Controllers/TukarJadwalController.php:153
 * @route '/tukar-jadwal/jadwal-mitra'
 */
jadwalMitra.url = (options?: RouteQueryOptions) => {
    return jadwalMitra.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TukarJadwalController::jadwalMitra
 * @see app/Http/Controllers/TukarJadwalController.php:153
 * @route '/tukar-jadwal/jadwal-mitra'
 */
jadwalMitra.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jadwalMitra.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TukarJadwalController::jadwalMitra
 * @see app/Http/Controllers/TukarJadwalController.php:153
 * @route '/tukar-jadwal/jadwal-mitra'
 */
jadwalMitra.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: jadwalMitra.url(options),
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
const tukarJadwal = {
    index: Object.assign(index, index),
calendar: Object.assign(calendar, calendar),
requests: Object.assign(requests, requests),
create: Object.assign(create, create),
store: Object.assign(store, store),
jadwalMitra: Object.assign(jadwalMitra, jadwalMitra),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
cancel: Object.assign(cancel, cancel),
}

export default tukarJadwal