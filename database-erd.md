# Database ERD Documentation

This file contains ERD-style markdown tables for **every model** in `app/Models`. Each table lists the fields, types, and relationships to help you understand the database design for all entities.

_This file will be populated with all tables. Please wait while I process every model._

## Account

| Field           | Type      | Relationship          | Description        |
| ------------    | --------- | --------------        | ------------------ |
| id              | int       |                       | Primary Key        |
| shop_id         | int       | belongsTo Shop        | FK to Shop         |
| region_id       | int       | belongsTo Region      | FK to Region       |
| integration_id  | int       | belongsTo Integration | FK to Integration  |
| name            | string    |                       | Account name       |
| email           | string    |                       | Email address      |
| phone_number    | string    |                       | Phone number       |
| status          | int       |                       | Status             |
| created_at      | datetime  |                       | Created timestamp  |
| updated_at      | datetime  |                       | Updated timestamp  |
| deleted_at      | datetime  |                       | Deleted timestamp  |
| shop            | belongsTo | Shop                  | Shop relation      |
| users           | hasMany   | User                  | Related users      |
| invoices        | hasMany   | Invoice               | Related invoices   |
| consignees      | hasMany   | Consignee             | Related consignees |
| suppliers       | hasMany   | Supplier              | Related suppliers  |
| products        | hasMany   | Product               | Related products   |
| ...             | ...       | ...                   | ...                |

## Alert

| Field        | Type     | Relationship      | Description         |
| ------------ | -------- | ----------------- | ------------------- |
| shop_id      | int      | belongsTo Shop    | FK to Shop          |
| account_id   | int      | belongsTo Account | FK to Account       |
| message      | string   |                   | Alert message       |
| type         | string   |                   | Alert type          |
| priority     | int      |                   | Priority            |
| dismissed_at | datetime |                   | Dismissed timestamp |
| data         | array    |                   | Extra data          |
| alertable    | morphTo  | Polymorphic       | Related model       |
| relations    | hasMany  | AlertRelation     | Alert relations     |

## Article

| Field                 | Type      | Relationship              | Description       |
| --------------------- | --------- | ------------------------- | ----------------- |
| id                    | int       |                           | Primary Key       |
| user_id               | int       | belongsTo User            | FK to User        |
| article_categories_id | int       | belongsTo ArticleCategory | FK to Category    |
| parent_id             | int       | belongsTo Article (self)  | Parent article    |
| title                 | string    |                           | Article title     |
| slug                  | string    |                           | Slug              |
| outline               | string    |                           | Outline           |
| description           | string    |                           | Description       |
| created_at            | datetime  |                           | Created timestamp |
| updated_at            | datetime  |                           | Updated timestamp |
| deleted_at            | datetime  |                           | Deleted timestamp |
| category              | belongsTo | ArticleCategory           | Category relation |
| tags                  | hasMany   | ArticleTag                | Article tags      |
| user                  | belongsTo | User                      | User relation     |

## Brand

| Field       | Type      | Relationship     | Description         |
| ----------- | --------- | ---------------- | ------------------- |
| id          | bigint    |                  | Primary Key         |
| name        | varchar   |                  | Brand name (255)    |
| shop_id     | bigint    | belongsTo Shop   | FK to Shop          |
| visible     | tinyint   |                  | Visibility flag (1) |
| flag        | tinyint   |                  | Brand flag          |
| created_at  | timestamp |                  | Created timestamp   |
| updated_at  | timestamp |                  | Updated timestamp   |
| inventories | hasMany   | ProductInventory | Related inventories |
| products    | hasMany   | Product          | Related products    |
| shop        | belongsTo | Shop             | Shop relation       |

**Note:** No soft delete (no deleted_at column)

## Chat

| Field       | Type | Relationship | Description      |
| ----------- | ---- | ------------ | ---------------- |
| (no fields) |      |              | Permissions only |

## Consignee

| Field                 | Type      | Relationship     | Description         |
| --------------------- | --------- | ---------------- | ------------------- |
| id                    | int       |                  | Primary Key         |
| shop_id               | int       | belongsTo Shop   | FK to Shop          |
| name                  | string    |                  | Consignee name      |
| company_name          | string    |                  | Company name        |
| phone_number          | string    |                  | Phone number        |
| email                 | string    |                  | Email address       |
| payment_term          | int       |                  | Payment term        |
| address_1             | string    |                  | Address line 1      |
| address_2             | string    |                  | Address line 2      |
| address_3             | string    |                  | Address line 3      |
| city                  | string    |                  | City                |
| state                 | string    |                  | State               |
| postcode              | string    |                  | Postcode            |
| country               | string    |                  | Country             |
| delivery_name         | string    |                  | Delivery name       |
| delivery_phone_number | string    |                  | Delivery phone      |
| delivery_fax          | string    |                  | Delivery fax        |
| delivery_address_1    | string    |                  | Delivery address 1  |
| delivery_address_2    | string    |                  | Delivery address 2  |
| delivery_address_3    | string    |                  | Delivery address 3  |
| delivery_city         | string    |                  | Delivery city       |
| delivery_state        | string    |                  | Delivery state      |
| delivery_postcode     | string    |                  | Delivery postcode   |
| delivery_country      | string    |                  | Delivery country    |
| fax                   | string    |                  | Fax                 |
| website               | string    |                  | Website             |
| currency              | string    |                  | Currency            |
| created_at            | datetime  |                  | Created timestamp   |
| updated_at            | datetime  |                  | Updated timestamp   |
| deleted_at            | datetime  |                  | Deleted timestamp   |
| accountConsignees     | hasMany   | AccountConsignee | Related consignees  |
| inventories           | hasMany   | ProductInventory | Related inventories |
| prefixes              | hasMany   | PrefixSuffix     | Related prefixes    |
| suffixes              | hasMany   | PrefixSuffix     | Related suffixes    |
| shop                  | belongsTo | Shop             | Shop relation       |

## Customer

| Field  | Type   | Relationship | Description |
| ------ | ------ | ------------ | ----------- |
| id     | int    |              | Primary Key |
| source | string |              | Source      |

## ExportExcelTask

| Field       | Type      | Relationship      | Description       |
| ----------- | --------- | ----------------- | ----------------- |
| id          | int       |                   | Primary Key       |
| shop_id     | int       | belongsTo Shop    | FK to Shop        |
| user_id     | int       | belongsTo User    | FK to User        |
| account_id  | int       | belongsTo Account | FK to Account     |
| source_type | string    |                   | Source type       |
| source      | string    |                   | Source            |
| download    | string    |                   | Download URL      |
| messages    | array     |                   | Messages          |
| settings    | array     |                   | Settings          |
| status      | string    |                   | Status            |
| created_at  | datetime  |                   | Created timestamp |
| updated_at  | datetime  |                   | Updated timestamp |
| account     | belongsTo | Shop              | Account relation  |
| shop        | belongsTo | Shop              | Shop relation     |
| user        | belongsTo | User              | User relation     |

## FreeGift

| Field             | Type      | Relationship               | Description          |
| ----------------- | --------- | -------------------------- | -------------------- |
| id                | int       |                            | Primary Key          |
| shop_id           | int       | belongsTo Shop             | FK to Shop           |
| gift_inventory_id | int       | belongsTo ProductInventory | FK to Inventory      |
| gift_sku          | string    |                            | Gift SKU             |
| gift_quantity     | int       |                            | Gift quantity        |
| amount_required   | string    |                            | Amount required      |
| gift_limit        | int       |                            | Gift limit           |
| type              | int       |                            | Gift type            |
| start_datetime    | datetime  |                            | Start datetime       |
| end_datetime      | datetime  |                            | End datetime         |
| created_at        | datetime  |                            | Created timestamp    |
| updated_at        | datetime  |                            | Updated timestamp    |
| deleted_at        | datetime  |                            | Deleted timestamp    |
| account           | belongsTo | Account                    | Account relation     |
| freeGiftInventory | belongsTo | ProductInventory           | Free gift inventory  |
| integration       | belongsTo | Integration                | Integration relation |
| inventories       | hasMany   | ProductInventory           | Related inventories  |
| shop              | belongsTo | Shop                       | Shop relation        |

