export default function SlowServerBanner({ visible }) {
    if (!visible) {
        return null;
    }

    return (
        <div
            className="fixed inset-x-0 top-0 z-50 bg-amber-100 px-4 py-3 text-center text-sm font-medium text-amber-950 shadow-md"
            role="status"
            aria-live="polite"
        >
            The free server is waking up. This can take up to a minute.
        </div>
    );
}
