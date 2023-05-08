import Toolbar from "@/components/Toolbar"
import useSWR, { useSWRConfig } from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home() {
    const { data, error } = useSWR('/api/dashboard', fetcher, { refreshInterval: 100 })

    console.log(data)

    return (
        <>
            <Toolbar />
            <div>Olá Mundo 2</div>
            {
                JSON.stringify(data)
            }
        </>
    )
}