## FreeGiftTrail

| Field             | Type      | Relationship               | Description        |
| ----------------- | --------- | -------------------------- | ------------------ |
| order_id          | int       | belongsTo Order            | FK to Order        |
| free_gift_id      | int       | belongsTo FreeGift         | FK to FreeGift     |
| gift_inventory_id | int       | belongsTo ProductInventory | FK to Inventory    |
| gift_quantity     | int       |                            | Gift quantity      |
| message           | string    |                            | Message            |
| deduction_type    | string    |                            | Deduction type     |
| freeGift          | belongsTo | FreeGift                   | FreeGift relation  |
| order             | belongsTo | Order                      | Order relation     |
| productInventory  | belongsTo | ProductInventory           | Inventory relation |

## ImportExcelTask

| Field      | Type      | Relationship   | Description       |
| ---------- | --------- | -------------- | ----------------- |
| id         | int       |                | Primary Key       |
| shop_id    | int       | belongsTo Shop | FK to Shop        |
| user_id    | int       | belongsTo User | FK to User        |
| type       | string    |                | Import type       |
| file_url   | string    |                | File URL          |
| messages   | array     |                | Messages          |
| settings   | array     |                | Settings          |
| status     | string    |                | Status            |
| created_at | datetime  |                | Created timestamp |
| updated_at | datetime  |                | Updated timestamp |
| shop       | belongsTo | Shop           | Shop relation     |
| user       | belongsTo | User           | User relation     |

## Integration

| Field           | Type     | Relationship        | Description              |
| --------------- | -------- | ------------------- | ------------------------ |
| id              | int      |                     | Primary Key              |
| region_ids      | array    |                     | Region IDs               |
| name            | string   |                     | Integration name         |
| thumbnail_image | string   |                     | Thumbnail image          |
| sync_data       | array    |                     | Sync data                |
| features        | array    |                     | Features                 |
| settings        | array    |                     | Settings                 |
| jobs            | array    |                     | Jobs                     |
| type            | int      |                     | Integration type         |
| visibility      | int      |                     | Visibility               |
| position        | int      |                     | Position                 |
| created_at      | datetime |                     | Created timestamp        |
| updated_at      | datetime |                     | Updated timestamp        |
| deleted_at      | datetime |                     | Deleted timestamp        |
| accountEntities | hasMany  | AccountEntity       | Related account entities |
| accounts        | hasMany  | Account             | Related accounts         |
| brands          | hasMany  | IntegrationBrand    | Related brands           |
| categories      | hasMany  | IntegrationCategory | Related categories       |

## IntegrationBrand

| Field          | Type     | Relationship          | Description       |
| -------------- | -------- | --------------------- | ----------------- |
| id             | int      |                       | Primary Key       |
| name           | string   |                       | Brand name        |
| external_id    | string   |                       | External ID       |
| integration_id | int      | belongsTo Integration | FK to Integration |
| region_id      | int      |                       | Region ID         |
| visible        | int      |                       | Visibility flag   |
| flag           | int      |                       | Brand flag        |
| created_at     | datetime |                       | Created timestamp |
| updated_at     | datetime |                       | Updated timestamp |

## IntegrationCategory

| Field          | Type      | Relationship                         | Description          |
| -------------- | --------- | ------------------------------------ | -------------------- |
| id             | int       |                                      | Primary Key          |
| name           | string    |                                      | Category name        |
| breadcrumb     | string    |                                      | Breadcrumb           |
| external_id    | string    |                                      | External ID          |
| integration_id | int       | belongsTo Integration                | FK to Integration    |
| region_id      | int       |                                      | Region ID            |
| parent_id      | int       | belongsTo IntegrationCategory (self) | Parent category      |
| category_id    | int       | belongsTo Category                   | FK to Category       |
| is_leaf        | int       |                                      | Is leaf node         |
| visible        | int       |                                      | Visibility flag      |
| flag           | int       |                                      | Category flag        |
| created_at     | datetime  |                                      | Created timestamp    |
| updated_at     | datetime  |                                      | Updated timestamp    |
| attributes     | hasMany   | IntegrationCategoryAttribute         | Category attributes  |
| categories     | hasMany   | Category                             | Related categories   |
| category       | belongsTo | Category                             | Category relation    |
| children       | hasMany   | IntegrationCategory (self)           | Child categories     |
| integration    | belongsTo | Integration                          | Integration relation |

## ProductInventory

| Field                         | Type      | Relationship                       | Description                  |
| ----------------------------- | --------- | ---------------------------------- | ---------------------------- |
| id                            | bigint    |                                    | Primary Key                  |
| shop_id                       | bigint    | belongsTo Shop                     | FK to Shop                   |
| created_by                    | bigint    | belongsTo User                     | FK to User (creator)         |
| brand_id                      | bigint    | belongsTo Brand                    | FK to Brand                  |
| supplier_id                   | bigint    | belongsTo Supplier                 | FK to Supplier               |
| product_type_id               | bigint    | belongsTo ProductType              | FK to ProductType            |
| category_id                   | bigint    | belongsTo ProductInventoryCategory | FK to Category               |
| sub_category_id               | bigint    | belongsTo ProductInventoryCategory | FK to SubCategory            |
| sku                           | varchar   |                                    | SKU (255)                    |
| name                          | varchar   |                                    | Inventory name (255)         |
| short_name                    | varchar   |                                    | Short name (255)             |
| description                   | text      |                                    | Description                  |
| html_description              | mediumtext|                                    | HTML Description             |
| barcode                       | varchar   |                                    | Barcode (255)                |
| color                         | varchar   |                                    | Color (255)                  |
| stock                         | int       |                                    | Stock                        |
| defect                        | int       |                                    | Defect count                 |
| parcel_width                  | decimal   |                                    | Parcel width (18,2)          |
| parcel_length                 | decimal   |                                    | Parcel length (18,2)         |
| parcel_height                 | decimal   |                                    | Parcel height (18,2)         |
| parcel_weight                 | decimal   |                                    | Parcel weight (18,2)         |
| sku_material                  | varchar   |                                    | SKU material (255)           |
| sku_country_of_origin         | varchar   |                                    | Country of origin (255)      |
| main_image                    | varchar   |                                    | Main image (255)             |
| currency                      | varchar   |                                    | Currency (3)                 |
| selling_price                 | decimal   |                                    | Selling price (18,4)         |
| cost_price                    | decimal   |                                    | Cost price (18,4)            |
| special_price                 | decimal   |                                    | Special price (15,2)         |
| length                        | decimal   |                                    | Length (18,2)                |
| width                         | decimal   |                                    | Width (18,2)                 |
| height                        | decimal   |                                    | Height (18,2)                |
| weight                        | decimal   |                                    | Weight (18,2)                |
| packing_size_qty_ctn          | decimal   |                                    | Packing size qty/ctn (18,2)  |
| capacity                      | decimal   |                                    | Capacity (18,2)              |
| outer_carton_barcode_number   | int       |                                    | Outer carton barcode number  |
| carton_width                  | decimal   |                                    | Carton width (18,2)          |
| carton_length                 | decimal   |                                    | Carton length (18,2)         |
| carton_height                 | decimal   |                                    | Carton height (18,2)         |
| carton_weight                 | decimal   |                                    | Carton weight (18,2)         |
| carton_total_quantity         | int       |                                    | Carton total quantity        |
| carton_capacity               | decimal   |                                    | Carton capacity (18,2)       |
| carton_shipping_cost_pcs      | decimal   |                                    | Carton shipping cost/pcs (18,4)|
| carton_cbm                    | decimal   |                                    | Carton CBM (18,4)            |
| inner_packing_number          | int       |                                    | Inner packing number         |
| total_quantity_per_inner_pack | double    |                                    | Total qty per inner pack (8,2)|
| low_stock_notification        | int       |                                    | Low stock notification       |
| out_of_stock_notification     | tinyint   |                                    | Out of stock notification (1)|
| enabled                       | tinyint   |                                    | Enabled flag (1)             |
| status                        | tinyint   |                                    | Status                       |
| onsite_installation           | tinyint   |                                    | Onsite installation (1)      |
| warehouse                     | varchar   |                                    | Warehouse (255)              |
| courier_type                  | varchar   |                                    | Courier type (255)           |
| assembly                      | tinyint   |                                    | Assembly required (1)        |
| packaging_type                | varchar   |                                    | Packaging type (255)         |
| packaging_detail              | text      |                                    | Packaging detail             |
| features                      | json      |                                    | Features JSON                |
| status_updated_at             | timestamp |                                    | Status updated timestamp     |
| created_at                    | timestamp |                                    | Created timestamp            |
| updated_at                    | timestamp |                                    | Updated timestamp            |
| deleted_at                    | timestamp |                                    | Deleted timestamp            |
| brand                         | belongsTo | Brand                              | Brand relation               |
| shop                          | belongsTo | Shop                               | Shop relation                |
| supplier                      | belongsTo | Supplier                           | Supplier relation            |
| category                      | belongsTo | ProductInventoryCategory           | Category relation            |
| subCategory                   | belongsTo | ProductInventoryCategory           | SubCategory relation         |
| creator                       | belongsTo | User                               | Creator relation             |
| variants                      | hasMany   | ProductVariant                     | Product variants             |
| trails                        | hasMany   | ProductInventoryTrail              | Inventory trails             |
| batchPivots                   | hasMany   | ProductInventoryBatchPivot         | Batch relationships          |

