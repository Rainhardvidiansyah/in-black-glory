### Note: products table — for review
1. Schema is still an early version (does not yet match the client's final specs)

Current structure: id, name, sku, description, price, quantity, isActive, createdAt, updatedAt — flat structure, no variants
No support yet for size/color variants (even though our initial draft required this for a clothing store)
Plan: once client specs are clear, add a new `product_variants` table (FK to `products`) — do not modify the existing `products` table
Approach: use `ALTER TABLE` or a new table via a new migration; do not drop and recreate

2. `UNIQUE INDEX` on the `name` column — potential blocker

This constraint blocks the system if two products share the exact same name
If variants are used later (e.g., "Plain Shirt" in multiple colors stored as separate rows without a separate variants table), this constraint will cause a conflict
Needs re-discussion once the variant approach is decided (separate rows vs. `product_variants` table)

3. No support yet for tiered pricing (wholesale)

Matches initial requirement ("tiered pricing needed" for bulk orders from institutions/schools)
Requires a new `pricing_tiers` table (FK to `products`) — not yet created

4. No support yet for custom orders (embroidery/logos)

Initial requirement: custom orders need an approval flow
Requires a new `customization_requests` table — not yet created

5. Minor bug (non-urgent) in `ProductsService.getProductById()`

Return shape differs between cache-hit (`{ source, data }`) and cache-miss (direct flat object)
Potential to cause bugs in consumers/frontend that assume a consistent shape
File: `src/products/products.service.ts`

6. No product categories yet

If the variety of products grows (school uniforms, office uniforms, plain t-shirts, etc.), consider adding a `categories` table

7. `uuidv7()` fixed to `uuid_generate_v7()` ✅

Resolved in the `CreateProductsTable` migration; no further action needed