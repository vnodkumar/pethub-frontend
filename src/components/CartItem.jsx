import { Link } from "react-router-dom";

export default function CartItem({
    item,
    onRemove,
    onQuantityChange,
    updating,
    removing,
    quantityError,
    removeError,
}) {
    return (
        <article>
            <div className="flex flex-wrap items-center gap-4">
                <Link className="flex min-w-0 flex-1 items-center gap-4" to={`/products/${item.productId}`}>
                    <img
                        className="size-24 rounded-md object-cover"
                        src={item.imagePath}
                        alt={item.productName}
                    />
                    <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-slate-900">{item.productName}</h2>
                        <p className="text-sm text-slate-600">${Number(item.price).toFixed(2)} each</p>
                    </div>
                </Link>
                <div className="flex shrink-0 flex-col items-end gap-2">
                    <p className="font-semibold text-slate-900">
                        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            className="size-8 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            type="button"
                            aria-label={`Decrease ${item.productName} quantity`}
                            onClick={() => onQuantityChange(item.id, Number(item.quantity) - 1)}
                            disabled={updating || Number(item.quantity) <= 1}
                        >
                            −
                        </button>
                        <span className="min-w-5 text-center text-sm text-slate-700" aria-live="polite">
                            {item.quantity}
                        </span>
                        <button
                            className="size-8 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            type="button"
                            aria-label={`Increase ${item.productName} quantity`}
                            onClick={() => onQuantityChange(item.id, Number(item.quantity) + 1)}
                            disabled={updating}
                        >
                            +
                        </button>
                    </div>
                </div>
                <button
                    className="rounded border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                    type="button"
                    onClick={() => onRemove(item.id)}
                    disabled={removing || updating}
                >
                    {removing ? "Removing..." : "Remove"}
                </button>
            </div>
            {quantityError && <p className="mt-2 text-sm text-red-700" role="alert">{quantityError}</p>}
            {removeError && <p className="mt-2 text-sm text-red-700" role="alert">{removeError}</p>}
        </article>
    );
}