**Relationships:**

- `listings`: hasManyThrough ProductListing via ProductVariant (inventory_id → ProductVariant → product_variant_id → ProductListing)
  - Retrieves all product listings for this inventory through its variants.

## ProductPrice

| Field              | Type      | Relationship             | Description          |
| ------------------ | --------- | ------------------------ | -------------------- |
| id                 | int       |                          | Primary Key          |
| shop_id            | int       | belongsTo Shop           | FK to Shop           |
| product_id         | int       | belongsTo Product        | FK to Product        |
| product_variant_id | int       | belongsTo ProductVariant | FK to ProductVariant |
| product_listing_id | int       | belongsTo ProductListing | FK to ProductListing |
| integration_id     | int       | belongsTo Integration    | FK to Integration    |
| region_id          | int       |                          | Region ID            |
| currency           | string    |                          | Currency             |
| price              | string    |                          | Price                |
| type               | string    |                          | Price type           |
| created_at         | datetime  |                          | Created timestamp    |
| updated_at         | datetime  |                          | Updated timestamp    |
| product            | belongsTo | Product                  | Product relation     |
| audits             | hasMany   | Audit                    | Audit logs           |

## ProductListing

| Field                   | Type      | Relationship                  | Description                  |
| ----------------------- | --------- | ----------------------------- | ---------------------------- |
| id                      | bigint    |                               | Primary Key                  |
| shop_id                 | bigint    | belongsTo Shop                | FK to Shop                   |
| account_id              | bigint    | belongsTo Account             | FK to Account                |
| integration_id          | bigint    | belongsTo Integration         | FK to Integration            |
| product_id              | bigint    | belongsTo Product             | FK to Product                |
| product_variant_id      | bigint    | belongsTo ProductVariant      | FK to ProductVariant         |
| integration_category_id | bigint    | belongsTo IntegrationCategory | FK to IntegrationCategory    |
| account_category_id     | bigint    |                               | Account category ID          |
| identifiers             | json      |                               | Identifiers JSON             |
| name                    | varchar   |                               | Listing name (255)           |
| options                 | json      |                               | Options JSON                 |
| option_1                | varchar   |                               | Option 1 (255)               |
| option_2                | varchar   |                               | Option 2 (255)               |
| option_3                | varchar   |                               | Option 3 (255)               |
| stock                   | int       |                               | Stock                        |
| sync_stock              | tinyint   |                               | Sync stock flag (1)          |
| total_sold              | int       |                               | Total sold                   |
| product_url             | varchar   |                               | Product URL (255)            |
| status                  | tinyint   |                               | Status                       |
| last_imported_at        | datetime  |                               | Last imported timestamp      |
| created_at              | timestamp |                               | Created timestamp            |
| updated_at              | timestamp |                               | Updated timestamp            |
| deleted_at              | timestamp |                               | Deleted timestamp            |
| account                 | belongsTo | Account                       | Account relation             |
| attributes              | hasMany   | ProductAttribute              | Listing attributes           |
| audits                  | hasMany   | Audit                         | Audit logs                   |
| data                    | hasOne    | ProductListingData            | Listing data                 |
| images                  | hasMany   | ProductImage                  | Listing images               |
| integration             | belongsTo | Integration                   | Integration relation         |
| integration_category    | hasOne    | IntegrationCategory           | IntegrationCategory relation |
| listing                 | hasOne    | ProductListing (self)         | Main listing (self)          |
| listing_variants        | hasMany   | ProductListing (self)         | Listing variants (self)      |
| prices                  | hasMany   | ProductPrice                  | Listing prices               |
| product                 | belongsTo | Product                       | Product relation             |
| shop                    | belongsTo | Shop                          | Shop relation                |
| variant                 | belongsTo | ProductVariant                | ProductVariant relation      |

## ProductType

| Field      | Type      | Relationship   | Description       |
| ---------- | --------- | -------------- | ----------------- |
| id         | bigint    |                | Primary Key       |
| shop_id    | bigint    | belongsTo Shop | FK to Shop        |
| name       | varchar   |                | Type name (255)   |
| created_at | timestamp |                | Created timestamp |
| updated_at | timestamp |                | Updated timestamp |
| products   | hasMany   | Product        | Related products  |
| shop       | belongsTo | Shop           | Shop relation     |

**Note:** No soft delete (no deleted_at column)

## ProductVariant

| Field                | Type      | Relationship               | Description                  |
| -------------------- | --------- | -------------------------- | ---------------------------- |
| id                   | bigint    |                            | Primary Key                  |
| product_id           | bigint    | belongsTo Product          | FK to Product                |
| shop_id              | bigint    | belongsTo Shop             | FK to Shop                   |
| name                 | varchar   |                            | Variant name (255)           |
| option1              | varchar   |                            | Option 1 (255)               |
| option2              | varchar   |                            | Option 2 (255)               |
| option3              | varchar   |                            | Option 3 (255)               |
| product_inventory_id | bigint    | belongsTo ProductInventory | FK to Inventory              |
| sku                  | varchar   |                            | SKU (400)                    |
| barcode              | varchar   |                            | Barcode (255)                |
| main_image           | varchar   |                            | Main image (255)             |
| stock                | int       |                            | Stock                        |
| currency             | varchar   |                            | Currency (3)                 |
| price                | decimal   |                            | Price (18,4)                 |
| position             | int       |                            | Position                     |
| status               | tinyint   |                            | Status                       |
| shipping_type        | tinyint   |                            | Shipping type                |
| weight               | decimal   |                            | Weight (18,2)                |
| weight_unit          | tinyint   |                            | Weight unit                  |
| length               | decimal   |                            | Length (18,2)                |
| width                | decimal   |                            | Width (18,2)                 |
| height               | decimal   |                            | Height (18,2)                |
| dimension_unit       | tinyint   |                            | Dimension unit               |
| product_colour       | varchar   |                            | Product colour (255)         |
| total_quantity_sold  | int       |                            | Total quantity sold          |
| total_revenue        | decimal   |                            | Total revenue (18,4)         |
| created_at           | timestamp |                            | Created timestamp            |
| updated_at           | timestamp |                            | Updated timestamp            |
| deleted_at           | timestamp |                            | Deleted timestamp            |
| product              | belongsTo | Product                    | Product relation             |
| shop                 | belongsTo | Shop                       | Shop relation                |
| inventory            | belongsTo | ProductInventory           | Inventory relation           |
| attributes           | hasMany   | ProductAttribute           | Variant attributes           |
| images               | hasMany   | ProductImage               | Variant images               |
| prices               | hasMany   | ProductPrice               | Variant prices               |
| listings             | hasMany   | ProductListing             | Variant listings             |
| orderItems           | hasMany   | OrderItem                  | Related order items          |
| audits               | hasMany   | Audit                      | Audit logs                   |

