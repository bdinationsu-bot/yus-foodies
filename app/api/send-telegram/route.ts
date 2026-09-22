import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, phone, address, total, items, payment } = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 });
    }

    const itemsList = items
      .map((item: any) => `• ${item.name} x ${item.quantity} = ${item.price * item.quantity} MMK`)
      .join('\n');

    const message = `🍿 *New Order - Yu's Foodies*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
📍 *Address:* ${address}
💳 *Payment:* ${payment}

🛒 *Items:*
${itemsList}

💰 *Total:* ${total} MMK

⏰ ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Yangon' })}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      return NextResponse.json({ error: data.description }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
