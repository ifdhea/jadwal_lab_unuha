import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ProgramStudiController::index
 * @see app/Http/Controllers/ProgramStudiController.php:11
 * @route '/program-studi'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/program-studi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProgramStudiController::index
 * @see app/Http/Controllers/ProgramStudiController.php:11
 * @route '/program-studi'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProgramStudiController::index
 * @see app/Http/Controllers/ProgramStudiController.php:11
 * @route '/program-studi'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProgramStudiController::index
 * @see app/Http/Controllers/ProgramStudiController.php:11
 * @route '/program-studi'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProgramStudiController::create
 * @see app/Http/Controllers/ProgramStudiController.php:22
 * @route '/program-studi/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/program-studi/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProgramStudiController::create
 * @see app/Http/Controllers/ProgramStudiController.php:22
 * @route '/program-studi/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProgramStudiController::create
 * @see app/Http/Controllers/ProgramStudiController.php:22
 * @route '/program-studi/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProgramStudiController::create
 * @see app/Http/Controllers/ProgramStudiController.php:22
 * @route '/program-studi/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProgramStudiController::store
 * @see app/Http/Controllers/ProgramStudiController.php:33
 * @route '/program-studi'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/program-studi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProgramStudiController::store
 * @see app/Http/Controllers/ProgramStudiController.php:33
 * @route '/program-studi'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProgramStudiController::store
 * @see app/Http/Controllers/ProgramStudiController.php:33
 * @route '/program-studi'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProgramStudiController::show
 * @see app/Http/Controllers/ProgramStudiController.php:0
 * @route '/program-studi/{program_studi}'
 */
export const show = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/program-studi/{program_studi}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProgramStudiController::show
 * @see app/Http/Controllers/ProgramStudiController.php:0
 * @route '/program-studi/{program_studi}'
 */
show.url = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { program_studi: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    program_studi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        program_studi: args.program_studi,
                }

    return show.definition.url
            .replace('{program_studi}', parsedArgs.program_studi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProgramStudiController::show
 * @see app/Http/Controllers/ProgramStudiController.php:0
 * @route '/program-studi/{program_studi}'
 */
show.get = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProgramStudiController::show
 * @see app/Http/Controllers/ProgramStudiController.php:0
 * @route '/program-studi/{program_studi}'
 */
show.head = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProgramStudiController::edit
 * @see app/Http/Controllers/ProgramStudiController.php:47
 * @route '/program-studi/{program_studi}/edit'
 */
export const edit = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/program-studi/{program_studi}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProgramStudiController::edit
 * @see app/Http/Controllers/ProgramStudiController.php:47
 * @route '/program-studi/{program_studi}/edit'
 */
edit.url = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { program_studi: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    program_studi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        program_studi: args.program_studi,
                }

    return edit.definition.url
            .replace('{program_studi}', parsedArgs.program_studi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProgramStudiController::edit
 * @see app/Http/Controllers/ProgramStudiController.php:47
 * @route '/program-studi/{program_studi}/edit'
 */
edit.get = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProgramStudiController::edit
 * @see app/Http/Controllers/ProgramStudiController.php:47
 * @route '/program-studi/{program_studi}/edit'
 */
edit.head = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProgramStudiController::update
 * @see app/Http/Controllers/ProgramStudiController.php:59
 * @route '/program-studi/{program_studi}'
 */
export const update = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/program-studi/{program_studi}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ProgramStudiController::update
 * @see app/Http/Controllers/ProgramStudiController.php:59
 * @route '/program-studi/{program_studi}'
 */
update.url = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { program_studi: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    program_studi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        program_studi: args.program_studi,
                }

    return update.definition.url
            .replace('{program_studi}', parsedArgs.program_studi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProgramStudiController::update
 * @see app/Http/Controllers/ProgramStudiController.php:59
 * @route '/program-studi/{program_studi}'
 */
update.put = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ProgramStudiController::update
 * @see app/Http/Controllers/ProgramStudiController.php:59
 * @route '/program-studi/{program_studi}'
 */
update.patch = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ProgramStudiController::destroy
 * @see app/Http/Controllers/ProgramStudiController.php:73
 * @route '/program-studi/{program_studi}'
 */
export const destroy = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/program-studi/{program_studi}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProgramStudiController::destroy
 * @see app/Http/Controllers/ProgramStudiController.php:73
 * @route '/program-studi/{program_studi}'
 */
destroy.url = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { program_studi: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    program_studi: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        program_studi: args.program_studi,
                }

    return destroy.definition.url
            .replace('{program_studi}', parsedArgs.program_studi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProgramStudiController::destroy
 * @see app/Http/Controllers/ProgramStudiController.php:73
 * @route '/program-studi/{program_studi}'
 */
destroy.delete = (args: { program_studi: string | number } | [program_studi: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const programStudi = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default programStudi