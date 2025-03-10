// // app/api/plan/route.ts
// import { NextResponse } from "next/server";

// const mockPlans: { id: string; name: string; price: string; features: string[]; discount: number; isActive: boolean; created_at: string; updated_at: string; deleted_at: string | null; description: string; no_stores: string; commission_rate: number }[] = [
//   { id: "1", name: "Basic", price: "9.99", features: ["1 User"], discount: 0, isActive: true, created_at: "2023-01-01", updated_at: "2023-01-01", deleted_at: null, description: "Starter", no_stores: "1", commission_rate: 5 },
// ];

// export async function GET() {
//   return NextResponse.json(mockPlans, { status: 200 });
// }

// export async function POST(request: Request) {
//   const newPlan = await request.json();
//   const plan = { ...newPlan, id: `plan_${mockPlans.length + 1}` };
//   mockPlans.push(plan);
//   return NextResponse.json(plan, { status: 201 });
// }

// export async function PUT(request: Request) {
//   const { id, ...updateData } = await request.json();
//   const index = mockPlans.findIndex((p) => p.id === id);
//   if (index === -1) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
//   mockPlans[index] = { ...mockPlans[index], ...updateData };
//   return NextResponse.json(mockPlans[index], { status: 200 });
// }

// export async function DELETE(request: Request) {
//   const url = new URL(request.url);
//   const id = url.searchParams.get("id") || (await request.json()).id;
//   const index = mockPlans.findIndex((p) => p.id === id);
//   if (index === -1) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
//   mockPlans.splice(index, 1);
//   return NextResponse.json({ message: "Plan deleted" }, { status: 200 });
// }