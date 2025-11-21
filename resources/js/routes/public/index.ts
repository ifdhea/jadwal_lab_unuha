import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PublicController::jadwalLab
 * @see app/Http/Controllers/PublicController.php:25
 * @route '/jadwal-lab'
 */
export const jadwalLab = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jadwalLab.url(options),
    method: 'get',
})

jadwalLab.definition = {
    methods: ["get","head"],
    url: '/jadwal-lab',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicController::jadwalLab
 * @see app/Http/Controllers/PublicController.php:25
 * @route '/jadwal-lab'
 */
jadwalLab.url = (options?: RouteQueryOptions) => {
    return jadwalLab.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicController::jadwalLab
 * @see app/Http/Controllers/PublicController.php:25
 * @route '/jadwal-lab'
 */
jadwalLab.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jadwalLab.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicController::jadwalLab
 * @see app/Http/Controllers/PublicController.php:25
 * @route '/jadwal-lab'
 */
jadwalLab.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: jadwalLab.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicController::tentang
 * @see app/Http/Controllers/PublicController.php:20
 * @route '/tentang'
 */
export const tentang = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tentang.url(options),
    method: 'get',
})

tentang.definition = {
    methods: ["get","head"],
    url: '/tentang',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicController::tentang
 * @see app/Http/Controllers/PublicController.php:20
 * @route '/tentang'
 */
tentang.url = (options?: RouteQueryOptions) => {
    return tentang.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicController::tentang
 * @see app/Http/Controllers/PublicController.php:20
 * @route '/tentang'
 */
tentang.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tentang.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicController::tentang
 * @see app/Http/Controllers/PublicController.php:20
 * @route '/tentang'
 */
tentang.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tentang.url(options),
    method: 'head',
})
const publicMethod = {
    jadwalLab: Object.assign(jadwalLab, jadwalLab),
tentang: Object.assign(tentang, tentang),
}

export default publicMethod