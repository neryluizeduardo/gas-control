import { insert, getAll, update, remove } from "@/modules/data/ConsumoDAO.js"

const handleInsert = async (params) => {
    const result = {
        status: 200,
        data: {}
    }

    try {
        result.data = await insert(params.data)
    } catch (error) {
        result.status = 500
        result.data = error.message
    }

    return result;
}

const handleGetAll = async () => {
    const result = {
        status: 200,
        data: {}
    }

    try {
        result.data = await getAll()
    } catch (error) {
        result.status = 500
        result.data = error.message
    }

    return result;
}

const handleUpdate = async (params) => {
    const result = {
        status: 200,
        data: {}
    }

    try {
        result.data = await update(params.data)
    } catch (error) {
        result.status = 500
        result.data = error.message
    }

    return result;
}

const handleRemove = async (params) => {
    const result = {
        status: 200,
        data: {}
    }

    let ID = parseInt(params.query.id)

    try {
        result.data = await remove(ID)
    } catch (error) {
        result.status = 500
        result.data = error.message
    }

    return result;
}

const acceptedMethods = {
    POST: handleInsert,
    PUT: handleUpdate,
    DELETE: handleRemove,
    GET: handleGetAll
}

const handleRequest = async (reqParams) => {
    if (acceptedMethods[reqParams.method] !== undefined) {
        let requestMetod = acceptedMethods[reqParams.method]
        return await requestMetod(reqParams)
    } else {
        return {
            status: 404,
            data: {}
        }
    }
}

export { handleRequest }