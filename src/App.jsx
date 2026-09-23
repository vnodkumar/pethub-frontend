export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6">
      <div className="rounded-2xl bg-white p-8 shadow-xl max-w-sm text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          🐾 Pet Care App
        </h1>
        <p className="mt-2 text-slate-600">
          Tailwind CSS is successfully configured!
        </p>
        <button className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition">
          Shop Now
        </button>
      </div>
    </div>
  )
}