**Note:** Field names changed from snake_case (option_1) to camelCase (option1). All dimension fields now decimal. Has soft delete.

## Promotion

| Field          | Type     | Relationship   | Description       |
| -------------- | -------- | -------------- | ----------------- |
| id             | int      |                | Primary Key       |
| shop_id        | int      | belongsTo Shop | FK to Shop        |
| name           | string   |                | Promotion name    |
| start_date     | string   |                | Start date        |
| end_date       | string   |                | End date          |
| created_at     | datetime |                | Created timestamp |
| updated_at     | datetime |                | Updated timestamp |
| deleted_at     | datetime |                | Deleted timestamp |
| custom_status  | int      |                | Custom status     |
| accounts       | hasMany  | Account        | Related accounts  |
| audits         | hasMany  | Audit          | Audit logs        |
| promotionItems | hasMany  | PromotionItem  | Promotion items   |

## PromotionItem

| Field              | Type      | Relationship             | Description             |
| ------------------ | --------- | ------------------------ | ----------------------- |
| id                 | int       |                          | Primary Key             |
| promotion_id       | int       | belongsTo Promotion      | FK to Promotion         |
| product_id         | int       | belongsTo Product        | FK to Product           |
| product_variant_id | int       | belongsTo ProductVariant | FK to ProductVariant    |
| discount_price     | string    |                          | Discount price          |
| purchase_max       | int       |                          | Purchase max            |
| purchase_min       | int       |                          | Purchase min            |
| created_at         | datetime  |                          | Created timestamp       |
| updated_at         | datetime  |                          | Updated timestamp       |
| deleted_at         | datetime  |                          | Deleted timestamp       |
| product            | belongsTo | Product                  | Product relation        |
| promotion          | belongsTo | Promotion                | Promotion relation      |
| variant            | belongsTo | ProductVariant           | ProductVariant relation |
| audits             | hasMany   | Audit                    | Audit logs              |

## Region

| Field           | Type     | Relationship | Description       |
| --------------- | -------- | ------------ | ----------------- |
| id              | int      |              | Primary Key       |
| name            | string   |              | Region name       |
| shortcode       | string   |              | Shortcode         |
| currency        | string   |              | Currency          |
| thumbnail_image | string   |              | Thumbnail image   |
| zone            | mixed    |              | Zone              |
| position        | int      |              | Position          |
| visibility      | int      |              | Visibility flag   |
| created_at      | datetime |              | Created timestamp |
| updated_at      | datetime |              | Updated timestamp |
| audits          | hasMany  | Audit        | Audit logs        |

## Role

| Field       | Type     | Relationship | Description       |
| ----------- | -------- | ------------ | ----------------- |
| id          | int      |              | Primary Key       |
| name        | string   |              | Role name         |
| guard_name  | string   |              | Guard name        |
| created_at  | datetime |              | Created timestamp |
| updated_at  | datetime |              | Updated timestamp |
| permissions | hasMany  | Permission   | Role permissions  |
| users       | hasMany  | User         | Related users     |

## Setting

| Field        | Type     | Relationship | Description       |
| ------------ | -------- | ------------ | ----------------- |
| id           | int      |              | Primary Key       |
| key          | string   |              | Setting key       |
| value        | string   |              | Setting value     |
| type         | int      |              | Setting type      |
| category     | int      |              | Setting category  |
| access_level | int      |              | Access level      |
| created_at   | datetime |              | Created timestamp |
| updated_at   | datetime |              | Updated timestamp |

## ProductInventoryCategory

| Field      | Type      | Relationship                              | Description         |
| ---------- | --------- | ----------------------------------------- | ------------------- |
| id         | bigint    |                                           | Primary Key         |
| shop_id    | bigint    | belongsTo Shop                            | FK to Shop          |
| name       | varchar   |                                           | Category name (255) |
| parent_id  | bigint    | belongsTo ProductInventoryCategory (self) | Parent category     |
| created_at | timestamp |                                           | Created timestamp   |
| updated_at | timestamp |                                           | Updated timestamp   |
| children   | hasMany   | ProductInventoryCategory (self)           | Child categories    |
| inventories| hasMany   | ProductInventory                          | Related inventories |
| shop       | belongsTo | Shop                                      | Shop relation       |

**Note:** No soft delete (no deleted_at column). Fields removed: description, position, status

## Shop

| Field                | Type      | Relationship     | Description          |
| -------------------- | --------- | ---------------- | -------------------- |
| id                   | int       |                  | Primary Key          |
| slug                 | string    |                  | Slug                 |
| name                 | string    |                  | Shop name            |
| e2e                  | int       |                  | E2E flag             |
| logo                 | string    |                  | Logo                 |
| e_chop               | string    |                  | E-Chop               |
| e_signature          | string    |                  | E-Signature          |
| email                | string    |                  | Email address        |
| phone_number         | string    |                  | Phone number         |
| address              | array     |                  | Address              |
| country              | string    |                  | Country              |
| currency             | string    |                  | Currency             |
| running_number       | int       |                  | Running number       |
| running_number_unit  | int       |                  | Running number unit  |
| uen                  | string    |                  | UEN                  |
| stripe_id            | string    |                  | Stripe ID            |
| braintree_id         | string    |                  | Braintree ID         |
| paypal_email         | string    |                  | PayPal email         |
| card_brand           | string    |                  | Card brand           |
| card_last_four       | string    |                  | Card last four       |
| trial_ends_at        | string    |                  | Trial ends at        |
| main_account_id      | int       |                  | Main account ID      |
| mall_id              | int       |                  | Mall ID              |
| settings             | array     |                  | Shop settings        |
| skus                 | int       |                  | SKUs                 |
| active_accounts      | int       |                  | Active accounts      |
| inactive_accounts    | int       |                  | Inactive accounts    |
| enable_prefix_suffix | int       |                  | Enable prefix/suffix |
| company_structure    | int       |                  | Company structure    |
| status               | int       |                  | Status               |
| remarks              | mixed     |                  | Remarks              |
| created_at           | datetime  |                  | Created timestamp    |
| updated_at           | datetime  |                  | Updated timestamp    |
| deleted_at           | datetime  |                  | Deleted timestamp    |
| brands               | hasMany   | Brand            | Related brands       |
| consignees           | hasMany   | Consignee        | Related consignees   |
| customers            | hasMany   | Customer         | Related customers    |
| entities             | hasMany   | Entity           | Related entities     |
| inventories          | hasMany   | ProductInventory | Related inventories  |
| mall                 | belongsTo | Mall             | Mall relation        |
| shop                 | belongsTo | Shop             | Shop relation (self) |
| users                | hasMany   | User             | Related users        |

## Supplier

