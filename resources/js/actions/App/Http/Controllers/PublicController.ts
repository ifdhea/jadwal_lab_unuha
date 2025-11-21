import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicController::beranda
 * @see app/Http/Controllers/PublicController.php:15
 * @route '/'
 */
export const beranda = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: beranda.url(options),
    method: 'get',
})

beranda.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicController::beranda
 * @see app/Http/Controllers/PublicController.php:15
 * @route '/'
 */
beranda.url = (options?: RouteQueryOptions) => {
    return beranda.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicController::beranda
 * @see app/Http/Controllers/PublicController.php:15
 * @route '/'
 */
beranda.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: beranda.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicController::beranda
 * @see app/Http/Controllers/PublicController.php:15
 * @route '/'
 */
beranda.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: beranda.url(options),
    method: 'head',
})

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
const PublicController = { beranda, jadwalLab, tentang }

export default PublicController