import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SemesterController::index
 * @see app/Http/Controllers/SemesterController.php:13
 * @route '/semester'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/semester',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SemesterController::index
 * @see app/Http/Controllers/SemesterController.php:13
 * @route '/semester'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SemesterController::index
 * @see app/Http/Controllers/SemesterController.php:13
 * @route '/semester'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SemesterController::index
 * @see app/Http/Controllers/SemesterController.php:13
 * @route '/semester'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SemesterController::create
 * @see app/Http/Controllers/SemesterController.php:28
 * @route '/semester/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/semester/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SemesterController::create
 * @see app/Http/Controllers/SemesterController.php:28
 * @route '/semester/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SemesterController::create
 * @see app/Http/Controllers/SemesterController.php:28
 * @route '/semester/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SemesterController::create
 * @see app/Http/Controllers/SemesterController.php:28
 * @route '/semester/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SemesterController::store
 * @see app/Http/Controllers/SemesterController.php:42
 * @route '/semester'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/semester',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SemesterController::store
 * @see app/Http/Controllers/SemesterController.php:42
 * @route '/semester'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SemesterController::store
 * @see app/Http/Controllers/SemesterController.php:42
 * @route '/semester'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SemesterController::show
 * @see app/Http/Controllers/SemesterController.php:0
 * @route '/semester/{semester}'
 */
export const show = (args: { semester: string | number } | [semester: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/semester/{semester}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SemesterController::show
 * @see app/Http/Controllers/SemesterController.php:0
 * @route '/semester/{semester}'
 */
show.url = (args: { semester: string | number } | [semester: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { semester: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    semester: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        semester: args.semester,
                }

    return show.definition.url
            .replace('{semester}', parsedArgs.semester.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SemesterController::show
 * @see app/Http/Controllers/SemesterController.php:0
 * @route '/semester/{semester}'
 */
show.get = (args: { semester: string | number } | [semester: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SemesterController::show
 * @see app/Http/Controllers/SemesterController.php:0
 * @route '/semester/{semester}'
 */
show.head = (args: { semester: string | number } | [semester: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SemesterController::edit
 * @see app/Http/Controllers/SemesterController.php:68
 * @route '/semester/{semester}/edit'
 */
export const edit = (args: { semester: number | { id: number } } | [semester: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/semester/{semester}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SemesterController::edit
 * @see app/Http/Controllers/SemesterController.php:68
 * @route '/semester/{semester}/edit'
 */
edit.url = (args: { semester: number | { id: number } } | [semester: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { semester: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { semester: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    semester: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        semester: typeof args.semester === 'object'
                ? args.semester.id
                : args.semester,
                }

    return edit.definition.url
            .replace('{semester}', parsedArgs.semester.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SemesterController::edit
 * @see app/Http/Controllers/SemesterController.php:68
 * @route '/semester/{semester}/edit'
 */
edit.get = (args: { semester: number | { id: number } } | [semester: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SemesterController::edit
 * @see app/Http/Controllers/SemesterController.php:68
 * @route '/semester/{semester}/edit'
 */
edit.head = (args: { semester: number | { id: number } } | [semester: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SemesterController::update
 * @see app/Http/Controllers/SemesterController.php:84
 * @route '/semester/{semester}'
 */
export const update = (args: { semester: number | { id: number } } | [semester: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/semester/{semester}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\SemesterController::update
 * @see app/Http/Controllers/SemesterController.php:84
 * @route '/semester/{semester}'
 */
update.url = (args: { semester: number | { id: number } } | [semester: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { semester: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { semester: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    semester: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        semester: typeof args.semester === 'object'
                ? args.semester.id
                : args.semester,
                }

    return update.definition.url
            .replace('{semester}', parsedArgs.semester.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SemesterController::update
 * @see app/Http/Controllers/SemesterController.php:84
 * @route '/semester/{semester}'
 */
update.put = (args: { semester: number | { id: number } } | [semester: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\SemesterController::update
 * @see app/Http/Controllers/SemesterController.php:84
 * @route '/semester/{semester}'
 */
update.patch = (args: { semester: number | { id: number } } | [semester: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\SemesterController::destroy
 * @see app/Http/Controllers/SemesterController.php:112
 * @route '/semester/{semester}'
 */
export const destroy = (args: { semester: number | { id: number } } | [semester: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/semester/{semester}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SemesterController::destroy
 * @see app/Http/Controllers/SemesterController.php:112
 * @route '/semester/{semester}'
 */
destroy.url = (args: { semester: number | { id: number } } | [semester: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { semester: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { semester: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    semester: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        semester: typeof args.semester === 'object'
                ? args.semester.id
                : args.semester,
                }

    return destroy.definition.url
            .replace('{semester}', parsedArgs.semester.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SemesterController::destroy
 * @see app/Http/Controllers/SemesterController.php:112
 * @route '/semester/{semester}'
 */
destroy.delete = (args: { semester: number | { id: number } } | [semester: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const SemesterController = { index, create, store, show, edit, update, destroy }

export default SemesterController