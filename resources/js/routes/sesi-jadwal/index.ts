import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SesiJadwalController::updateStatus
 * @see app/Http/Controllers/SesiJadwalController.php:21
 * @route '/sesi-jadwal/{sesiJadwal}/update-status'
 */
export const updateStatus = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/sesi-jadwal/{sesiJadwal}/update-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SesiJadwalController::updateStatus
 * @see app/Http/Controllers/SesiJadwalController.php:21
 * @route '/sesi-jadwal/{sesiJadwal}/update-status'
 */
updateStatus.url = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sesiJadwal: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { sesiJadwal: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    sesiJadwal: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sesiJadwal: typeof args.sesiJadwal === 'object'
                ? args.sesiJadwal.id
                : args.sesiJadwal,
                }

    return updateStatus.definition.url
            .replace('{sesiJadwal}', parsedArgs.sesiJadwal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SesiJadwalController::updateStatus
 * @see app/Http/Controllers/SesiJadwalController.php:21
 * @route '/sesi-jadwal/{sesiJadwal}/update-status'
 */
updateStatus.post = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SesiJadwalController::resetStatus
 * @see app/Http/Controllers/SesiJadwalController.php:62
 * @route '/sesi-jadwal/{sesiJadwal}/reset-status'
 */
export const resetStatus = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetStatus.url(args, options),
    method: 'post',
})

resetStatus.definition = {
    methods: ["post"],
    url: '/sesi-jadwal/{sesiJadwal}/reset-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SesiJadwalController::resetStatus
 * @see app/Http/Controllers/SesiJadwalController.php:62
 * @route '/sesi-jadwal/{sesiJadwal}/reset-status'
 */
resetStatus.url = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sesiJadwal: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { sesiJadwal: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    sesiJadwal: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sesiJadwal: typeof args.sesiJadwal === 'object'
                ? args.sesiJadwal.id
                : args.sesiJadwal,
                }

    return resetStatus.definition.url
            .replace('{sesiJadwal}', parsedArgs.sesiJadwal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SesiJadwalController::resetStatus
 * @see app/Http/Controllers/SesiJadwalController.php:62
 * @route '/sesi-jadwal/{sesiJadwal}/reset-status'
 */
resetStatus.post = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SesiJadwalController::tandaiTidakHadir
 * @see app/Http/Controllers/SesiJadwalController.php:93
 * @route '/sesi-jadwal/{sesiJadwal}/tandai-tidak-hadir'
 */
export const tandaiTidakHadir = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: tandaiTidakHadir.url(args, options),
    method: 'post',
})

tandaiTidakHadir.definition = {
    methods: ["post"],
    url: '/sesi-jadwal/{sesiJadwal}/tandai-tidak-hadir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SesiJadwalController::tandaiTidakHadir
 * @see app/Http/Controllers/SesiJadwalController.php:93
 * @route '/sesi-jadwal/{sesiJadwal}/tandai-tidak-hadir'
 */
tandaiTidakHadir.url = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sesiJadwal: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { sesiJadwal: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    sesiJadwal: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sesiJadwal: typeof args.sesiJadwal === 'object'
                ? args.sesiJadwal.id
                : args.sesiJadwal,
                }

    return tandaiTidakHadir.definition.url
            .replace('{sesiJadwal}', parsedArgs.sesiJadwal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SesiJadwalController::tandaiTidakHadir
 * @see app/Http/Controllers/SesiJadwalController.php:93
 * @route '/sesi-jadwal/{sesiJadwal}/tandai-tidak-hadir'
 */
tandaiTidakHadir.post = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: tandaiTidakHadir.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SesiJadwalController::batalkan
 * @see app/Http/Controllers/SesiJadwalController.php:115
 * @route '/sesi-jadwal/{sesiJadwal}/batalkan'
 */
export const batalkan = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batalkan.url(args, options),
    method: 'post',
})

batalkan.definition = {
    methods: ["post"],
    url: '/sesi-jadwal/{sesiJadwal}/batalkan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SesiJadwalController::batalkan
 * @see app/Http/Controllers/SesiJadwalController.php:115
 * @route '/sesi-jadwal/{sesiJadwal}/batalkan'
 */
batalkan.url = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sesiJadwal: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { sesiJadwal: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    sesiJadwal: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sesiJadwal: typeof args.sesiJadwal === 'object'
                ? args.sesiJadwal.id
                : args.sesiJadwal,
                }

    return batalkan.definition.url
            .replace('{sesiJadwal}', parsedArgs.sesiJadwal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SesiJadwalController::batalkan
 * @see app/Http/Controllers/SesiJadwalController.php:115
 * @route '/sesi-jadwal/{sesiJadwal}/batalkan'
 */
batalkan.post = (args: { sesiJadwal: number | { id: number } } | [sesiJadwal: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batalkan.url(args, options),
    method: 'post',
})
const sesiJadwal = {
    updateStatus: Object.assign(updateStatus, updateStatus),
resetStatus: Object.assign(resetStatus, resetStatus),
tandaiTidakHadir: Object.assign(tandaiTidakHadir, tandaiTidakHadir),
batalkan: Object.assign(batalkan, batalkan),
}

export default sesiJadwal