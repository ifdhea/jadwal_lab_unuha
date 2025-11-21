import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KelasController::index
 * @see app/Http/Controllers/KelasController.php:14
 * @route '/kelas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kelas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KelasController::index
 * @see app/Http/Controllers/KelasController.php:14
 * @route '/kelas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasController::index
 * @see app/Http/Controllers/KelasController.php:14
 * @route '/kelas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KelasController::index
 * @see app/Http/Controllers/KelasController.php:14
 * @route '/kelas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KelasController::create
 * @see app/Http/Controllers/KelasController.php:25
 * @route '/kelas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/kelas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KelasController::create
 * @see app/Http/Controllers/KelasController.php:25
 * @route '/kelas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasController::create
 * @see app/Http/Controllers/KelasController.php:25
 * @route '/kelas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KelasController::create
 * @see app/Http/Controllers/KelasController.php:25
 * @route '/kelas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KelasController::store
 * @see app/Http/Controllers/KelasController.php:39
 * @route '/kelas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/kelas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KelasController::store
 * @see app/Http/Controllers/KelasController.php:39
 * @route '/kelas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasController::store
 * @see app/Http/Controllers/KelasController.php:39
 * @route '/kelas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KelasController::show
 * @see app/Http/Controllers/KelasController.php:0
 * @route '/kelas/{kelas}'
 */
export const show = (args: { kelas: string | number } | [kelas: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/kelas/{kelas}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KelasController::show
 * @see app/Http/Controllers/KelasController.php:0
 * @route '/kelas/{kelas}'
 */
show.url = (args: { kelas: string | number } | [kelas: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kelas: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kelas: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kelas: args.kelas,
                }

    return show.definition.url
            .replace('{kelas}', parsedArgs.kelas.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasController::show
 * @see app/Http/Controllers/KelasController.php:0
 * @route '/kelas/{kelas}'
 */
show.get = (args: { kelas: string | number } | [kelas: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KelasController::show
 * @see app/Http/Controllers/KelasController.php:0
 * @route '/kelas/{kelas}'
 */
show.head = (args: { kelas: string | number } | [kelas: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KelasController::edit
 * @see app/Http/Controllers/KelasController.php:57
 * @route '/kelas/{kelas}/edit'
 */
export const edit = (args: { kelas: number | { id: number } } | [kelas: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/kelas/{kelas}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KelasController::edit
 * @see app/Http/Controllers/KelasController.php:57
 * @route '/kelas/{kelas}/edit'
 */
edit.url = (args: { kelas: number | { id: number } } | [kelas: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kelas: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { kelas: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kelas: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kelas: typeof args.kelas === 'object'
                ? args.kelas.id
                : args.kelas,
                }

    return edit.definition.url
            .replace('{kelas}', parsedArgs.kelas.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasController::edit
 * @see app/Http/Controllers/KelasController.php:57
 * @route '/kelas/{kelas}/edit'
 */
edit.get = (args: { kelas: number | { id: number } } | [kelas: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KelasController::edit
 * @see app/Http/Controllers/KelasController.php:57
 * @route '/kelas/{kelas}/edit'
 */
edit.head = (args: { kelas: number | { id: number } } | [kelas: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KelasController::update
 * @see app/Http/Controllers/KelasController.php:72
 * @route '/kelas/{kelas}'
 */
export const update = (args: { kelas: number | { id: number } } | [kelas: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/kelas/{kelas}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\KelasController::update
 * @see app/Http/Controllers/KelasController.php:72
 * @route '/kelas/{kelas}'
 */
update.url = (args: { kelas: number | { id: number } } | [kelas: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kelas: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { kelas: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kelas: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kelas: typeof args.kelas === 'object'
                ? args.kelas.id
                : args.kelas,
                }

    return update.definition.url
            .replace('{kelas}', parsedArgs.kelas.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasController::update
 * @see app/Http/Controllers/KelasController.php:72
 * @route '/kelas/{kelas}'
 */
update.put = (args: { kelas: number | { id: number } } | [kelas: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\KelasController::update
 * @see app/Http/Controllers/KelasController.php:72
 * @route '/kelas/{kelas}'
 */
update.patch = (args: { kelas: number | { id: number } } | [kelas: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\KelasController::destroy
 * @see app/Http/Controllers/KelasController.php:90
 * @route '/kelas/{kelas}'
 */
export const destroy = (args: { kelas: number | { id: number } } | [kelas: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/kelas/{kelas}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\KelasController::destroy
 * @see app/Http/Controllers/KelasController.php:90
 * @route '/kelas/{kelas}'
 */
destroy.url = (args: { kelas: number | { id: number } } | [kelas: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kelas: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { kelas: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    kelas: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kelas: typeof args.kelas === 'object'
                ? args.kelas.id
                : args.kelas,
                }

    return destroy.definition.url
            .replace('{kelas}', parsedArgs.kelas.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasController::destroy
 * @see app/Http/Controllers/KelasController.php:90
 * @route '/kelas/{kelas}'
 */
destroy.delete = (args: { kelas: number | { id: number } } | [kelas: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const KelasController = { index, create, store, show, edit, update, destroy }

export default KelasController