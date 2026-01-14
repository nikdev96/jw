import html
import logging
import httpx
from decimal import Decimal

from app.config import settings
from app.models.order import Order

logger = logging.getLogger(__name__)


class TelegramBotService:
    BASE_URL = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}"

    @staticmethod
    async def send_message(chat_id: int, text: str, parse_mode: str = "HTML") -> bool:
        """Send message to Telegram chat."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{TelegramBotService.BASE_URL}/sendMessage",
                    json={
                        "chat_id": chat_id,
                        "text": text,
                        "parse_mode": parse_mode
                    },
                    timeout=10.0
                )
                response.raise_for_status()
                return True
            except Exception as e:
                # Log error but don't fail the order creation
                logger.error(
                    "Failed to send Telegram message",
                    exc_info=True,
                    extra={"chat_id": chat_id, "error": str(e)}
                )
                return False

    @staticmethod
    async def notify_new_order(order: Order) -> bool:
        """Send notification to manager about new order."""
        items_text = "\n".join([
            f"• {html.escape(item.product_name)} × {item.quantity} = {item.price * item.quantity} ฿"
            for item in order.items
        ])

        delivery_info = ""
        if order.delivery_address:
            delivery_info += f"\n📍 <b>Адрес:</b> {html.escape(order.delivery_address)}"
        if order.phone:
            delivery_info += f"\n📞 <b>Телефон:</b> {html.escape(order.phone)}"
        if order.comment:
            delivery_info += f"\n💬 <b>Комментарий:</b> {html.escape(order.comment)}"

        message = f"""
🛒 <b>Новый заказ #{order.id}</b>

👤 <b>Покупатель:</b> <a href="tg://user?id={order.user_id}">ID {order.user_id}</a>

📦 <b>Состав заказа:</b>
{items_text}

💰 <b>Итого:</b> {order.total_amount} ฿
{delivery_info}

🕐 <b>Создан:</b> {order.created_at.strftime('%d.%m.%Y %H:%M')}
        """.strip()

        return await TelegramBotService.send_message(
            chat_id=settings.MANAGER_CHAT_ID,
            text=message
        )
