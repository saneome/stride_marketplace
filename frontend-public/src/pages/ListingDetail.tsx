import { useParams } from 'react-router-dom'
import BackButton from '../components/BackButton'

export default function ListingDetail() {
  const { id } = useParams()

  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Объявление #{id}</h1>
      <p className="text-gray-600">Детали объявления будут здесь...</p>
    </div>
  )
}
