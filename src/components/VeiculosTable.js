export const revalidate = 5;

const getVeiculos = async () => {
    const response = await fetch('http://localhost:3000/api/veiculos', {
        next: { revalidate: 5 },
        method: "GET",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    return data;
}

export default async function VeiculosTable() {
    const veiculos = await getVeiculos();

    return (
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
                                veiculos.map((veiculo) => {
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
    )
}