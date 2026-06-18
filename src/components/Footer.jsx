export default function Footer() {
  return (
    <footer className="border-t border-marca-beigeOscuro bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-500">
        <p>UniShop - Tienda en linea academica</p>
        <p className="mt-1">Proyecto universitario - {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
