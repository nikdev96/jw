#!/usr/bin/env python3
"""
Seed enhanced products with images, type, and THC directly via SQLAlchemy
"""
import asyncio
from decimal import Decimal
from app.database import async_session_maker
from app.models.product import Product

PRODUCTS = [
    # FLOWER CATEGORY (ID: 5) - Premium Strains
    {
        "name": "OG Kush Premium",
        "description": "Classic strain with earthy pine notes and deeply relaxing effects. Perfect for evening use and stress relief.",
        "price": Decimal("2500.00"),
        "images": [
            "https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 5,
        "is_active": True,
        "sort_order": 1,
        "type": "Indica",
        "thc": Decimal("22.00")
    },
    {
        "name": "Girl Scout Cookies",
        "description": "Sweet earthy flavor with euphoric balanced high. Popular hybrid with creative and uplifting effects.",
        "price": Decimal("2800.00"),
        "images": [
            "https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1517191297489-5ff0c0da51b4?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 5,
        "is_active": True,
        "sort_order": 2,
        "type": "Hybrid",
        "thc": Decimal("25.00")
    },
    {
        "name": "Blue Dream",
        "description": "Sativa-dominant hybrid with sweet berry aroma and cerebral high. Great for daytime creativity and focus.",
        "price": Decimal("2400.00"),
        "images": [
            "https://images.unsplash.com/photo-1517191297489-5ff0c0da51b4?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 5,
        "is_active": True,
        "sort_order": 3,
        "type": "Sativa",
        "thc": Decimal("18.50")
    },
    {
        "name": "Purple Haze",
        "description": "Legendary sativa strain with sweet berry flavor and long-lasting uplifting effects. Energizing and creative.",
        "price": Decimal("2700.00"),
        "images": [
            "https://images.unsplash.com/photo-1612544409025-f4181e665dfc?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 5,
        "is_active": True,
        "sort_order": 4,
        "type": "Sativa",
        "thc": Decimal("19.00")
    },
    {
        "name": "Northern Lights",
        "description": "Pure indica with spicy, earthy aroma and deep body relaxation. Ideal for pain relief and sleep.",
        "price": Decimal("2600.00"),
        "images": [
            "https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1612544409025-f4181e665dfc?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 5,
        "is_active": True,
        "sort_order": 5,
        "type": "Indica",
        "thc": Decimal("21.50")
    },

    # EDIBLES CATEGORY (ID: 2) - Premium Infused Products
    {
        "name": "Chocolate Chip Cookies",
        "description": "Classic homemade cookies infused with premium hybrid cannabis. 10mg THC per cookie, 5 cookies per pack.",
        "price": Decimal("800.00"),
        "images": [
            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 6,
        "is_active": True,
        "sort_order": 1,
        "type": "Hybrid",
        "thc": Decimal("10.00")
    },
    {
        "name": "Berry Blast Gummies",
        "description": "Delicious mixed berry gummies with precise dosing. 5mg THC per gummy, 20 pieces. Perfect for beginners.",
        "price": Decimal("650.00"),
        "images": [
            "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 6,
        "is_active": True,
        "sort_order": 2,
        "type": "Sativa",
        "thc": Decimal("5.00")
    },
    {
        "name": "Dark Chocolate Bar",
        "description": "Premium 70% cacao dark chocolate infused with indica extract. 100mg THC total, scored into 10 pieces.",
        "price": Decimal("900.00"),
        "images": [
            "https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 6,
        "is_active": True,
        "sort_order": 3,
        "type": "Indica",
        "thc": Decimal("10.00")
    },
    {
        "name": "Mango Tango Gummies",
        "description": "Tropical mango flavored gummies with energizing sativa blend. 10mg per piece, 10 pieces per pack.",
        "price": Decimal("750.00"),
        "images": [
            "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 6,
        "is_active": True,
        "sort_order": 4,
        "type": "Sativa",
        "thc": Decimal("10.00")
    },
    {
        "name": "Brownies Classic",
        "description": "Rich fudgy brownies made with premium hybrid cannabis butter. 25mg THC per brownie, 4 brownies per box.",
        "price": Decimal("1200.00"),
        "images": [
            "https://images.unsplash.com/photo-1564355808853-7f36b06279bb?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 6,
        "is_active": True,
        "sort_order": 5,
        "type": "Hybrid",
        "thc": Decimal("25.00")
    },

    # PRE-ROLLS CATEGORY (ID: 3) - Ready to Smoke
    {
        "name": "OG Kush Pre-Roll 1g",
        "description": "Premium OG Kush flower rolled in organic hemp paper. Perfect cone for solo sessions. Pure indica relaxation.",
        "price": Decimal("350.00"),
        "images": [
            "https://images.unsplash.com/photo-1605005824717-b2f6a46924f5?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 7,
        "is_active": True,
        "sort_order": 1,
        "type": "Indica",
        "thc": Decimal("22.00")
    },
    {
        "name": "Sativa Blend 3-Pack",
        "description": "Three 0.5g pre-rolls of premium sativa blend. Uplifting and energizing. Great for sharing or on-the-go.",
        "price": Decimal("800.00"),
        "images": [
            "https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1605005824717-b2f6a46924f5?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 7,
        "is_active": True,
        "sort_order": 2,
        "type": "Sativa",
        "thc": Decimal("19.00")
    },
    {
        "name": "Hybrid Power Pack",
        "description": "Five 1g pre-rolls of our best-selling hybrid strains. Balanced effects, premium quality. Party pack!",
        "price": Decimal("1500.00"),
        "images": [
            "https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1605005824717-b2f6a46924f5?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 7,
        "is_active": True,
        "sort_order": 3,
        "type": "Hybrid",
        "thc": Decimal("23.00")
    },
    {
        "name": "Purple Haze King Size",
        "description": "Extra-large 1.5g pre-roll of legendary Purple Haze. Smooth smoke, uplifting effects. For experienced users.",
        "price": Decimal("500.00"),
        "images": [
            "https://images.unsplash.com/photo-1612544409025-f4181e665dfc?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 7,
        "is_active": True,
        "sort_order": 4,
        "type": "Sativa",
        "thc": Decimal("19.00")
    },
    {
        "name": "Indica Chill Mini 5-Pack",
        "description": "Five mini 0.5g pre-rolls of relaxing indica blend. Perfect for microdosing or bedtime ritual.",
        "price": Decimal("600.00"),
        "images": [
            "https://images.unsplash.com/photo-1605005824717-b2f6a46924f5?w=800&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80"
        ],
        "category_id": 7,
        "is_active": True,
        "sort_order": 5,
        "type": "Indica",
        "thc": Decimal("20.50")
    },
]

async def seed_products():
    """Insert products directly via SQLAlchemy"""
    async with async_session_maker() as session:
        try:
            for product_data in PRODUCTS:
                product = Product(**product_data)
                session.add(product)

            await session.commit()
            print(f"\n✅ Successfully added {len(PRODUCTS)} products with images, type, and THC data!")
            print(f"✅ Categories: Flower (5), Edibles (5), Pre-Rolls (5)")

        except Exception as e:
            print(f"\n❌ Error seeding products: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(seed_products())
