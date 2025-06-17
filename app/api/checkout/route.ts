// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEYS!);
    const body = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Donation' },
            unit_amount: body.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/donation/finish`,
      cancel_url: `${req.nextUrl.origin}/donation/error`,
    });

    return NextResponse.json({ id: session.id }, { status: 200 });
  } catch (error: any) {
    console.error('[Stripe Checkout Error]', error);
    return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
  }
}
