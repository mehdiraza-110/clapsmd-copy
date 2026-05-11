# Documents API

Base URL: use the same backend origin as the other admin APIs, for example `http://localhost:3001`.

## Data Shape

```json
{
  "id": 1,
  "document_name": "Consent Form",
  "document_type": "consent_doc",
  "document_url": "https://bucket.s3.ca-central-1.amazonaws.com/documents/file.pdf",
  "notes": "Optional internal note",
  "visibility_status": true,
  "created_at": "2026-05-11T10:00:00.000Z",
  "updated_at": "2026-05-11T10:00:00.000Z"
}
```

## Document Types

Allowed `document_type` values:

- `consent_doc`
- `coinsurance_doc`
- `self_pay_agreement_doc`

You can fetch these from:

`GET /documents/types`

Success: `200`

```json
{
  "message": "Document types retrieved successfully",
  "document_types": ["consent_doc", "coinsurance_doc", "self_pay_agreement_doc"]
}
```

## Endpoints

### Create

`POST /documents`

Send as `multipart/form-data` when uploading a file:

```text
document_name=Consent Form
document_type=consent_doc
document_file=<file>
notes=Optional internal note
visibility_status=true
```

The file field must be named `document_file`.

You can also create a document from an existing URL with JSON:

```json
{
  "document_name": "Consent Form",
  "document_type": "consent_doc",
  "document_url": "https://example.com/consent.pdf",
  "notes": "Optional internal note",
  "visibility_status": true
}
```

Success: `201`

```json
{
  "message": "Document created successfully",
  "document": {}
}
```

### List for Admin

`GET /documents`

Optional query params:

- `search`: searches `document_name` and `notes`
- `document_type`: one of the allowed document types
- `visibility_status`: `true` or `false`

Examples:

```text
GET /documents
GET /documents?search=consent
GET /documents?document_type=consent_doc
GET /documents?visibility_status=true
GET /documents?document_type=coinsurance_doc&visibility_status=true
```

Success: `200`

```json
{
  "message": "Documents retrieved successfully",
  "documents": []
}
```

Items are ordered newest first.

### Get One

`GET /documents/:id`

Success: `200`

```json
{
  "message": "Document retrieved successfully",
  "document": {}
}
```

### Update

`PUT /documents/:id`

Send as `multipart/form-data` if replacing the file:

```text
document_name=Consent Form Updated
document_type=consent_doc
document_file=<file>
notes=Updated note
visibility_status=true
```

If `document_file` is provided, the API uploads the new file to S3 and deletes the previous S3 file when possible.

You can also update without replacing the file by sending JSON:

```json
{
  "document_name": "Consent Form Updated",
  "document_type": "consent_doc",
  "notes": "Updated note",
  "visibility_status": true
}
```

Or replace the stored URL directly:

```json
{
  "document_name": "Consent Form Updated",
  "document_type": "consent_doc",
  "document_url": "https://example.com/new-consent.pdf",
  "notes": "Updated note",
  "visibility_status": true
}
```

Success: `200`

```json
{
  "message": "Document updated successfully",
  "document": {}
}
```

### Delete

`DELETE /documents/:id`

Deletes the database row and attempts to delete the stored S3 file when the `document_url` belongs to the configured bucket.

Success: `200`

```json
{
  "message": "Document deleted successfully",
  "document": {}
}
```

## Validation Notes

- `document_name` is required and must be unique.
- `document_type` is required and must be one of the allowed values.
- Create requires either `document_file` or `document_url`.
- Update keeps the existing `document_url` if no new `document_file` or `document_url` is sent.
- `visibility_status` must be boolean.
- `notes` is optional.

## Frontend Mapping

- Document Name input -> `document_name`
- Document Type dropdown -> `document_type`
- File upload input -> `document_file`
- Existing URL input -> `document_url`
- Notes textarea -> `notes`
- Visible toggle -> `visibility_status`





