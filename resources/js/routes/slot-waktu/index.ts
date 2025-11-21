import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SlotWaktuController::index
 * @see app/Http/Controllers/SlotWaktuController.php:11
 * @route '/slot-waktu'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/slot-waktu',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SlotWaktuController::index
 * @see app/Http/Controllers/SlotWaktuController.php:11
 * @route '/slot-waktu'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SlotWaktuController::index
 * @see app/Http/Controllers/SlotWaktuController.php:11
 * @route '/slot-waktu'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SlotWaktuController::index
 * @see app/Http/Controllers/SlotWaktuController.php:11
 * @route '/slot-waktu'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SlotWaktuController::create
 * @see app/Http/Controllers/SlotWaktuController.php:22
 * @route '/slot-waktu/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/slot-waktu/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SlotWaktuController::create
 * @see app/Http/Controllers/SlotWaktuController.php:22
 * @route '/slot-waktu/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SlotWaktuController::create
 * @see app/Http/Controllers/SlotWaktuController.php:22
 * @route '/slot-waktu/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SlotWaktuController::create
 * @see app/Http/Controllers/SlotWaktuController.php:22
 * @route '/slot-waktu/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SlotWaktuController::store
 * @see app/Http/Controllers/SlotWaktuController.php:33
 * @route '/slot-waktu'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/slot-waktu',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SlotWaktuController::store
 * @see app/Http/Controllers/SlotWaktuController.php:33
 * @route '/slot-waktu'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SlotWaktuController::store
 * @see app/Http/Controllers/SlotWaktuController.php:33
 * @route '/slot-waktu'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SlotWaktuController::show
 * @see app/Http/Controllers/SlotWaktuController.php:0
 * @route '/slot-waktu/{slot_waktu}'
 */
export const show = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/slot-waktu/{slot_waktu}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SlotWaktuController::show
 * @see app/Http/Controllers/SlotWaktuController.php:0
 * @route '/slot-waktu/{slot_waktu}'
 */
show.url = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slot_waktu: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    slot_waktu: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        slot_waktu: args.slot_waktu,
                }

    return show.definition.url
            .replace('{slot_waktu}', parsedArgs.slot_waktu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SlotWaktuController::show
 * @see app/Http/Controllers/SlotWaktuController.php:0
 * @route '/slot-waktu/{slot_waktu}'
 */
show.get = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SlotWaktuController::show
 * @see app/Http/Controllers/SlotWaktuController.php:0
 * @route '/slot-waktu/{slot_waktu}'
 */
show.head = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SlotWaktuController::edit
 * @see app/Http/Controllers/SlotWaktuController.php:48
 * @route '/slot-waktu/{slot_waktu}/edit'
 */
export const edit = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/slot-waktu/{slot_waktu}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SlotWaktuController::edit
 * @see app/Http/Controllers/SlotWaktuController.php:48
 * @route '/slot-waktu/{slot_waktu}/edit'
 */
edit.url = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slot_waktu: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    slot_waktu: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        slot_waktu: args.slot_waktu,
                }

    return edit.definition.url
            .replace('{slot_waktu}', parsedArgs.slot_waktu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SlotWaktuController::edit
 * @see app/Http/Controllers/SlotWaktuController.php:48
 * @route '/slot-waktu/{slot_waktu}/edit'
 */
edit.get = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SlotWaktuController::edit
 * @see app/Http/Controllers/SlotWaktuController.php:48
 * @route '/slot-waktu/{slot_waktu}/edit'
 */
edit.head = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SlotWaktuController::update
 * @see app/Http/Controllers/SlotWaktuController.php:60
 * @route '/slot-waktu/{slot_waktu}'
 */
export const update = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/slot-waktu/{slot_waktu}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\SlotWaktuController::update
 * @see app/Http/Controllers/SlotWaktuController.php:60
 * @route '/slot-waktu/{slot_waktu}'
 */
update.url = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slot_waktu: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    slot_waktu: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        slot_waktu: args.slot_waktu,
                }

    return update.definition.url
            .replace('{slot_waktu}', parsedArgs.slot_waktu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SlotWaktuController::update
 * @see app/Http/Controllers/SlotWaktuController.php:60
 * @route '/slot-waktu/{slot_waktu}'
 */
update.put = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\SlotWaktuController::update
 * @see app/Http/Controllers/SlotWaktuController.php:60
 * @route '/slot-waktu/{slot_waktu}'
 */
update.patch = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\SlotWaktuController::destroy
 * @see app/Http/Controllers/SlotWaktuController.php:83
 * @route '/slot-waktu/{slot_waktu}'
 */
export const destroy = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/slot-waktu/{slot_waktu}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SlotWaktuController::destroy
 * @see app/Http/Controllers/SlotWaktuController.php:83
 * @route '/slot-waktu/{slot_waktu}'
 */
destroy.url = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slot_waktu: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    slot_waktu: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        slot_waktu: args.slot_waktu,
                }

    return destroy.definition.url
            .replace('{slot_waktu}', parsedArgs.slot_waktu.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SlotWaktuController::destroy
 * @see app/Http/Controllers/SlotWaktuController.php:83
 * @route '/slot-waktu/{slot_waktu}'
 */
destroy.delete = (args: { slot_waktu: string | number } | [slot_waktu: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const slotWaktu = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default slotWaktu