import { createClient } from "@/lib/supabase/server";
import TestimonialsManager, { TestimonialRow } from "./TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();

  let testList: TestimonialRow[] = [];
  try {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) testList = data;
  } catch {
    // fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Testimonials & Reviews</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage endorsements, feedback from mentors and collaborators, and toggle visibility on the public site.
        </p>
      </div>

      <TestimonialsManager initialTestimonials={testList} />
    </div>
  );
}
