'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const s=(fd:FormData,k:string)=>String(fd.get(k)??'').trim();

export async function signUp(fd:FormData){const supabase=await createClient();const email=s(fd,'email'),password=s(fd,'password'),name=s(fd,'name');const {error}=await supabase.auth.signUp({email,password,options:{data:{name},emailRedirectTo:`${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`}});if(error) throw new Error(error.message);redirect('/login?message=check-email');}
export async function signIn(fd:FormData){const supabase=await createClient();const {error}=await supabase.auth.signInWithPassword({email:s(fd,'email'),password:s(fd,'password')});if(error) throw new Error(error.message);redirect('/dashboard');}
export async function signOut(){const supabase=await createClient();await supabase.auth.signOut();redirect('/');}

export async function createExperience(fd:FormData){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user) redirect('/login');const payload:any={user_id:user.id};['title','context','role','objective','phenomenon','problem_statement','decision','evidence','action','result','learning','pattern_candidate','principle_candidate','boundary'].forEach(k=>payload[k]=s(fd,k));const {data,error}=await supabase.from('experiences').insert(payload).select('id').single();if(error) throw new Error(error.message);revalidatePath('/dashboard');redirect(`/experience/${data.id}`);}

export async function createTraining(fd:FormData){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user) redirect('/login');const payload:any={user_id:user.id};['title','training_type','question','answer','problem_statement','cause_candidates','cause_hypothesis','falsification','validation_plan','solution_hypothesis','insight'].forEach(k=>payload[k]=s(fd,k));const {data,error}=await supabase.from('training_sessions').insert(payload).select('id').single();if(error) throw new Error(error.message);revalidatePath('/dashboard');redirect(`/training/${data.id}`);}
