import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\JadwalMasterController::index
 * @see app/Http/Controllers/JadwalMasterController.php:16
 * @route '/jadwal-master'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/jadwal-master',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JadwalMasterController::index
 * @see app/Http/Controllers/JadwalMasterController.php:16
 * @route '/jadwal-master'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JadwalMasterController::index
 * @see app/Http/Controllers/JadwalMasterController.php:16
 * @route '/jadwal-master'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\JadwalMasterController::index
 * @see app/Http/Controllers/JadwalMasterController.php:16
 * @route '/jadwal-master'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JadwalMasterController::create
 * @see app/Http/Controllers/JadwalMasterController.php:75
 * @route '/jadwal-master/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/jadwal-master/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JadwalMasterController::create
 * @see app/Http/Controllers/JadwalMasterController.php:75
 * @route '/jadwal-master/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JadwalMasterController::create
 * @see app/Http/Controllers/JadwalMasterController.php:75
 * @route '/jadwal-master/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\JadwalMasterController::create
 * @see app/Http/Controllers/JadwalMasterController.php:75
 * @route '/jadwal-master/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JadwalMasterController::store
 * @see app/Http/Controllers/JadwalMasterController.php:86
 * @route '/jadwal-master'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/jadwal-master',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\JadwalMasterController::store
 * @see app/Http/Controllers/JadwalMasterController.php:86
 * @route '/jadwal-master'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JadwalMasterController::store
 * @see app/Http/Controllers/JadwalMasterController.php:86
 * @route '/jadwal-master'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JadwalMasterController::show
 * @see app/Http/Controllers/JadwalMasterController.php:0
 * @route '/jadwal-master/{jadwal_master}'
 */
export const show = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/jadwal-master/{jadwal_master}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JadwalMasterController::show
 * @see app/Http/Controllers/JadwalMasterController.php:0
 * @route '/jadwal-master/{jadwal_master}'
 */
show.url = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { jadwal_master: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    jadwal_master: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        jadwal_master: args.jadwal_master,
                }

    return show.definition.url
            .replace('{jadwal_master}', parsedArgs.jadwal_master.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JadwalMasterController::show
 * @see app/Http/Controllers/JadwalMasterController.php:0
 * @route '/jadwal-master/{jadwal_master}'
 */
show.get = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\JadwalMasterController::show
 * @see app/Http/Controllers/JadwalMasterController.php:0
 * @route '/jadwal-master/{jadwal_master}'
 */
show.head = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JadwalMasterController::edit
 * @see app/Http/Controllers/JadwalMasterController.php:104
 * @route '/jadwal-master/{jadwal_master}/edit'
 */
export const edit = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/jadwal-master/{jadwal_master}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JadwalMasterController::edit
 * @see app/Http/Controllers/JadwalMasterController.php:104
 * @route '/jadwal-master/{jadwal_master}/edit'
 */
edit.url = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { jadwal_master: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    jadwal_master: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        jadwal_master: args.jadwal_master,
                }

    return edit.definition.url
            .replace('{jadwal_master}', parsedArgs.jadwal_master.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JadwalMasterController::edit
 * @see app/Http/Controllers/JadwalMasterController.php:104
 * @route '/jadwal-master/{jadwal_master}/edit'
 */
edit.get = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\JadwalMasterController::edit
 * @see app/Http/Controllers/JadwalMasterController.php:104
 * @route '/jadwal-master/{jadwal_master}/edit'
 */
edit.head = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JadwalMasterController::update
 * @see app/Http/Controllers/JadwalMasterController.php:141
 * @route '/jadwal-master/{jadwal_master}'
 */
export const update = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/jadwal-master/{jadwal_master}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\JadwalMasterController::update
 * @see app/Http/Controllers/JadwalMasterController.php:141
 * @route '/jadwal-master/{jadwal_master}'
 */
update.url = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { jadwal_master: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    jadwal_master: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        jadwal_master: args.jadwal_master,
                }

    return update.definition.url
            .replace('{jadwal_master}', parsedArgs.jadwal_master.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JadwalMasterController::update
 * @see app/Http/Controllers/JadwalMasterController.php:141
 * @route '/jadwal-master/{jadwal_master}'
 */
update.put = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\JadwalMasterController::update
 * @see app/Http/Controllers/JadwalMasterController.php:141
 * @route '/jadwal-master/{jadwal_master}'
 */
update.patch = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\JadwalMasterController::destroy
 * @see app/Http/Controllers/JadwalMasterController.php:159
 * @route '/jadwal-master/{jadwal_master}'
 */
export const destroy = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/jadwal-master/{jadwal_master}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\JadwalMasterController::destroy
 * @see app/Http/Controllers/JadwalMasterController.php:159
 * @route '/jadwal-master/{jadwal_master}'
 */
destroy.url = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { jadwal_master: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    jadwal_master: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        jadwal_master: args.jadwal_master,
                }

    return destroy.definition.url
            .replace('{jadwal_master}', parsedArgs.jadwal_master.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JadwalMasterController::destroy
 * @see app/Http/Controllers/JadwalMasterController.php:159
 * @route '/jadwal-master/{jadwal_master}'
 */
destroy.delete = (args: { jadwal_master: string | number } | [jadwal_master: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const JadwalMasterController = { index, create, store, show, edit, update, destroy }

export default JadwalMasterController