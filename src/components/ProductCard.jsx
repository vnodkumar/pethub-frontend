
import { Link } from "react-router-dom";

export default function ProductCard({product}){
    return(
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 hover:shadow-md">
            <Link className="block" to={`/products/${product.id}`}>
                <img className="mb-4 h-44 w-full rounded-md object-cover" src={product.imagePath} alt={product.name} />
                <div className="space-y-2 text-sm text-slate-600" >
                    <p><span className="font-semibold text-slate-900">Id:</span> {product.id}</p>
                    <p><span className="font-semibold text-slate-900">Name:</span> {product.name}</p>
                    <p><span className="font-semibold text-slate-900">Category:</span> {product.category}</p>
                    <p className="pt-2 text-base font-semibold text-slate-900">Price: ${product.price}</p>
                </div>
            </Link>
        </article>
    )
}