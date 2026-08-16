import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function POST(request: any) {
  const { action, data } = await request.json();

  // allow any typed payloads for now
  async function createError(data: any) {
    const { error } = await supabase.from('errors').insert([data]);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ message: 'Error created successfully' });
  }

  async function updateError(data: any) {
    const { id, ...updates } = data;
    const { error } = await supabase.from('errors').update(updates).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ message: 'Error updated successfully' });
  }

  async function deleteError(data: any) {
    const { id } = data;
    const { error } = await supabase.from('errors').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ message: 'Error deleted successfully' });
  }

  async function publishError(data: any) {
    const { id } = data;
    const { error } = await supabase.from('errors').update({ status: 'published' }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ message: 'Error published successfully' });
  }

  async function archiveError(data: any) {
    const { id } = data;
    const { error } = await supabase.from('errors').update({ status: 'archived' }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ message: 'Error archived successfully' });
  }

  switch (action) {
    case 'createError':
      return await createError(data);
    case 'updateError':
      return await updateError(data);
    case 'deleteError':
      return await deleteError(data);
    case 'publishError':
      return await publishError(data);
    case 'archiveError':
      return await archiveError(data);
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}
