
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const insertVeiculo = (veiculo, mutate) => {
    mutate('/api/veiculos', async veiculos => {
        let result = await fetch('/api/veiculos', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(veiculo)
        })

        let veiculoInserido = await result.json();
        veiculos.push(veiculoInserido)
        return veiculos
    })
}

const updateVeiculo = (veiculo, mutate) => {
    mutate('/api/veiculos', async veiculos => {
        await fetch('/api/veiculos', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(veiculo)
        })

        let indexAtualizado = veiculos.findIndex((item) => item.id === veiculo.id)
        veiculos[indexAtualizado] = veiculo
        return veiculos
    })
}

const removeVeiculo = (veiculoId, mutate) => {
    mutate('/api/veiculos', async veiculos => {
        let URL = '/api/veiculos?' + new URLSearchParams({
            id: veiculoId
        })

        await fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let indexRemovido = veiculos.findIndex((item) => item.id === veiculoId)
        veiculos.splice(indexRemovido, 1)
        return veiculos
    })
}

const UIActions = {
    salvar: (actions) => {
        actions.event.stopPropagation();
        if (actions.veiculo.id === undefined) {
            if (actions.veiculo.descricao && actions.veiculo.placa !== "") {
                insertVeiculo(actions.veiculo, actions.mutate)
            } else {
                alert("Por favor, preencha a descrição e placa do veículo")
            }
        } else {
            updateVeiculo(actions.veiculo, actions.mutate)
        }
        actions.clean()
        actions.changeButtons(true, true)
    },
    excluir: (actions) => {
        actions.event.stopPropagation()
        if (actions.veiculo.id !== undefined) {
            let confirmado = confirm(`Todos os dados de ${actions.veiculo.descricao} serão apagados.`)
            if (confirmado) {
                removeVeiculo(actions.veiculo.id, actions.mutate)
                actions.clean()
                actions.changeButtons(true, true)
            }
        } else {
            alert("Selecione um item para excluir.")
        }
    }
}

export default function Veiculos() {
    const [descricao, setDescricao] = useState('');
    const [placa, setPlaca] = useState('');
    const [objSelecionado, setObjSelecionado] = useState({})
    const [salvarBtn, setSalvarBtn] = useState(true)
    const [excluirBtn, setExcluirBtn] = useState(true)

    const { mutate } = useSWRConfig()
    const { data, error } = useSWR('/api/veiculos', fetcher, { refreshInterval: 100 })

    if (error) return <div>Failed to Load</div>

    const clean = () => {
        setObjSelecionado({})
        setDescricao("")
        setPlaca("")
    }

    const changeButtons = (salvar, excluir) => {
        setSalvarBtn(salvar)
        setExcluirBtn(excluir)
    }

    return (<>
        <div className="container">
            <div className="card">
                <div className="card-content">
                    <div className='form'>
                        <div className="form-group">
                            <label htmlFor="descricao">Descrição:</label>
                            <input className='input' required value={descricao} onChange={(e) => setDescricao(e.target.value)} type="text" id="descricao" name="descricao" placeholder="Digite a descrição" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="placa">Placa:</label>
                            <input className='input' required value={placa} onChange={(e) => setPlaca(e.target.value)} type="text" id="placa" name="placa" placeholder="Digite a placa" />
                        </div>

                        <div className='button-list'>
                            <button className='btn' onClick={() => {
                                changeButtons(true, false)
                                clean()
                            }}>Novo</button>
                            <button disabled={salvarBtn} type="button" className='btn' onClick={(e) => UIActions.excluir({
                                event: e,
                                veiculo: objSelecionado,
                                clean: clean,
                                mutate: mutate,
                                changeButtons: changeButtons
                            })}>Excluir</button>
                            <button disabled={excluirBtn} type="submit" onClick={(e) => UIActions.salvar({
                                event: e,
                                veiculo: {
                                    ...objSelecionado,
                                    descricao: descricao,
                                    placa: placa
                                },
                                clean: clean,
                                mutate: mutate,
                                changeButtons: changeButtons
                            })}>Salvar</button>
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
                        <div className="card">
                            <div className="card-content">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Descrição</th>
                                            <th>Placa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((veiculo) => {
                                                return (
                                                    <tr key={veiculo.id} onClick={() => {
                                                        setDescricao(veiculo.descricao)
                                                        setPlaca(veiculo.placa)
                                                        setObjSelecionado(veiculo)
                                                        changeButtons(false, false)
                                                    }}>
                                                        <td>{veiculo.id}</td>
                                                        <td>{veiculo.descricao}</td>
                                                        <td>{veiculo.placa}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
            }
        </div >
    </>)
}