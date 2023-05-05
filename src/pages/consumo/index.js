import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const insertConsumo = (consumo, mutate) => {

}

const updateConsumo = (consumo, mutate) => {

}

const removeConsumo = (consumoId, mutate) => {

}

const UIActions = {
    salvar: (actions) => { },
    excluir: (actions) => { }
}

export default function Consumo() {
    const [consumoData, setConsumoData] = useState(new Date())
    const [odometro, setOdometro] = useState(0)
    const [quantidade, setQuantidade] = useState(0)
    const [valorUnitario, setValorUnitario] = useState(0)
    const [total, setTotal] = useState(0)
    const [veiculoId, setVeiculoId] = useState(0)

    const { mutate } = useSWRConfig()
    const { data, error } = useSWR('/api/veiculos', fetcher, { refreshInterval: 100 })

    if (error) return <div>Falha no carregamento</div>

    return (<>
        <div className='container'>
            <div className='card'>
                <div className='card-content'>
                    <div className='form'>
                        <div className="form-group">
                            <label htmlFor="data">Data:</label>
                            <input required value={consumoData} onChange={(e) => setConsumoData(e.target.value)} type="date" id="data" name="data" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="odometro">Odometro:</label>
                            <input required value={odometro} onChange={(e) => setOdometro(e.target.value)} type="number" id="odometro" name="odometro" />
                        </div>
                    </div>
                </div>
            </div>

            {
                data === undefined ?
                    <>
                        <h4>Carregando...</h4>
                    </>
                    :
                    <>
                        <div className='card'>
                            <div className='card-content'>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Data</th>
                                            <th>Odometro</th>
                                            <th>Quantidade</th>
                                            <th>Valor Unitário</th>
                                            <th>Total</th>
                                            <th>VeiculoId</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((consumo) => {
                                                <tr key={consumo.id}>
                                                    <td>{consumo.id}</td>
                                                    <td>{consumo.data}</td>
                                                    <td>{consumo.odometro}</td>
                                                    <td>{consumo.quantidade}</td>
                                                    <td>{consumo.valorUnitario}</td>
                                                    <td>{consumo.total}</td>
                                                    <td>{consumo.veiculoId}</td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
            }
        </div>
    </>)
}