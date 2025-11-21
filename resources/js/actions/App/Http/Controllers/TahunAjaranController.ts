import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TahunAjaranController::index
 * @see app/Http/Controllers/TahunAjaranController.php:11
 * @route '/tahun-ajaran'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tahun-ajaran',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TahunAjaranController::index
 * @see app/Http/Controllers/TahunAjaranController.php:11
 * @route '/tahun-ajaran'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TahunAjaranController::index
 * @see app/Http/Controllers/TahunAjaranController.php:11
 * @route '/tahun-ajaran'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TahunAjaranController::index
 * @see app/Http/Controllers/TahunAjaranController.php:11
 * @route '/tahun-ajaran'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TahunAjaranController::create
 * @see app/Http/Controllers/TahunAjaranController.php:24
 * @route '/tahun-ajaran/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tahun-ajaran/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TahunAjaranController::create
 * @see app/Http/Controllers/TahunAjaranController.php:24
 * @route '/tahun-ajaran/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TahunAjaranController::create
 * @see app/Http/Controllers/TahunAjaranController.php:24
 * @route '/tahun-ajaran/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TahunAjaranController::create
 * @see app/Http/Controllers/TahunAjaranController.php:24
 * @route '/tahun-ajaran/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TahunAjaranController::store
 * @see app/Http/Controllers/TahunAjaranController.php:35
 * @route '/tahun-ajaran'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tahun-ajaran',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TahunAjaranController::store
 * @see app/Http/Controllers/TahunAjaranController.php:35
 * @route '/tahun-ajaran'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TahunAjaranController::store
 * @see app/Http/Controllers/TahunAjaranController.php:35
 * @route '/tahun-ajaran'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TahunAjaranController::show
 * @see app/Http/Controllers/TahunAjaranController.php:0
 * @route '/tahun-ajaran/{tahun_ajaran}'
 */
export const show = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tahun-ajaran/{tahun_ajaran}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TahunAjaranController::show
 * @see app/Http/Controllers/TahunAjaranController.php:0
 * @route '/tahun-ajaran/{tahun_ajaran}'
 */
show.url = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tahun_ajaran: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tahun_ajaran: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tahun_ajaran: args.tahun_ajaran,
                }

    return show.definition.url
            .replace('{tahun_ajaran}', parsedArgs.tahun_ajaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TahunAjaranController::show
 * @see app/Http/Controllers/TahunAjaranController.php:0
 * @route '/tahun-ajaran/{tahun_ajaran}'
 */
show.get = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TahunAjaranController::show
 * @see app/Http/Controllers/TahunAjaranController.php:0
 * @route '/tahun-ajaran/{tahun_ajaran}'
 */
show.head = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TahunAjaranController::edit
 * @see app/Http/Controllers/TahunAjaranController.php:54
 * @route '/tahun-ajaran/{tahun_ajaran}/edit'
 */
export const edit = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/tahun-ajaran/{tahun_ajaran}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TahunAjaranController::edit
 * @see app/Http/Controllers/TahunAjaranController.php:54
 * @route '/tahun-ajaran/{tahun_ajaran}/edit'
 */
edit.url = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tahun_ajaran: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tahun_ajaran: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tahun_ajaran: args.tahun_ajaran,
                }

    return edit.definition.url
            .replace('{tahun_ajaran}', parsedArgs.tahun_ajaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TahunAjaranController::edit
 * @see app/Http/Controllers/TahunAjaranController.php:54
 * @route '/tahun-ajaran/{tahun_ajaran}/edit'
 */
edit.get = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TahunAjaranController::edit
 * @see app/Http/Controllers/TahunAjaranController.php:54
 * @route '/tahun-ajaran/{tahun_ajaran}/edit'
 */
edit.head = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TahunAjaranController::update
 * @see app/Http/Controllers/TahunAjaranController.php:66
 * @route '/tahun-ajaran/{tahun_ajaran}'
 */
export const update = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/tahun-ajaran/{tahun_ajaran}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TahunAjaranController::update
 * @see app/Http/Controllers/TahunAjaranController.php:66
 * @route '/tahun-ajaran/{tahun_ajaran}'
 */
update.url = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tahun_ajaran: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tahun_ajaran: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tahun_ajaran: args.tahun_ajaran,
                }

    return update.definition.url
            .replace('{tahun_ajaran}', parsedArgs.tahun_ajaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TahunAjaranController::update
 * @see app/Http/Controllers/TahunAjaranController.php:66
 * @route '/tahun-ajaran/{tahun_ajaran}'
 */
update.put = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TahunAjaranController::update
 * @see app/Http/Controllers/TahunAjaranController.php:66
 * @route '/tahun-ajaran/{tahun_ajaran}'
 */
update.patch = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\TahunAjaranController::destroy
 * @see app/Http/Controllers/TahunAjaranController.php:87
 * @route '/tahun-ajaran/{tahun_ajaran}'
 */
export const destroy = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tahun-ajaran/{tahun_ajaran}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TahunAjaranController::destroy
 * @see app/Http/Controllers/TahunAjaranController.php:87
 * @route '/tahun-ajaran/{tahun_ajaran}'
 */
destroy.url = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tahun_ajaran: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tahun_ajaran: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tahun_ajaran: args.tahun_ajaran,
                }

    return destroy.definition.url
            .replace('{tahun_ajaran}', parsedArgs.tahun_ajaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TahunAjaranController::destroy
 * @see app/Http/Controllers/TahunAjaranController.php:87
 * @route '/tahun-ajaran/{tahun_ajaran}'
 */
destroy.delete = (args: { tahun_ajaran: string | number } | [tahun_ajaran: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const TahunAjaranController = { index, create, store, show, edit, update, destroy }

export default TahunAjaranController