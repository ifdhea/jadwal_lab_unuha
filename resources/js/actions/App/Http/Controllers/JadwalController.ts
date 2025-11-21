import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\JadwalController::index
 * @see app/Http/Controllers/JadwalController.php:16
 * @route '/jadwal'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/jadwal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JadwalController::index
 * @see app/Http/Controllers/JadwalController.php:16
 * @route '/jadwal'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JadwalController::index
 * @see app/Http/Controllers/JadwalController.php:16
 * @route '/jadwal'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\JadwalController::index
 * @see app/Http/Controllers/JadwalController.php:16
 * @route '/jadwal'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JadwalController::embed
 * @see app/Http/Controllers/JadwalController.php:325
 * @route '/jadwal/embed'
 */
export const embed = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: embed.url(options),
    method: 'get',
})

embed.definition = {
    methods: ["get","head"],
    url: '/jadwal/embed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JadwalController::embed
 * @see app/Http/Controllers/JadwalController.php:325
 * @route '/jadwal/embed'
 */
embed.url = (options?: RouteQueryOptions) => {
    return embed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JadwalController::embed
 * @see app/Http/Controllers/JadwalController.php:325
 * @route '/jadwal/embed'
 */
embed.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: embed.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\JadwalController::embed
 * @see app/Http/Controllers/JadwalController.php:325
 * @route '/jadwal/embed'
 */
embed.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: embed.url(options),
    method: 'head',
})
const JadwalController = { index, embed }

export default JadwalController