| Field                 | Type      | Relationship     | Description               |
| --------------------- | --------- | ---------------- | ------------------------- |
| id                    | bigint    |                  | Primary Key               |
| shop_id               | bigint    | belongsTo Shop   | FK to Shop                |
| created_by            | bigint    | belongsTo User   | FK to User (creator)      |
| name                  | varchar   |                  | Supplier name (255)       |
| company_name          | varchar   |                  | Company name (255)        |
| phone_number          | varchar   |                  | Phone number (50)         |
| country_code          | varchar   |                  | Country code (10)         |
| area_code             | varchar   |                  | Area code (10)            |
| email                 | varchar   |                  | Email address (50)        |
| address_1             | varchar   |                  | Address line 1 (255)      |
| address_2             | varchar   |                  | Address line 2 (255)      |
| address_3             | varchar   |                  | Address line 3 (255)      |
| city                  | varchar   |                  | City (255)                |
| state                 | varchar   |                  | State (255)               |
| postcode              | varchar   |                  | Postcode (20)             |
| country               | varchar   |                  | Country (255)             |
| delivery_name         | varchar   |                  | Delivery name (255)       |
| delivery_phone_number | varchar   |                  | Delivery phone number (50)|
| delivery_fax          | varchar   |                  | Delivery fax (50)         |
| delivery_address_1    | varchar   |                  | Delivery address 1 (255)  |
| delivery_address_2    | varchar   |                  | Delivery address 2 (255)  |
| delivery_address_3    | varchar   |                  | Delivery address 3 (255)  |
| delivery_city         | varchar   |                  | Delivery city (255)       |
| delivery_state        | varchar   |                  | Delivery state (255)      |
| delivery_postcode     | varchar   |                  | Delivery postcode (20)    |
| delivery_country      | varchar   |                  | Delivery country (255)    |
| fax                   | varchar   |                  | Fax (50)                  |
| website               | varchar   |                  | Website (255)             |
| currency              | varchar   |                  | Currency (3)              |
| shipping_port         | varchar   |                  | Shipping port (255)       |
| trading_term          | varchar   |                  | Trading term (255)        |
| container_size        | varchar   |                  | Container size (255)      |
| cbm                   | varchar   |                  | CBM (255)                 |
| type                  | tinyint   |                  | Supplier type             |
| created_at            | timestamp |                  | Created timestamp         |
| updated_at            | timestamp |                  | Updated timestamp         |
| deleted_at            | timestamp |                  | Deleted timestamp         |
| accountSuppliers      | hasMany   | AccountSupplier  | Related account suppliers |
| audits                | hasMany   | Audit            | Audit logs                |
| inventories           | hasMany   | ProductInventory | Related inventories       |
| purchaseOrders        | hasMany   | PurchaseOrder    | Related purchase orders   |
| shop                  | belongsTo | Shop             | Shop relation             |

**Note:** Has soft delete (deleted_at column). Added created_by field.

## User

| Field             | Type          | Relationship             | Description              |
| ----------------- | ------------- | ------------------------ | ------------------------ |
| id                | int           |                          | Primary Key              |
| name              | string        |                          | User name                |
| email             | string        |                          | Email address            |
| email_verified_at | datetime      |                          | Email verified timestamp |
| password          | string        |                          | Password                 |
| remember_token    | string        |                          | Remember token           |
| access_token      | string        |                          | Access token             |
| jwt_token         | string        |                          | JWT token                |
| phone_number      | string        |                          | Phone number             |
| slack_username    | string        |                          | Slack username           |
| retailerlink_id   | string        |                          | Retailerlink ID          |
| stripe_id         | string        |                          | Stripe ID                |
| card_brand        | string        |                          | Card brand               |
| card_last_four    | string        |                          | Card last four           |
| trial_ends_at     | string        |                          | Trial ends at            |
| status            | int           |                          | Status                   |
| created_at        | datetime      |                          | Created timestamp        |
| updated_at        | datetime      |                          | Updated timestamp        |
| deleted_at        | datetime      |                          | Deleted timestamp        |
| audits            | hasMany       | Audit                    | Audit logs               |
| malls             | hasMany       | Mall                     | Related malls            |
| notifications     | hasMany       | Notification             | User notifications       |
| permissions       | hasMany       | Permission               | User permissions         |
| roles             | hasMany       | Role                     | User roles               |
| shops             | belongsToMany | Shop (via UserShopPivot) | Related shops (pivot)    |
| Field             | Type          | Relationship             | Description              |

## IntegrationCategoryAttribute

| Field                   | Type     | Relationship                  | Description               |
| ----------------------- | -------- | ----------------------------- | ------------------------- |
| id                      | int      |                               | Primary Key               |
| integration_category_id | int      | belongsTo IntegrationCategory | FK to IntegrationCategory |
| integration_id          | int      | belongsTo Integration         | FK to Integration         |
| name                    | string   |                               | Attribute name            |
| label                   | string   |                               | Attribute label           |
| required                | int      |                               | Required flag             |
| data                    | array    |                               | Data                      |
| additional_data         | array    |                               | Additional data           |
| html_hint               | string   |                               | HTML hint                 |
| type                    | int      |                               | Attribute type            |
| level                   | int      |                               | Attribute level           |
| created_at              | datetime |                               | Created timestamp         |
| updated_at              | datetime |                               | Updated timestamp         |
| order                   | int      |                               | Order                     |
| section                 | int      |                               | Section                   |
| external_id             | string   |                               | External ID               |

## InventoryReport

| Field                  | Type     | Relationship               | Description            |
| ---------------------- | -------- | -------------------------- | ---------------------- |
| shop_id                | int      | belongsTo Shop             | FK to Shop             |
| inventory_id           | int      | belongsTo ProductInventory | FK to Inventory        |
| day                    | int      |                            | Day                    |
| week                   | int      |                            | Week                   |
| month                  | int      |                            | Month                  |
| year                   | int      |                            | Year                   |
| day_of_year            | int      |                            | Day of year            |
| inventory_holding_cost | float    |                            | Inventory holding cost |
| closing_inventory      | int      |                            | Closing inventory      |
| average_cost           | float    |                            | Average cost           |
| recorded_at            | datetime |                            | Recorded timestamp     |

## Invoice

| Field                 | Type      | Relationship             | Description           |
| --------------------- | --------- | ------------------------ | --------------------- |
| id                    | int       |                          | Primary Key           |
| shop_id               | int       | belongsTo Shop           | FK to Shop            |
| account_id            | int       | belongsTo Account        | FK to Account         |
| integration_id        | int       | belongsTo Integration    | FK to Integration     |
| customer_id           | int       | belongsTo Customer       | FK to Customer        |
| consignee_id          | int       | belongsTo Consignee      | FK to Consignee       |
| source                | string    |                          | Source                |
| source_id             | string    |                          | Source ID             |
| marketplace_id        | int       |                          | Marketplace ID        |
| parent_id             | int       | belongsTo Invoice (self) | Parent invoice        |
| external_id           | string    |                          | External ID           |
| external_order_number | string    |                          | External order number |
| invoice_number        | string    |                          | Invoice number        |
| currency              | string    |                          | Currency              |
| discount_percentage   | string    |                          | Discount percentage   |
| discount              | string    |                          | Discount              |
| shipping_fee          | string    |                          | Shipping fee          |
| tax_inclusive         | int       |                          | Tax inclusive flag    |
| tax_percentage        | string    |                          | Tax percentage        |
| tax                   | string    |                          | Tax                   |
| tax_2                 | string    |                          | Second tax            |
| grand_total           | string    |                          | Grand total           |
| buyer_paid            | string    |                          | Buyer paid            |
| rounding_amount       | string    |                          | Rounding amount       |
| data                  | array     |                          | Extra data            |
| notes                 | string    |                          | Notes                 |
| status                | int       |                          | Status                |
| fulfillment_status    | int       |                          | Fulfillment status    |
| type                  | int       |                          | Invoice type          |
| has_adjustment        | int       |                          | Has adjustment        |
| has_adjusted          | int       |                          | Has adjusted          |
| billed_date           | datetime  |                          | Billed date           |
| due_date              | datetime  |                          | Due date              |
| name                  | string    |                          | Name                  |
| email                 | string    |                          | Email address         |
| address               | array     |                          | Address               |
| shipping_address      | array     |                          | Shipping address      |
| billing_address       | array     |                          | Billing address       |
| created_at            | datetime  |                          | Created timestamp     |
| updated_at            | datetime  |                          | Updated timestamp     |
| deleted_at            | datetime  |                          | Deleted timestamp     |
| account               | belongsTo | Account                  | Account relation      |
| children              | hasMany   | Invoice (self)           | Child invoices        |
| consignee             | belongsTo | Consignee                | Consignee relation    |
| creditNotes           | hasMany   | Invoice                  | Credit notes          |
| integration           | belongsTo | Integration              | Integration relation  |
| items                 | hasMany   | InvoiceItem              | Invoice items         |
| marketplace           | belongsTo | Account                  | Marketplace relation  |
| order                 | belongsTo | Order                    | Order relation        |
| parent                | belongsTo | Invoice (self)           | Parent invoice        |
| payments              | hasMany   | InvoicePayment           | Invoice payments      |
| shop                  | belongsTo | Shop                     | Shop relation         |

## InvoiceItem

