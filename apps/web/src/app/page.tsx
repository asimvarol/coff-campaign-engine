import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to login page (or campaigns if authenticated)
  redirect('/login')
}
