import { NextResponse } from 'next/server'
import {supabase} from "@/app/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from('formations')
    .select('*')

  return NextResponse.json({ data, error })
}