| Field               | Type      | Relationship                 | Description          |
| ------------------- | --------- | ---------------------------- | -------------------- |
| id                  | int       |                              | Primary Key          |
| invoice_id          | int       | belongsTo Invoice            | FK to Invoice        |
| shop_id             | int       | belongsTo Shop               | FK to Shop           |
| integration_id      | int       | belongsTo Integration        | FK to Integration    |
| account_id          | int       | belongsTo Account            | FK to Account        |
| product_id          | int       | belongsTo Product            | FK to Product        |
| product_variant_id  | int       | belongsTo ProductVariant     | FK to ProductVariant |
| inventory_id        | int       | belongsTo ProductInventory   | FK to Inventory      |
| parent_id           | int       | belongsTo InvoiceItem (self) | Parent item          |
| external_id         | string    |                              | External ID          |
| external_product_id | string    |                              | External product ID  |
| name                | string    |                              | Item name            |
| sku                 | string    |                              | SKU                  |
| variation_name      | string    |                              | Variation name       |
| variation_sku       | string    |                              | Variation SKU        |
| platform            | string    |                              | Platform             |
| barcode             | string    |                              | Barcode              |
| quantity            | int       |                              | Quantity             |
| item_price          | string    |                              | Item price           |
| discount_percentage | string    |                              | Discount percentage  |
| discount            | string    |                              | Discount             |
| tax_percentage      | string    |                              | Tax percentage       |
| tax                 | string    |                              | Tax                  |
| tax_2               | string    |                              | Second tax           |
| grand_total         | string    |                              | Grand total          |
| buyer_paid          | string    |                              | Buyer paid           |
| cost_of_goods       | array     |                              | Cost of goods        |
| status              | int       |                              | Status               |
| data                | array     |                              | Extra data           |
| settings            | array     |                              | Settings             |
| created_at          | datetime  |                              | Created timestamp    |
| updated_at          | datetime  |                              | Updated timestamp    |
| deleted_at          | datetime  |                              | Deleted timestamp    |
| account             | belongsTo | Account                      | Account relation     |
| child               | hasOne    | InvoiceItem                  | Child item           |
| integration         | belongsTo | Integration                  | Integration relation |
| inventory           | belongsTo | ProductInventory             | Inventory relation   |
| invoice             | belongsTo | Invoice                      | Invoice relation     |
| parent              | belongsTo | InvoiceItem (self)           | Parent item          |
| product             | belongsTo | Product                      | Product relation     |
| shop                | belongsTo | Shop                         | Shop relation        |
| variant             | belongsTo | ProductVariant               | Variant relation     |

## InvoicePayment

| Field          | Type      | Relationship      | Description         |
| -------------- | --------- | ----------------- | ------------------- |
| id             | int       |                   | Primary Key         |
| invoice_id     | int       | belongsTo Invoice | FK to Invoice       |
| sub_invoice_id | int       | belongsTo Invoice | FK to SubInvoice    |
| external_id    | string    |                   | External ID         |
| price          | string    |                   | Payment price       |
| reference      | string    |                   | Payment reference   |
| type           | int       |                   | Payment type        |
| settings       | array     |                   | Settings            |
| paid_at        | date      |                   | Paid date           |
| created_at     | datetime  |                   | Created timestamp   |
| updated_at     | datetime  |                   | Updated timestamp   |
| invoice        | belongsTo | Invoice           | Invoice relation    |
| subInvoice     | belongsTo | Invoice           | SubInvoice relation |

## Location

| Field              | Type     | Relationship              | Description        |
| ------------------ | -------- | ------------------------- | ------------------ |
| id                 | int      |                           | Primary Key        |
| linked_location_id | int      | belongsTo Location (self) | Linked location    |
| shop_id            | int      | belongsTo Shop            | FK to Shop         |
| account_id         | int      | belongsTo Account         | FK to Account      |
| external_id        | string   |                           | External ID        |
| label              | string   |                           | Location label     |
| contact_name       | string   |                           | Contact name       |
| contact_number     | string   |                           | Contact number     |
| contact_email      | string   |                           | Contact email      |
| name               | string   |                           | Location name      |
| full_address       | string   |                           | Full address       |
| address_1          | string   |                           | Address line 1     |
| address_2          | string   |                           | Address line 2     |
| city               | string   |                           | City               |
| state              | string   |                           | State              |
| postcode           | string   |                           | Postcode           |
| country            | string   |                           | Country            |
| has_inventory      | int      |                           | Has inventory flag |
| type               | int      |                           | Location type      |
| position           | int      |                           | Position           |
| attributes         | array    |                           | Attributes         |
| created_at         | datetime |                           | Created timestamp  |
| updated_at         | datetime |                           | Updated timestamp  |
| deleted_at         | datetime |                           | Deleted timestamp  |

## Mall

| Field        | Type     | Relationship | Description       |
| ------------ | -------- | ------------ | ----------------- |
| id           | int      |              | Primary Key       |
| name         | string   |              | Mall name         |
| email        | string   |              | Email address     |
| phone_number | string   |              | Phone number      |
| logo         | string   |              | Logo              |
| address      | mixed    |              | Address           |
| created_at   | datetime |              | Created timestamp |
| updated_at   | datetime |              | Updated timestamp |
| deleted_at   | datetime |              | Deleted timestamp |
| users        | hasMany  | User         | Related users     |
| shops        | hasMany  | Shop         | Related shops     |

## Order

| Field                        | Type      | Relationship          | Description                  |
| ---------------------------- | --------- | --------------------- | ---------------------------- |
| id                           | bigint    |                       | Primary Key                  |
| shop_id                      | bigint    | belongsTo Shop        | FK to Shop                   |
| created_by                   | bigint    | belongsTo User        | Created by user              |
| account_id                   | bigint    | belongsTo Account     | FK to Account                |
| integration_id               | bigint    | belongsTo Integration | FK to Integration            |
| consignee_id                 | bigint    | belongsTo Consignee   | FK to Consignee              |
| customer_id                  | bigint    | belongsTo Customer    | FK to Customer               |
| external_id                  | varchar   |                       | External ID (255)            |
| external_order_number        | varchar   |                       | External order number (255)  |
| external_source              | varchar   |                       | External source (255)        |
| source_marketplace           | enum      |                       | Source marketplace (enum)    |
| customer_name                | varchar   |                       | Customer name (255)          |
| customer_email               | varchar   |                       | Customer email (255)         |
| shipping_address             | json      |                       | Shipping address             |
| billing_address              | json      |                       | Billing address              |
| ship_by_date                 | datetime  |                       | Ship by date                 |
| currency                     | varchar   |                       | Currency (3)                 |
| credit_card_discount         | decimal   |                       | Credit card discount (18,4)  |
| integration_discount         | decimal   |                       | Integration discount (18,4)  |
| integration_discount_voucher | decimal   |                       | Integration discount voucher (18,4) |
| integration_discount_coin    | decimal   |                       | Integration discount coin (18,4) |
| seller_discount              | decimal   |                       | Seller discount (18,4)       |
| seller_discount_voucher      | decimal   |                       | Seller discount voucher (18,4) |
| seller_product_discount      | decimal   |                       | Seller product discount (18,4) |
| seller_refund_amount         | decimal   |                       | Seller refund amount (18,4)  |
| shipping_fee                 | decimal   |                       | Shipping fee (18,4)          |
| tax                          | decimal   |                       | Tax (18,4)                   |
| tax_2                        | decimal   |                       | Second tax (18,4)            |
| commission_fee               | decimal   |                       | Commission fee (18,4)        |
| sub_total                    | decimal   |                       | Subtotal (18,4)              |
| grand_total                  | decimal   |                       | Grand total (18,4)           |
| buyer_paid                   | decimal   |                       | Buyer paid (18,4)            |
| settlement_amount            | decimal   |                       | Settlement amount (18,4)     |
| payment_status               | tinyint   |                       | Payment status               |
| payment_method               | varchar   |                       | Payment method (255)         |
| fulfillment_status           | tinyint   |                       | Fulfillment status           |
| physical_fulfillment_status  | tinyint   |                       | Physical fulfillment status  |
| fulfillment_type             | tinyint   |                       | Fulfillment type             |
| buyer_remarks                | text      |                       | Buyer remarks                |
| notes                        | text      |                       | Notes                        |
| type                         | tinyint   |                       | Type                         |
| flag                         | json      |                       | Flag                         |
| data                         | json      |                       | Data                         |
| internal_data                | json      |                       | Internal data                |
| order_placed_at              | datetime  |                       | Order placed at              |
| order_updated_at             | datetime  |                       | Order updated at             |
| order_paid_at                | datetime  |                       | Order paid at                |
| parent_id                    | bigint    | belongsTo Order       | Parent order                 |
| actual_shipping_fee          | decimal   |                       | Actual shipping fee (18,4)   |
| integration_shipping_fee     | decimal   |                       | Integration shipping fee (18,4) |
| seller_shipping_fee          | decimal   |                       | Seller shipping fee (18,4)   |
| transaction_fee              | decimal   |                       | Transaction fee (18,4)       |
| service_fee                  | decimal   |                       | Service fee (18,4)           |
| sponsored_affiliates         | decimal   |                       | Sponsored affiliates (18,4)  |
| status                       | tinyint   |                       | Status                       |
| created_at                   | timestamp |                       | Created timestamp            |
| updated_at                   | timestamp |                       | Updated timestamp            |
| deleted_at                   | timestamp |                       | Deleted timestamp            |
| items                        | hasMany   | OrderItem             | Related order items          |
| alerts                       | hasMany   | OrderAlert            | Related order alerts         |
| shop                         | belongsTo | Shop                  | Shop relation                |
| account                      | belongsTo | Account               | Account relation             |
| integration                  | belongsTo | Integration           | Integration relation         |
| consignee                    | belongsTo | Consignee             | Consignee relation           |
| customer                     | belongsTo | Customer              | Customer relation            |
| parent                       | belongsTo | Order                 | Parent order                 |

