import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
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
const JadwalGeneratorController = { generate }

export default JadwalGeneratorController