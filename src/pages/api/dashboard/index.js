import { handleGet } from '@/modules/service/DashboardService.js'

export default async function handler(req, res) {
    const data = await handleGet()
    res.status(200).json(data)
    res.end()
}