import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LaboratoriumController::index
 * @see app/Http/Controllers/LaboratoriumController.php:12
 * @route '/laboratorium'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/laboratorium',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaboratoriumController::index
 * @see app/Http/Controllers/LaboratoriumController.php:12
 * @route '/laboratorium'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaboratoriumController::index
 * @see app/Http/Controllers/LaboratoriumController.php:12
 * @route '/laboratorium'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LaboratoriumController::index
 * @see app/Http/Controllers/LaboratoriumController.php:12
 * @route '/laboratorium'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaboratoriumController::create
 * @see app/Http/Controllers/LaboratoriumController.php:28
 * @route '/laboratorium/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/laboratorium/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaboratoriumController::create
 * @see app/Http/Controllers/LaboratoriumController.php:28
 * @route '/laboratorium/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaboratoriumController::create
 * @see app/Http/Controllers/LaboratoriumController.php:28
 * @route '/laboratorium/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LaboratoriumController::create
 * @see app/Http/Controllers/LaboratoriumController.php:28
 * @route '/laboratorium/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaboratoriumController::store
 * @see app/Http/Controllers/LaboratoriumController.php:44
 * @route '/laboratorium'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/laboratorium',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LaboratoriumController::store
 * @see app/Http/Controllers/LaboratoriumController.php:44
 * @route '/laboratorium'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaboratoriumController::store
 * @see app/Http/Controllers/LaboratoriumController.php:44
 * @route '/laboratorium'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LaboratoriumController::show
 * @see app/Http/Controllers/LaboratoriumController.php:0
 * @route '/laboratorium/{laboratorium}'
 */
export const show = (args: { laboratorium: string | number } | [laboratorium: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/laboratorium/{laboratorium}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaboratoriumController::show
 * @see app/Http/Controllers/LaboratoriumController.php:0
 * @route '/laboratorium/{laboratorium}'
 */
show.url = (args: { laboratorium: string | number } | [laboratorium: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { laboratorium: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    laboratorium: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        laboratorium: args.laboratorium,
                }

    return show.definition.url
            .replace('{laboratorium}', parsedArgs.laboratorium.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaboratoriumController::show
 * @see app/Http/Controllers/LaboratoriumController.php:0
 * @route '/laboratorium/{laboratorium}'
 */
show.get = (args: { laboratorium: string | number } | [laboratorium: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LaboratoriumController::show
 * @see app/Http/Controllers/LaboratoriumController.php:0
 * @route '/laboratorium/{laboratorium}'
 */
show.head = (args: { laboratorium: string | number } | [laboratorium: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaboratoriumController::edit
 * @see app/Http/Controllers/LaboratoriumController.php:63
 * @route '/laboratorium/{laboratorium}/edit'
 */
export const edit = (args: { laboratorium: number | { id: number } } | [laboratorium: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/laboratorium/{laboratorium}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaboratoriumController::edit
 * @see app/Http/Controllers/LaboratoriumController.php:63
 * @route '/laboratorium/{laboratorium}/edit'
 */
edit.url = (args: { laboratorium: number | { id: number } } | [laboratorium: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { laboratorium: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { laboratorium: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    laboratorium: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        laboratorium: typeof args.laboratorium === 'object'
                ? args.laboratorium.id
                : args.laboratorium,
                }

    return edit.definition.url
            .replace('{laboratorium}', parsedArgs.laboratorium.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaboratoriumController::edit
 * @see app/Http/Controllers/LaboratoriumController.php:63
 * @route '/laboratorium/{laboratorium}/edit'
 */
edit.get = (args: { laboratorium: number | { id: number } } | [laboratorium: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LaboratoriumController::edit
 * @see app/Http/Controllers/LaboratoriumController.php:63
 * @route '/laboratorium/{laboratorium}/edit'
 */
edit.head = (args: { laboratorium: number | { id: number } } | [laboratorium: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaboratoriumController::update
 * @see app/Http/Controllers/LaboratoriumController.php:81
 * @route '/laboratorium/{laboratorium}'
 */
export const update = (args: { laboratorium: number | { id: number } } | [laboratorium: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/laboratorium/{laboratorium}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LaboratoriumController::update
 * @see app/Http/Controllers/LaboratoriumController.php:81
 * @route '/laboratorium/{laboratorium}'
 */
update.url = (args: { laboratorium: number | { id: number } } | [laboratorium: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { laboratorium: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { laboratorium: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    laboratorium: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        laboratorium: typeof args.laboratorium === 'object'
                ? args.laboratorium.id
                : args.laboratorium,
                }

    return update.definition.url
            .replace('{laboratorium}', parsedArgs.laboratorium.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaboratoriumController::update
 * @see app/Http/Controllers/LaboratoriumController.php:81
 * @route '/laboratorium/{laboratorium}'
 */
update.put = (args: { laboratorium: number | { id: number } } | [laboratorium: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\LaboratoriumController::update
 * @see app/Http/Controllers/LaboratoriumController.php:81
 * @route '/laboratorium/{laboratorium}'
 */
update.patch = (args: { laboratorium: number | { id: number } } | [laboratorium: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\LaboratoriumController::destroy
 * @see app/Http/Controllers/LaboratoriumController.php:100
 * @route '/laboratorium/{laboratorium}'
 */
export const destroy = (args: { laboratorium: number | { id: number } } | [laboratorium: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/laboratorium/{laboratorium}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LaboratoriumController::destroy
 * @see app/Http/Controllers/LaboratoriumController.php:100
 * @route '/laboratorium/{laboratorium}'
 */
destroy.url = (args: { laboratorium: number | { id: number } } | [laboratorium: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { laboratorium: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { laboratorium: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    laboratorium: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        laboratorium: typeof args.laboratorium === 'object'
                ? args.laboratorium.id
                : args.laboratorium,
                }

    return destroy.definition.url
            .replace('{laboratorium}', parsedArgs.laboratorium.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaboratoriumController::destroy
 * @see app/Http/Controllers/LaboratoriumController.php:100
 * @route '/laboratorium/{laboratorium}'
 */
destroy.delete = (args: { laboratorium: number | { id: number } } | [laboratorium: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const LaboratoriumController = { index, create, store, show, edit, update, destroy }

export default LaboratoriumController