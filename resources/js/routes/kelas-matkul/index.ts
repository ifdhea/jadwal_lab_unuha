import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\KelasMataKuliahController::index
 * @see app/Http/Controllers/KelasMataKuliahController.php:15
 * @route '/kelas-matkul'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kelas-matkul',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KelasMataKuliahController::index
 * @see app/Http/Controllers/KelasMataKuliahController.php:15
 * @route '/kelas-matkul'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasMataKuliahController::index
 * @see app/Http/Controllers/KelasMataKuliahController.php:15
 * @route '/kelas-matkul'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KelasMataKuliahController::index
 * @see app/Http/Controllers/KelasMataKuliahController.php:15
 * @route '/kelas-matkul'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KelasMataKuliahController::create
 * @see app/Http/Controllers/KelasMataKuliahController.php:26
 * @route '/kelas-matkul/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/kelas-matkul/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KelasMataKuliahController::create
 * @see app/Http/Controllers/KelasMataKuliahController.php:26
 * @route '/kelas-matkul/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasMataKuliahController::create
 * @see app/Http/Controllers/KelasMataKuliahController.php:26
 * @route '/kelas-matkul/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KelasMataKuliahController::create
 * @see app/Http/Controllers/KelasMataKuliahController.php:26
 * @route '/kelas-matkul/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KelasMataKuliahController::store
 * @see app/Http/Controllers/KelasMataKuliahController.php:40
 * @route '/kelas-matkul'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/kelas-matkul',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KelasMataKuliahController::store
 * @see app/Http/Controllers/KelasMataKuliahController.php:40
 * @route '/kelas-matkul'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasMataKuliahController::store
 * @see app/Http/Controllers/KelasMataKuliahController.php:40
 * @route '/kelas-matkul'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KelasMataKuliahController::show
 * @see app/Http/Controllers/KelasMataKuliahController.php:0
 * @route '/kelas-matkul/{kelas_matkul}'
 */
export const show = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/kelas-matkul/{kelas_matkul}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KelasMataKuliahController::show
 * @see app/Http/Controllers/KelasMataKuliahController.php:0
 * @route '/kelas-matkul/{kelas_matkul}'
 */
show.url = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kelas_matkul: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kelas_matkul: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kelas_matkul: args.kelas_matkul,
                }

    return show.definition.url
            .replace('{kelas_matkul}', parsedArgs.kelas_matkul.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasMataKuliahController::show
 * @see app/Http/Controllers/KelasMataKuliahController.php:0
 * @route '/kelas-matkul/{kelas_matkul}'
 */
show.get = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KelasMataKuliahController::show
 * @see app/Http/Controllers/KelasMataKuliahController.php:0
 * @route '/kelas-matkul/{kelas_matkul}'
 */
show.head = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KelasMataKuliahController::edit
 * @see app/Http/Controllers/KelasMataKuliahController.php:60
 * @route '/kelas-matkul/{kelas_matkul}/edit'
 */
export const edit = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/kelas-matkul/{kelas_matkul}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KelasMataKuliahController::edit
 * @see app/Http/Controllers/KelasMataKuliahController.php:60
 * @route '/kelas-matkul/{kelas_matkul}/edit'
 */
edit.url = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kelas_matkul: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kelas_matkul: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kelas_matkul: args.kelas_matkul,
                }

    return edit.definition.url
            .replace('{kelas_matkul}', parsedArgs.kelas_matkul.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasMataKuliahController::edit
 * @see app/Http/Controllers/KelasMataKuliahController.php:60
 * @route '/kelas-matkul/{kelas_matkul}/edit'
 */
edit.get = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KelasMataKuliahController::edit
 * @see app/Http/Controllers/KelasMataKuliahController.php:60
 * @route '/kelas-matkul/{kelas_matkul}/edit'
 */
edit.head = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KelasMataKuliahController::update
 * @see app/Http/Controllers/KelasMataKuliahController.php:76
 * @route '/kelas-matkul/{kelas_matkul}'
 */
export const update = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/kelas-matkul/{kelas_matkul}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\KelasMataKuliahController::update
 * @see app/Http/Controllers/KelasMataKuliahController.php:76
 * @route '/kelas-matkul/{kelas_matkul}'
 */
update.url = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kelas_matkul: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kelas_matkul: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kelas_matkul: args.kelas_matkul,
                }

    return update.definition.url
            .replace('{kelas_matkul}', parsedArgs.kelas_matkul.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasMataKuliahController::update
 * @see app/Http/Controllers/KelasMataKuliahController.php:76
 * @route '/kelas-matkul/{kelas_matkul}'
 */
update.put = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\KelasMataKuliahController::update
 * @see app/Http/Controllers/KelasMataKuliahController.php:76
 * @route '/kelas-matkul/{kelas_matkul}'
 */
update.patch = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\KelasMataKuliahController::destroy
 * @see app/Http/Controllers/KelasMataKuliahController.php:96
 * @route '/kelas-matkul/{kelas_matkul}'
 */
export const destroy = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/kelas-matkul/{kelas_matkul}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\KelasMataKuliahController::destroy
 * @see app/Http/Controllers/KelasMataKuliahController.php:96
 * @route '/kelas-matkul/{kelas_matkul}'
 */
destroy.url = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kelas_matkul: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kelas_matkul: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kelas_matkul: args.kelas_matkul,
                }

    return destroy.definition.url
            .replace('{kelas_matkul}', parsedArgs.kelas_matkul.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KelasMataKuliahController::destroy
 * @see app/Http/Controllers/KelasMataKuliahController.php:96
 * @route '/kelas-matkul/{kelas_matkul}'
 */
destroy.delete = (args: { kelas_matkul: string | number } | [kelas_matkul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const kelasMatkul = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default kelasMatkul