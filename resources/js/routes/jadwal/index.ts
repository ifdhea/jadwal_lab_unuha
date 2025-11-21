import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
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

/**
* @see \App\Http\Controllers\JadwalGeneratorController::generate
 * @see app/Http/Controllers/JadwalGeneratorController.php:15
 * @route '/jadwal/generate'
 */
export const generate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

generate.definition = {
    methods: ["post"],
    url: '/jadwal/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\JadwalGeneratorController::generate
 * @see app/Http/Controllers/JadwalGeneratorController.php:15
 * @route '/jadwal/generate'
 */
generate.url = (options?: RouteQueryOptions) => {
    return generate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JadwalGeneratorController::generate
 * @see app/Http/Controllers/JadwalGeneratorController.php:15
 * @route '/jadwal/generate'
 */
generate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})
const jadwal = {
    index: Object.assign(index, index),
embed: Object.assign(embed, embed),
generate: Object.assign(generate, generate),
}

export default jadwal