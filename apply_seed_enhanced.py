#!/usr/bin/env python3
"""
Apply enhanced product seed data to the database
"""
import asyncio
from sqlalchemy import text
from app.database import async_session_maker

async def apply_seed():
    """Read and execute seed SQL file"""
    with open('seed_enhanced_products.sql', 'r') as f:
        sql = f.read()

    async with async_session_maker() as session:
        try:
            # Split by semicolon and execute each statement
            statements = [s.strip() for s in sql.split(';') if s.strip() and not s.strip().startswith('--')]

            for statement in statements:
                if statement:
                    print(f"Executing: {statement[:100]}...")
                    await session.execute(text(statement))

            await session.commit()
            print("\n✅ Seed data applied successfully!")
            print(f"✅ Added 15 products with images, type, and THC data")

        except Exception as e:
            print(f"\n❌ Error applying seed data: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(apply_seed())
