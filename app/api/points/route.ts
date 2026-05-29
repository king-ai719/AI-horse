import { auth } from '@clerk/nextjs/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerSupabase()
  let { data, error } = await supabase
    .from('horse_users')
    .select('points')
    .eq('clerk_id', userId)
    .single()

  // ユーザーがいなければ自動作成（初回ログイン時）
  if (error || !data) {
    const { data: newUser, error: insertError } = await supabase
      .from('horse_users')
      .insert({
        clerk_id: userId,
        points: 3,
        used_free_points: true,
      })
      .select('points')
      .single()

    if (insertError) return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    return NextResponse.json({ points: newUser.points })
  }

  return NextResponse.json({ points: data.points })
}

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('horse_users')
    .select('points')
    .eq('clerk_id', userId)
    .single()

  if (error || !data) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (data.points <= 0) return NextResponse.json({ error: 'No points' }, { status: 402 })

  const { data: updated, error: updateError } = await supabase
    .from('horse_users')
    .update({ points: data.points - 1, updated_at: new Date().toISOString() })
    .eq('clerk_id', userId)
    .select('points')
    .single()

  if (updateError) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json({ points: updated.points })
}