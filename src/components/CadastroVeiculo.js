"use client";

import { useState, Suspense } from 'react';

export default function CadastroVeiculo({ children }) {
    const [descricao, setDescricao] = useState('');
    const [placa, setPlaca] = useState('');

    const cadastrarNovo = async (e) => {
        e.preventDefault();

        const veiculo = {
            descricao,
            placa
        }

        console.log(JSON.stringify(veiculo))

        const response = await fetch('http://localhost:3000/api/veiculos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(veiculo)
        })

        const data = await response.json();
        console.log(data)
    }

    return (
        <>
            <div className="container">
                <div className="card">
                    <div className="card-content">
                        <form onSubmit={cadastrarNovo}>
                            <div className="form-group">
                                <label htmlFor="descricao">Descrição:</label>
                                <input value={descricao} onChange={(e) => setDescricao(e.target.value)} type="text" id="descricao" name="descricao" placeholder="Digite a descrição" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="placa">Placa:</label>
                                <input value={placa} onChange={(e) => setPlaca(e.target.value)} type="text" id="placa" name="placa" placeholder="Digite a placa" />
                            </div>

                            <button type="button" className="delete-btn">Excluir</button>
                            <button type="submit">Salvar</button>
                        </form>
                    </div>
                </div>
                <Suspense fallback={<div>Carregando...</div>}>
                    {children}
                </Suspense>
            </div>
        </>
    )
}
