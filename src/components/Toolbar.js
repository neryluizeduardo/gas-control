import Link from 'next/link';

export default function Toolbar() {
    return (
        <div className="toolbar">
            <div className="title"><Link className='homeLink' href="/">Gas-Control</Link></div>
            <div className="buttons">
                <Link className="button" type='button' href="/veiculos">Veículos</Link>
                <Link className="button" type='button' href="/consumo">Consumo</Link>
            </div>
        </div>
    )
}