import { Link } from 'react-router-dom'

export const LogoContainer = () => {
  return (
    <Link to={"/"} className="flex items-center px-8 py-4">
      <span
        className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg"
        style={{ WebkitTextStroke: '1.5px #2563eb', filter: 'drop-shadow(0 2px 8px #3b82f6aa)' }}
      >
        MockPrep
      </span>
    </Link>
  )
}
