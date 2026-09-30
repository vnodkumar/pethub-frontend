
import { Link } from "react-router-dom";

export default function ProductCard({product}){

    return(
        <Link className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 hover:shadow-md" to={`/products/${product.id}`}>
            <div className="space-y-2 text-sm text-slate-600" >
                <p><span className="font-semibold text-slate-900">Id:</span> {product.id}</p>
                <p><span className="font-semibold text-slate-900">Name:</span> {product.name}</p>
                <p><span className="font-semibold text-slate-900">Category:</span> {product.category}</p>
                <p className="break-words"><span className="font-semibold text-slate-900">ImagePath:</span> {product.imagePath}</p>
                <p className="pt-2 text-base font-semibold text-slate-900">Price: ${product.price}</p>
            </div>
        </Link>
    )
}