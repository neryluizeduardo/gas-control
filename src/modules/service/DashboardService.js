import { getAll } from "@/modules/data/DashboardDAO.js"

const handleGet = async function () {
    const data = await getAll()
    return data
}

export { handleGet }