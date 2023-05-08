import { Prisma, PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const getAll = async () => {
    const result = await db.$queryRaw(
        Prisma.sql`
       SELECT V.id, 
              V.descricao, 
              ROUND((((SELECT MAX(odometro) FROM Consumo WHERE veiculoId = V.id) - (SELECT MIN(odometro) FROM Consumo WHERE veiculoId = V.id)) / COUNT(C.id)) / (SELECT quantidade FROM Consumo WHERE veiculoId = V.id ORDER BY odometro DESC LIMIT 1), 4) AS kml,
              ROUND(AVG(C.valorUnitario), 4) pml,
              ROUND((SELECT valorUnitario FROM Consumo WHERE veiculoId = V.id ORDER BY odometro DESC LIMIT 1), 4) valorUltAbast
        FROM Consumo C
        JOIN Veiculo V
          ON V.id = C.veiculoId 
    GROUP BY V.id, V.descricao`
    )

    return result
}

export { getAll }