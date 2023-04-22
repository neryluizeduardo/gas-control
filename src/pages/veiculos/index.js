
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

export default function Veiculos() {
    const [descricao, setDescricao] = useState('');
    const [placa, setPlaca] = useState('');

    const { mutate } = useSWRConfig()
    const { data, error } = useSWR('/api/veiculos', fetcher)

    if (error) return <div>Failed to Load</div>

    return (<>
        <div className="container">
            <div className="card">
                <div className="card-content">
                    <div className='form'>
                        <div className="form-group">
                            <label htmlFor="descricao">Descrição:</label>
                            <input required value={descricao} onChange={(e) => setDescricao(e.target.value)} type="text" id="descricao" name="descricao" placeholder="Digite a descrição" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="placa">Placa:</label>
                            <input required value={placa} onChange={(e) => setPlaca(e.target.value)} type="text" id="placa" name="placa" placeholder="Digite a placa" />
                        </div>

                        <button type="button" className="delete-btn">Excluir</button>
                        <button type="submit" onClick={(e) => {
                            e.stopPropagation()
                            let v = {
                                descricao: descricao,
                                placa: placa
                            }
                            insertVeiculo(v, mutate)
                        }}>Salvar</button>
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
                                                    <tr key={veiculo.id}>
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