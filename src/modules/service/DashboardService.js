import { getAll } from "@/modules/data/DashboardDAO.js"

const handleGet = async function () {
    const result = {
        data: await getAll()
    }

    return result
}

export { handleGet }