import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MataKuliahController::index
 * @see app/Http/Controllers/MataKuliahController.php:13
 * @route '/mata-kuliah'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mata-kuliah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MataKuliahController::index
 * @see app/Http/Controllers/MataKuliahController.php:13
 * @route '/mata-kuliah'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MataKuliahController::index
 * @see app/Http/Controllers/MataKuliahController.php:13
 * @route '/mata-kuliah'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MataKuliahController::index
 * @see app/Http/Controllers/MataKuliahController.php:13
 * @route '/mata-kuliah'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MataKuliahController::create
 * @see app/Http/Controllers/MataKuliahController.php:24
 * @route '/mata-kuliah/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/mata-kuliah/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MataKuliahController::create
 * @see app/Http/Controllers/MataKuliahController.php:24
 * @route '/mata-kuliah/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MataKuliahController::create
 * @see app/Http/Controllers/MataKuliahController.php:24
 * @route '/mata-kuliah/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MataKuliahController::create
 * @see app/Http/Controllers/MataKuliahController.php:24
 * @route '/mata-kuliah/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MataKuliahController::store
 * @see app/Http/Controllers/MataKuliahController.php:36
 * @route '/mata-kuliah'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/mata-kuliah',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MataKuliahController::store
 * @see app/Http/Controllers/MataKuliahController.php:36
 * @route '/mata-kuliah'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MataKuliahController::store
 * @see app/Http/Controllers/MataKuliahController.php:36
 * @route '/mata-kuliah'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MataKuliahController::show
 * @see app/Http/Controllers/MataKuliahController.php:0
 * @route '/mata-kuliah/{mata_kuliah}'
 */
export const show = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/mata-kuliah/{mata_kuliah}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MataKuliahController::show
 * @see app/Http/Controllers/MataKuliahController.php:0
 * @route '/mata-kuliah/{mata_kuliah}'
 */
show.url = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mata_kuliah: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    mata_kuliah: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mata_kuliah: args.mata_kuliah,
                }

    return show.definition.url
            .replace('{mata_kuliah}', parsedArgs.mata_kuliah.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MataKuliahController::show
 * @see app/Http/Controllers/MataKuliahController.php:0
 * @route '/mata-kuliah/{mata_kuliah}'
 */
show.get = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MataKuliahController::show
 * @see app/Http/Controllers/MataKuliahController.php:0
 * @route '/mata-kuliah/{mata_kuliah}'
 */
show.head = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MataKuliahController::edit
 * @see app/Http/Controllers/MataKuliahController.php:55
 * @route '/mata-kuliah/{mata_kuliah}/edit'
 */
export const edit = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/mata-kuliah/{mata_kuliah}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MataKuliahController::edit
 * @see app/Http/Controllers/MataKuliahController.php:55
 * @route '/mata-kuliah/{mata_kuliah}/edit'
 */
edit.url = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mata_kuliah: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    mata_kuliah: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mata_kuliah: args.mata_kuliah,
                }

    return edit.definition.url
            .replace('{mata_kuliah}', parsedArgs.mata_kuliah.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MataKuliahController::edit
 * @see app/Http/Controllers/MataKuliahController.php:55
 * @route '/mata-kuliah/{mata_kuliah}/edit'
 */
edit.get = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MataKuliahController::edit
 * @see app/Http/Controllers/MataKuliahController.php:55
 * @route '/mata-kuliah/{mata_kuliah}/edit'
 */
edit.head = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MataKuliahController::update
 * @see app/Http/Controllers/MataKuliahController.php:68
 * @route '/mata-kuliah/{mata_kuliah}'
 */
export const update = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/mata-kuliah/{mata_kuliah}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MataKuliahController::update
 * @see app/Http/Controllers/MataKuliahController.php:68
 * @route '/mata-kuliah/{mata_kuliah}'
 */
update.url = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mata_kuliah: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    mata_kuliah: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mata_kuliah: args.mata_kuliah,
                }

    return update.definition.url
            .replace('{mata_kuliah}', parsedArgs.mata_kuliah.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MataKuliahController::update
 * @see app/Http/Controllers/MataKuliahController.php:68
 * @route '/mata-kuliah/{mata_kuliah}'
 */
update.put = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\MataKuliahController::update
 * @see app/Http/Controllers/MataKuliahController.php:68
 * @route '/mata-kuliah/{mata_kuliah}'
 */
update.patch = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MataKuliahController::destroy
 * @see app/Http/Controllers/MataKuliahController.php:87
 * @route '/mata-kuliah/{mata_kuliah}'
 */
export const destroy = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/mata-kuliah/{mata_kuliah}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MataKuliahController::destroy
 * @see app/Http/Controllers/MataKuliahController.php:87
 * @route '/mata-kuliah/{mata_kuliah}'
 */
destroy.url = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mata_kuliah: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    mata_kuliah: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mata_kuliah: args.mata_kuliah,
                }

    return destroy.definition.url
            .replace('{mata_kuliah}', parsedArgs.mata_kuliah.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MataKuliahController::destroy
 * @see app/Http/Controllers/MataKuliahController.php:87
 * @route '/mata-kuliah/{mata_kuliah}'
 */
destroy.delete = (args: { mata_kuliah: string | number } | [mata_kuliah: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const MataKuliahController = { index, create, store, show, edit, update, destroy }

export default MataKuliahController