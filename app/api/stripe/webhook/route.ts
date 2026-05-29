export const runtime = 'nodejs'

import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createServerSupabase } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const headerPayload = await headers()
  const sig = headerPayload.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const clerk_id = session.metadata?.clerk_id
    if (!clerk_id) return new Response('No clerk_id', { status: 400 })

    const supabase = createServerSupabase()
    const { data } = await supabase
      .from('horse_users')
      .select('points')
      .eq('clerk_id', clerk_id)
      .single()

    await supabase
      .from('horse_users')
      .update({ points: (data?.points ?? 0) + 6, updated_at: new Date().toISOString() })
      .eq('clerk_id', clerk_id)
  }

  return new Response('OK', { status: 200 })
}