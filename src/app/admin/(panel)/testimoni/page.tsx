import { TestimonialManager } from "@/components/admin/TestimonialManager";
import { requireAdminPage } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";

export default async function TestimonialsPage() {
  const { supabase } = await requireAdminPage();
  const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });

  return (
    <>
      <h1 className="mb-8 font-serif-display text-3xl">Testimoni</h1>
      <TestimonialManager items={(data ?? []) as Testimonial[]} />
    </>
  );
}
