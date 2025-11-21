import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DosenController::index
 * @see app/Http/Controllers/DosenController.php:16
 * @route '/dosen'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dosen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DosenController::index
 * @see app/Http/Controllers/DosenController.php:16
 * @route '/dosen'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DosenController::index
 * @see app/Http/Controllers/DosenController.php:16
 * @route '/dosen'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DosenController::index
 * @see app/Http/Controllers/DosenController.php:16
 * @route '/dosen'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DosenController::create
 * @see app/Http/Controllers/DosenController.php:27
 * @route '/dosen/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/dosen/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DosenController::create
 * @see app/Http/Controllers/DosenController.php:27
 * @route '/dosen/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DosenController::create
 * @see app/Http/Controllers/DosenController.php:27
 * @route '/dosen/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DosenController::create
 * @see app/Http/Controllers/DosenController.php:27
 * @route '/dosen/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DosenController::store
 * @see app/Http/Controllers/DosenController.php:40
 * @route '/dosen'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/dosen',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DosenController::store
 * @see app/Http/Controllers/DosenController.php:40
 * @route '/dosen'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DosenController::store
 * @see app/Http/Controllers/DosenController.php:40
 * @route '/dosen'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DosenController::show
 * @see app/Http/Controllers/DosenController.php:0
 * @route '/dosen/{dosen}'
 */
export const show = (args: { dosen: string | number } | [dosen: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/dosen/{dosen}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DosenController::show
 * @see app/Http/Controllers/DosenController.php:0
 * @route '/dosen/{dosen}'
 */
show.url = (args: { dosen: string | number } | [dosen: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dosen: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    dosen: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        dosen: args.dosen,
                }

    return show.definition.url
            .replace('{dosen}', parsedArgs.dosen.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DosenController::show
 * @see app/Http/Controllers/DosenController.php:0
 * @route '/dosen/{dosen}'
 */
show.get = (args: { dosen: string | number } | [dosen: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DosenController::show
 * @see app/Http/Controllers/DosenController.php:0
 * @route '/dosen/{dosen}'
 */
show.head = (args: { dosen: string | number } | [dosen: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DosenController::edit
 * @see app/Http/Controllers/DosenController.php:81
 * @route '/dosen/{dosen}/edit'
 */
export const edit = (args: { dosen: number | { id: number } } | [dosen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/dosen/{dosen}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DosenController::edit
 * @see app/Http/Controllers/DosenController.php:81
 * @route '/dosen/{dosen}/edit'
 */
edit.url = (args: { dosen: number | { id: number } } | [dosen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dosen: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { dosen: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    dosen: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        dosen: typeof args.dosen === 'object'
                ? args.dosen.id
                : args.dosen,
                }

    return edit.definition.url
            .replace('{dosen}', parsedArgs.dosen.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DosenController::edit
 * @see app/Http/Controllers/DosenController.php:81
 * @route '/dosen/{dosen}/edit'
 */
edit.get = (args: { dosen: number | { id: number } } | [dosen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DosenController::edit
 * @see app/Http/Controllers/DosenController.php:81
 * @route '/dosen/{dosen}/edit'
 */
edit.head = (args: { dosen: number | { id: number } } | [dosen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DosenController::update
 * @see app/Http/Controllers/DosenController.php:96
 * @route '/dosen/{dosen}'
 */
export const update = (args: { dosen: number | { id: number } } | [dosen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/dosen/{dosen}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\DosenController::update
 * @see app/Http/Controllers/DosenController.php:96
 * @route '/dosen/{dosen}'
 */
update.url = (args: { dosen: number | { id: number } } | [dosen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dosen: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { dosen: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    dosen: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        dosen: typeof args.dosen === 'object'
                ? args.dosen.id
                : args.dosen,
                }

    return update.definition.url
            .replace('{dosen}', parsedArgs.dosen.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DosenController::update
 * @see app/Http/Controllers/DosenController.php:96
 * @route '/dosen/{dosen}'
 */
update.put = (args: { dosen: number | { id: number } } | [dosen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\DosenController::update
 * @see app/Http/Controllers/DosenController.php:96
 * @route '/dosen/{dosen}'
 */
update.patch = (args: { dosen: number | { id: number } } | [dosen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\DosenController::destroy
 * @see app/Http/Controllers/DosenController.php:141
 * @route '/dosen/{dosen}'
 */
export const destroy = (args: { dosen: number | { id: number } } | [dosen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/dosen/{dosen}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DosenController::destroy
 * @see app/Http/Controllers/DosenController.php:141
 * @route '/dosen/{dosen}'
 */
destroy.url = (args: { dosen: number | { id: number } } | [dosen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dosen: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { dosen: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    dosen: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        dosen: typeof args.dosen === 'object'
                ? args.dosen.id
                : args.dosen,
                }

    return destroy.definition.url
            .replace('{dosen}', parsedArgs.dosen.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DosenController::destroy
 * @see app/Http/Controllers/DosenController.php:141
 * @route '/dosen/{dosen}'
 */
destroy.delete = (args: { dosen: number | { id: number } } | [dosen: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const DosenController = { index, create, store, show, edit, update, destroy }

export default DosenController