**Note:** All monetary fields changed from float to decimal(18,4). Status fields changed from string to tinyint. source_marketplace is enum. internal_data changed from text to json. Has soft delete.

## OrderItem

| Field                        | Type      | Relationship               | Description                  |
| ---------------------------- | --------- | -------------------------- | ---------------------------- |
| id                           | bigint    |                            | Primary Key                  |
| order_id                     | bigint    | belongsTo Order            | FK to Order                  |
| shop_id                      | bigint    | belongsTo Shop             | FK to Shop                   |
| account_id                   | bigint    | belongsTo Account          | FK to Account                |
| integration_id               | bigint    | belongsTo Integration      | FK to Integration            |
| product_id                   | bigint    | belongsTo Product          | FK to Product                |
| product_variant_id           | bigint    | belongsTo ProductVariant   | FK to ProductVariant         |
| product_inventory_id         | bigint    | belongsTo ProductInventory | FK to ProductInventory       |
| external_id                  | varchar   |                            | External ID (255)            |
| external_product_id          | varchar   |                            | External product ID (255)    |
| name                         | varchar   |                            | Item name (255)              |
| sku                          | varchar   |                            | SKU (255)                    |
| variation_name               | varchar   |                            | Variation name (255)         |
| variation_sku                | varchar   |                            | Variation SKU (400)          |
| quantity                     | int       |                            | Quantity                     |
| item_price                   | decimal   |                            | Item price (18,4)            |
| credit_card_discount         | decimal   |                            | Credit card discount (18,4)  |
| integration_discount         | decimal   |                            | Integration discount (18,4)  |
| integration_discount_voucher | decimal   |                            | Integration discount voucher (18,4) |
| integration_discount_coin    | decimal   |                            | Integration discount coin (18,4) |
| seller_discount              | decimal   |                            | Seller discount (18,4)       |
| seller_discount_voucher      | decimal   |                            | Seller discount voucher (18,4) |
| seller_product_discount      | decimal   |                            | Seller product discount (18,4) |
| shipping_fee                 | decimal   |                            | Shipping fee (18,4)          |
| actual_shipping_fee          | decimal   |                            | Actual shipping fee (18,4)   |
| tax                          | decimal   |                            | Tax (18,4)                   |
| tax_2                        | decimal   |                            | Second tax (18,4)            |
| sub_total                    | decimal   |                            | Subtotal (18,4)              |
| grand_total                  | decimal   |                            | Grand total (18,4)           |
| buyer_paid                   | decimal   |                            | Buyer paid (18,4)            |
| cost_of_goods                | decimal   |                            | Cost of goods (18,4)         |
| fulfillment_status           | tinyint   |                            | Fulfillment status           |
| return_status                | tinyint   |                            | Return status                |
| inventory_status             | tinyint   |                            | Inventory status             |
| data                         | json      |                            | Extra data                   |
| shipment_provider            | varchar   |                            | Shipment provider (255)      |
| shipment_type                | varchar   |                            | Shipment type (255)          |
| shipment_method              | varchar   |                            | Shipment method (255)        |
| tracking_number              | varchar   |                            | Tracking number (255)        |
| remark                       | varchar   |                            | Remark (255)                 |
| created_at                   | timestamp |                            | Created timestamp            |
| updated_at                   | timestamp |                            | Updated timestamp            |
| deleted_at                   | timestamp |                            | Deleted timestamp            |
| order                        | belongsTo | Order                      | Order relation               |
| product                      | belongsTo | Product                    | Product relation             |
| productVariant               | belongsTo | ProductVariant             | ProductVariant relation      |
| shop                         | belongsTo | Shop                       | Shop relation                |
| account                      | belongsTo | Account                    | Account relation             |
| integration                  | belongsTo | Integration                | Integration relation         |
| productInventory             | belongsTo | ProductInventory           | ProductInventory relation    |

**Note:** All monetary fields changed from float to decimal(18,4). Status fields changed from int to tinyint. variation_sku length changed to 400. remark changed from text to varchar(255). Has soft delete.

## OrderAlert

| Field      | Type     | Relationship    | Description       |
| ---------- | -------- | --------------- | ----------------- |
| id         | int      |                 | Primary Key       |
| shop_id    | int      | belongsTo Shop  | FK to Shop        |
| order_id   | int      | belongsTo Order | FK to Order       |
| message    | string   |                 |                   |
| type       | int      |                 |                   |
| status     | int      |                 | Status            |
| created_at | datetime |                 | Created timestamp |
| updated_at | datetime |                 | Updated timestamp |

## UserShopPivot

| Field      | Type     | Relationship   | Description       |
| ---------- | -------- | -------------- | ----------------- |
| id         | int      |                | Primary Key       |
| user_id    | int      | belongsTo User | FK to User        |
| shop_id    | int      | belongsTo Shop | FK to Shop        |
| created_at | datetime |                | Created timestamp |
| updated_at | datetime |                | Updated timestamp |

## Batch

| Field            | Type      | Relationship       | Description            |
| ---------------- | --------- | ------------------ | ---------------------- |
| id               | bigint    |                    | Primary Key            |
| shop_id          | bigint    | belongsTo Shop     | FK to Shop             |
| created_by       | bigint    | belongsTo User     | Created by user        |
| last_updated_by  | bigint    | belongsTo User     | Last updated by        |
| location_id      | bigint    | belongsTo Location | FK to Location         |
| name             | varchar   |                    | Batch name (255)       |
| notes            | text      |                    | Notes                  |
| restock_date     | date      |                    | Restock date           |
| eta              | date      |                    | Estimated arrival      |
| location         | varchar   |                    | Location name/text (255)|
| mode             | tinyint   |                    | Mode                   |
| status           | tinyint   |                    | Status (0-10)          |
| region_id        | bigint    |                    | Region ID              |
| container_number | varchar   |                    | Container number (255) |
| origin_currency  | varchar   |                    | Origin currency (10)   |
| currency         | varchar   |                    | Currency (10)          |
| rate             | decimal   |                    | Exchange rate (18,6)   |
| created_at       | timestamp |                    | Created timestamp      |
| updated_at       | timestamp |                    | Updated timestamp      |
| inventories      | hasMany   | ProductInventory   | Related inventories    |
| batchPivots      | hasMany   | ProductInventoryBatchPivot | Batch relationships |
| shop             | belongsTo | Shop               | Shop relation          |

