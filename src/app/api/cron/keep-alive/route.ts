import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  // Vercel Cron 인증 확인
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 간단한 쿼리로 Supabase 활성 상태 유지
    const { count, error } = await supabase
      .from('feedbacks')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Keep-alive error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase is alive',
      feedbackCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Keep-alive error:', error);
    return NextResponse.json({ error: 'Failed to ping Supabase' }, { status: 500 });
  }
}
