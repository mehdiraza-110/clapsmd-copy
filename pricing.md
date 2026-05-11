# Pricing Items API

Base URL: use the same backend origin as the other admin APIs, for example `http://localhost:3001`.

## Data Shape

```json
{
  "id": 1,
  "pricing_item": "New Patient Visit",
  "amount": "150.00",
  "display_order": 10,
  "notes": "Optional internal note",
  "visibility_status": true,
  "created_at": "2026-05-08T10:00:00.000Z",
  "updated_at": "2026-05-08T10:00:00.000Z"
}
```

`amount` may come back as a string because Postgres `NUMERIC` values are returned that way by `pg`. Convert it to `Number(item.amount)` in the UI when formatting.

## Endpoints

### Create

`POST /pricing-items`

```json
{
  "pricing_item": "New Patient Visit",
  "amount": 150,
  "display_order": 10,
  "notes": "Optional internal note",
  "visibility_status": true
}
```

Success: `201`

```json
{
  "message": "Pricing item created successfully",
  "pricing_item": {}
}
```

### List for Admin

`GET /pricing-items`

Optional query params:

- `search`: searches `pricing_item` and `notes`
- `visibility_status`: `true` or `false`

Examples:

```text
GET /pricing-items
GET /pricing-items?search=visit
GET /pricing-items?visibility_status=true
```

Success: `200`

```json
{
  "message": "Pricing items retrieved successfully",
  "pricing_items": []
}
```

Items are ordered by `display_order ASC`, then newest first.

### List Visible Items

`GET /pricing-items/visible`

Use this for public website pricing sections if you only want items where `visibility_status` is `true`.

### Get One

`GET /pricing-items/:id`

### Update

`PUT /pricing-items/:id`

Send the full editable payload:

```json
{
  "pricing_item": "Follow-up Visit",
  "amount": 75,
  "display_order": 20,
  "notes": "",
  "visibility_status": true
}
```

### Delete

`DELETE /pricing-items/:id`

Success: `200`

```json
{
  "message": "Pricing item deleted successfully",
  "pricing_item": {}
}
```

## Validation Notes

- `pricing_item` is required and must be unique.
- `amount` is required, numeric, and cannot be negative.
- `display_order` is required, integer, and cannot be negative.
- `visibility_status` must be boolean.
- `notes` is optional.

## Frontend Mapping

- Pricing Item input -> `pricing_item`
- Amount input -> `amount`
- Display Order input -> `display_order`
- Notes textarea -> `notes`
- Visible on site toggle -> `visibility_status`
