import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'
import dayjs from 'dayjs';
import Toolbar from '@/components/Toolbar';

dayjs.locale('pt-br')

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const insertConsumo = (consumo, mutate) => {
    mutate('/api/consumo', async items => {
        let result = await fetch('/api/consumo', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(consumo)
        })

        let itemInserido = await result.json();
        items.push(itemInserido)
        return items
    })
}

const updateConsumo = (consumo, mutate) => {
    mutate('/api/consumo', async items => {
        await fetch('/api/consumo', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(consumo)
        })

        let indexAtualizado = items.findIndex((item) => item.id === consumo.id)
        items[indexAtualizado] = consumo
        return items
    })
}

const removeConsumo = (consumoId, mutate) => {
    mutate('/api/consumo', async items => {
        let URL = '/api/consumo?' + new URLSearchParams({
            id: consumoId
        })

        await fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let indexRemovido = items.findIndex((item) => item.id === consumoId)
        items.splice(indexRemovido, 1)
        return items
    })
}

const UIActions = {
    salvar: (actions) => {
        actions.event.stopPropagation();
        if (actions.consumo.id === undefined) {
            insertConsumo(actions.consumo, actions.mutate)
        } else {
            updateConsumo(actions.consumo, actions.mutate)
        }
        actions.clean()
        actions.changeButtons(true, false, false, false)
    },
    excluir: (actions) => {
        actions.event.stopPropagation()
        if (actions.consumo.id !== undefined) {
            let confirmado = confirm(`Todos os dados serão apagados.`)
            if (confirmado) {
                removeConsumo(actions.consumo.id, actions.mutate)
                actions.clean()
                actions.changeButtons(true, false, false, false)
            }
        } else {
            alert("Selecione um item para excluir.")
        }
    }
}

export default function Consumo() {
    const [consumoData, setConsumoData] = useState(dayjs(Date()).format('YYYY-MM-DD'))
    const [odometro, setOdometro] = useState(0)
    const [quantidade, setQuantidade] = useState(0)
    const [valorUnitario, setValorUnitario] = useState(0)
    const [total, setTotal] = useState(0)
    const [veiculoId, setVeiculoId] = useState(0)
    const [objSelecionado, setObjSelecionado] = useState({})
    const [salvarBtn, setSalvarBtn] = useState(false)
    const [excluirBtn, setExcluirBtn] = useState(false)
    const [novoBtn, setNovoBtn] = useState(true)
    const [cancelarBtn, setCancelarBtn] = useState(false)

    const { mutate } = useSWRConfig()
    const { data, error } = useSWR('/api/consumo', fetcher, { refreshInterval: 100 })
    
    if (error) return <div>Falha no carregamento</div>

    const clean = () => {
        setObjSelecionado({})
        setConsumoData(dayjs(Date()).format('YYYY-MM-DD'))
        setOdometro(0)
        setQuantidade(0)
        setValorUnitario(0)
        setTotal(0)
        setVeiculoId(0)
    }

    const changeButtons = (novo, cancelar, excluir, salvar) => {
        setSalvarBtn(salvar)
        setExcluirBtn(excluir)
        setNovoBtn(novo)
        setCancelarBtn(cancelar)
    }


    const recalculaTotal = () => {
        setTotal(quantidade * valorUnitario)
    }

    return (<>

        <Toolbar />

        <div className='container'>

            <div className="button-container">
                <div className="left-buttons">
                    {
                        novoBtn &&
                        <button className='btn-blue' onClick={() => {
                            changeButtons(false, true, false, true)
                            clean()
                        }}>Novo</button>
                    }
                    {
                        cancelarBtn &&
                        <button onClick={() => {
                            changeButtons(true, false, false, false)
                            clean()
                        }}>Cancelar</button>
                    }
                </div>
                <div className="right-buttons">
                    {
                        excluirBtn &&
                        <button className='btn-red' type="button" onClick={(e) => UIActions.excluir({
                            event: e,
                            consumo: objSelecionado,
                            clean: clean,
                            mutate: mutate,
                            changeButtons: changeButtons
                        })}>Excluir</button>
                    }
                    {
                        salvarBtn &&

                        <button className='btn-green' type="submit" onClick={(e) => UIActions.salvar({
                            event: e,
                            consumo: {
                                ...objSelecionado,
                                data: new Date(consumoData),
                                odometro: parseInt(odometro),
                                quantidade: parseFloat(quantidade),
                                valorUnitario: parseFloat(valorUnitario),
                                total: parseFloat(total),
                                veiculoId: parseInt(veiculoId)
                            },
                            clean: clean,
                            mutate: mutate,
                            changeButtons: changeButtons
                        })}>Salvar</button>
                    }
                </div>
            </div>

            {
                salvarBtn &&
                <div className='card'>
                    <div className='card-content'>


                        <div className='form'>
                            <div className="form-group">
                                <label htmlFor="data">Data:</label>
                                <input className='input' required value={consumoData} onChange={(e) => setConsumoData(e.target.value)} type="date" id="data" name="data" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="odometro">Odometro:</label>
                                <input className='input' required value={odometro} onChange={(e) => setOdometro(e.target.value)} type="number" id="odometro" name="odometro" />
                            </div>
                        </div>

                        <div className='form'>
                            <div className="form-group">
                                <label htmlFor="quantidade">Quantidade:</label>
                                <input className='input' required value={quantidade} onChange={(e) => {
                                    setQuantidade(e.target.value)
                                    recalculaTotal()
                                }} type="number" id="quantidade" name="quantidade" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="valorUnitario">Valor Unitário:</label>
                                <input className='input' required value={valorUnitario} onChange={(e) => {
                                    setValorUnitario(e.target.value)
                                    recalculaTotal()
                                }} type="number" id="valorUnitario" name="valorUnitario" />
                            </div>
                        </div>

                        <div className='form'>
                            <div className="form-group">
                                <label htmlFor="total">Total:</label>
                                <input disabled className='input' required value={total} onChange={(e) => setTotal(e.target.value)} type="number" id="total" name="total" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="veiculoId">VeiculoId:</label>
                                <input className='input' required value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)} type="number" id="veiculoId" name="veiculoId" />
                            </div>
                        </div>

                    </div>
                </div>

            }

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
                                                return (<tr key={consumo.id} onClick={() => {
                                                    setConsumoData(dayjs(consumo.data).add(1, 'day').format('YYYY-MM-DD'))
                                                    setOdometro(consumo.odometro)
                                                    setQuantidade(consumo.quantidade)
                                                    setValorUnitario(consumo.valorUnitario)
                                                    setTotal(consumo.total)
                                                    setVeiculoId(consumo.veiculoId)
                                                    setObjSelecionado(consumo)
                                                    changeButtons(false, true, true, true)
                                                }}>
                                                    <td>{consumo.id}</td>
                                                    <td>{dayjs(consumo.data).add(1, 'day').format('DD/MM/YYYY')}</td>
                                                    <td>{consumo.odometro}</td>
                                                    <td>{consumo.quantidade}</td>
                                                    <td>{consumo.valorUnitario}</td>
                                                    <td>{consumo.total}</td>
                                                    <td>{consumo.veiculoId}</td>
                                                </tr>)
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