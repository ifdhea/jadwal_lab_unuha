import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KampusController::index
 * @see app/Http/Controllers/KampusController.php:11
 * @route '/kampus'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kampus',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KampusController::index
 * @see app/Http/Controllers/KampusController.php:11
 * @route '/kampus'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KampusController::index
 * @see app/Http/Controllers/KampusController.php:11
 * @route '/kampus'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KampusController::index
 * @see app/Http/Controllers/KampusController.php:11
 * @route '/kampus'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KampusController::create
 * @see app/Http/Controllers/KampusController.php:24
 * @route '/kampus/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/kampus/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KampusController::create
 * @see app/Http/Controllers/KampusController.php:24
 * @route '/kampus/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KampusController::create
 * @see app/Http/Controllers/KampusController.php:24
 * @route '/kampus/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KampusController::create
 * @see app/Http/Controllers/KampusController.php:24
 * @route '/kampus/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KampusController::store
 * @see app/Http/Controllers/KampusController.php:35
 * @route '/kampus'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/kampus',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KampusController::store
 * @see app/Http/Controllers/KampusController.php:35
 * @route '/kampus'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KampusController::store
 * @see app/Http/Controllers/KampusController.php:35
 * @route '/kampus'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KampusController::show
 * @see app/Http/Controllers/KampusController.php:0
 * @route '/kampus/{kampus}'
 */
export const show = (args: { kampus: string | number } | [kampus: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/kampus/{kampus}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KampusController::show
 * @see app/Http/Controllers/KampusController.php:0
 * @route '/kampus/{kampus}'
 */
show.url = (args: { kampus: string | number } | [kampus: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kampus: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kampus: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kampus: args.kampus,
                }

    return show.definition.url
            .replace('{kampus}', parsedArgs.kampus.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KampusController::show
 * @see app/Http/Controllers/KampusController.php:0
 * @route '/kampus/{kampus}'
 */
show.get = (args: { kampus: string | number } | [kampus: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KampusController::show
 * @see app/Http/Controllers/KampusController.php:0
 * @route '/kampus/{kampus}'
 */
show.head = (args: { kampus: string | number } | [kampus: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KampusController::edit
 * @see app/Http/Controllers/KampusController.php:50
 * @route '/kampus/{kampus}/edit'
 */
export const edit = (args: { kampus: number | { id: number } } | [kampus: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/kampus/{kampus}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KampusController::edit
 * @see app/Http/Controllers/KampusController.php:50
 * @route '/kampus/{kampus}/edit'
 */
edit.url = (args: { kampus: number | { id: number } } | [kampus: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kampus: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { kampus: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kampus: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kampus: typeof args.kampus === 'object'
                ? args.kampus.id
                : args.kampus,
                }

    return edit.definition.url
            .replace('{kampus}', parsedArgs.kampus.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KampusController::edit
 * @see app/Http/Controllers/KampusController.php:50
 * @route '/kampus/{kampus}/edit'
 */
edit.get = (args: { kampus: number | { id: number } } | [kampus: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KampusController::edit
 * @see app/Http/Controllers/KampusController.php:50
 * @route '/kampus/{kampus}/edit'
 */
edit.head = (args: { kampus: number | { id: number } } | [kampus: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KampusController::update
 * @see app/Http/Controllers/KampusController.php:62
 * @route '/kampus/{kampus}'
 */
export const update = (args: { kampus: number | { id: number } } | [kampus: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/kampus/{kampus}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\KampusController::update
 * @see app/Http/Controllers/KampusController.php:62
 * @route '/kampus/{kampus}'
 */
update.url = (args: { kampus: number | { id: number } } | [kampus: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kampus: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { kampus: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kampus: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kampus: typeof args.kampus === 'object'
                ? args.kampus.id
                : args.kampus,
                }

    return update.definition.url
            .replace('{kampus}', parsedArgs.kampus.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KampusController::update
 * @see app/Http/Controllers/KampusController.php:62
 * @route '/kampus/{kampus}'
 */
update.put = (args: { kampus: number | { id: number } } | [kampus: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\KampusController::update
 * @see app/Http/Controllers/KampusController.php:62
 * @route '/kampus/{kampus}'
 */
update.patch = (args: { kampus: number | { id: number } } | [kampus: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\KampusController::destroy
 * @see app/Http/Controllers/KampusController.php:77
 * @route '/kampus/{kampus}'
 */
export const destroy = (args: { kampus: number | { id: number } } | [kampus: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/kampus/{kampus}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\KampusController::destroy
 * @see app/Http/Controllers/KampusController.php:77
 * @route '/kampus/{kampus}'
 */
destroy.url = (args: { kampus: number | { id: number } } | [kampus: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kampus: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { kampus: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kampus: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kampus: typeof args.kampus === 'object'
                ? args.kampus.id
                : args.kampus,
                }

    return destroy.definition.url
            .replace('{kampus}', parsedArgs.kampus.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KampusController::destroy
 * @see app/Http/Controllers/KampusController.php:77
 * @route '/kampus/{kampus}'
 */
destroy.delete = (args: { kampus: number | { id: number } } | [kampus: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const KampusController = { index, create, store, show, edit, update, destroy }

export default KampusController