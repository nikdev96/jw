#!/usr/bin/env python3
"""Apply UX test products to database"""
import asyncio
from sqlalchemy import text
from app.database import async_session_maker

async def apply_test_products():
    """Clear old products and add test products"""

    # Read SQL file
    with open('seed_ux_test_products.sql', 'r') as f:
        sql_content = f.read()

    async with async_session_maker() as session:
        # Clear old products
        print("Clearing old products...")
        await session.execute(text("DELETE FROM products"))
        await session.commit()
        print("✓ Old products cleared")

        # Execute seed file
        print("Adding UX test products...")
        await session.execute(text(sql_content))
        await session.commit()
        print("✓ UX test products added")

        # Count products
        result = await session.execute(text("SELECT COUNT(*) FROM products"))
        count = result.scalar()
        print(f"✓ Total products in database: {count}")

if __name__ == "__main__":
    asyncio.run(apply_test_products())
