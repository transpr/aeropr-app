import { redirect } from 'next/navigation'

// The v0 dashboard now lives at /news; /press (legacy URL) redirects to it.
export default function PressPage() {
  redirect('/news')
}