**Note:** No soft delete (no deleted_at column). Mode and status changed to tinyint. Rate precision changed to (18,6). ETA changed from datetime to date.

## ProductInventoryBatchPivot

This is the pivot table for the many-to-many relationship between Batch and ProductInventory.

| Field         | Type      | Description            |
| ------------- | --------- | ---------------------- |
| id            | bigint    | Primary Key            |
| batch_id      | bigint    | FK to Batch            |
| inventory_id  | bigint    | FK to ProductInventory |
| status        | tinyint   | Status                 |
| stock         | int       | Stock                  |
| cost          | decimal   | Cost (18,4)            |
| shipping_cost | decimal   | Shipping cost (18,4)   |
| landed_cost   | decimal   | Landed cost (18,4)     |
| currency      | varchar   | Currency (3)           |
| sold          | int       | Sold quantity          |
| priority      | smallint  | Priority               |
| expiry_date   | timestamp | Expiry date            |
| completed_at  | timestamp | Completed at           |
| location_id   | bigint    | FK to Location         |
| origin_cost   | decimal   | Origin cost (18,4)     |
| commission    | decimal   | Commission (18,4)      |
| surcharge     | decimal   | Surcharge (18,4)       |
| subtotal      | decimal   | Subtotal (18,4)        |
| created_at    | timestamp | Created timestamp      |
| updated_at    | timestamp | Updated timestamp      |

**Note:** Added id as primary key. All monetary fields changed to decimal(18,4). Added priority field (smallint). Expiry_date changed from datetime to timestamp.

## ProductInventoryTrail

| Field                | Type     | Relationship               | Description                   |
| -------------------- | -------- | -------------------------- | ----------------------------- |
| id                   | int      |                            | Primary Key                   |
| product_inventory_id | int      | belongsTo ProductInventory | FK to ProductInventory        |
| batch_id             | int      | belongsTo Batch            | FK to Batch (nullable)        |
| shop_id              | int      | belongsTo Shop             | FK to Shop                    |
| user_id              | int      | belongsTo User             | FK to User (nullable)         |
| message              | string   |                            | Message                       |
| type                 | int      |                            | Trail type (enum, nullable)   |
| related_id           | string   |                            | Related model ID (nullable)   |
| related_type         | string   |                            | Related model type (nullable) |
| unique_type          | string   |                            | Unique type (nullable)        |
| unique_id            | int      |                            | Unique ID (nullable)          |
| old                  | int      |                            | Old quantity                  |
| new                  | int      |                            | New quantity                  |
| unit_cost            | string   |                            | Unit cost (nullable)          |
| unit_selling_price   | string   |                            | Unit selling price (nullable) |
| created_at           | datetime |                            | Created timestamp             |
| updated_at           | datetime |                            | Updated timestamp             |

## DeleteAccountTask

| Field      | Type     | Relationship      | Description       |
| ---------- | -------- | ----------------- | ----------------- |
| id         | int      |                   | Primary Key       |
| shop_id    | int      | belongsTo Shop    | FK to Shop        |
| user_id    | int      | belongsTo User    | FK to User        |
| account_id | int      | belongsTo Account | FK to Account     |
| messages   | array    |                   | Messages          |
| settings   | array    |                   | Settings          |
| status     | string   |                   | Status            |
| created_at | datetime |                   | Created timestamp |
| updated_at | datetime |                   | Updated timestamp |

## DeliveryOrder

| Field                 | Type      | Relationship          | Description           |
| --------------------- | --------- | --------------------- | --------------------- |
| id                    | int       |                       | Primary Key           |
| shop_id               | int       | belongsTo Shop        | FK to Shop            |
| created_by            | int       | belongsTo User        | FK to User            |
| integration_id        | int       | belongsTo Integration | FK to Integration     |
| account_id            | int       | belongsTo Account     | FK to Account         |
| supplier_id           | int       | belongsTo Supplier    | FK to Supplier        |
| batch_id              | int       | belongsTo Batch       | FK to Batch           |
| order_id              | int       | belongsTo Order       | FK to Order           |
| delivery_order_number | string    |                       | Delivery order number |
| external_id           | string    |                       | External ID           |
| external_invoice_id   | string    |                       | External invoice ID   |
| company_name          | string    |                       | Company name          |
| company_logo          | string    |                       | Company logo          |
| currency              | string    |                       | Currency              |
| tax_inclusive         | int       |                       | Tax inclusive flag    |
| tax                   | string    |                       | Tax                   |
| tax_percent           | string    |                       | Tax percent           |
| sub_total             | string    |                       | Subtotal              |
| grand_total           | string    |                       | Grand total           |
| notes                 | string    |                       | Notes                 |
| shipping_address      | array     |                       | Shipping address      |
| billing_address       | array     |                       | Billing address       |
| delivery_method       | string    |                       | Delivery method       |
| include_type          | int       |                       | Include type          |
| status                | int       |                       | Status                |
| inventory_sync        | int       |                       | Inventory sync flag   |
| batch_mode            | int       |                       | Batch mode            |
| placed_at             | datetime  |                       | Placed timestamp      |
| due_at                | datetime  |                       | Due timestamp         |
| created_at            | datetime  |                       | Created timestamp     |
| updated_at            | datetime  |                       | Updated timestamp     |
| account               | belongsTo | Account               | Account relation      |
| batch                 | belongsTo | Batch                 | Batch relation        |
| integration           | belongsTo | Integration           | Integration relation  |
| items                 | hasMany   | DeliveryOrderItem     | Delivery order items  |
| order                 | belongsTo | Order                 | Order relation        |
| shop                  | belongsTo | Shop                  | Shop relation         |
| supplier              | belongsTo | Supplier              | Supplier relation     |

## DeliveryOrderItem

| Field             | Type      | Relationship               | Description             |
| ----------------- | --------- | -------------------------- | ----------------------- |
| id                | int       |                            | Primary Key             |
| shop_id           | int       | belongsTo Shop             | FK to Shop              |
| integration_id    | int       | belongsTo Integration      | FK to Integration       |
| account_id        | int       | belongsTo Account          | FK to Account           |
| delivery_order_id | int       | belongsTo DeliveryOrder    | FK to DeliveryOrder     |
| inventory_id      | int       | belongsTo ProductInventory | FK to Inventory         |
| ordered           | int       |                            | Ordered quantity        |
| delivered         | int       |                            | Delivered quantity      |
| rejected          | int       |                            | Rejected quantity       |
| item_price        | string    |                            | Item price              |
| tax               | string    |                            | Tax                     |
| sub_total         | string    |                            | Subtotal                |
| grand_total       | string    |                            | Grand total             |
| numbering         | int       |                            | Numbering               |
| delivered_at      | datetime  |                            | Delivered timestamp     |
| created_at        | datetime  |                            | Created timestamp       |
| updated_at        | datetime  |                            | Updated timestamp       |
| account           | belongsTo | Account                    | Account relation        |
| integration       | belongsTo | Integration                | Integration relation    |
| inventory         | belongsTo | ProductInventory           | Inventory relation      |
| order             | belongsTo | DeliveryOrder              | Delivery order relation |
| shop              | belongsTo | Shop                       | Shop relation           |

## Entity

| Field          | Type      | Relationship          | Description          |
| -------------- | --------- | --------------------- | -------------------- |
| id             | int       |                       | Primary Key          |
| shop_id        | int       | belongsTo Shop        | FK to Shop           |
| integration_id | int       | belongsTo Integration | FK to Integration    |
| account_id     | int       | belongsTo Account     | FK to Account        |
| external_id    | string    |                       | External ID          |
| name           | string    |                       | Entity name          |
| type           | string    |                       | Entity type          |
| property_1     | string    |                       | Property 1           |
| property_2     | string    |                       | Property 2           |
| property_3     | string    |                       | Property 3           |
| data           | array     |                       | Extra data           |
| created_at     | datetime  |                       | Created timestamp    |
| updated_at     | datetime  |                       | Updated timestamp    |
| account        | belongsTo | Account               | Account relation     |
| integration    | belongsTo | Integration           | Integration relation |
| shop           | belongsTo | Shop                  | Shop relation        |
