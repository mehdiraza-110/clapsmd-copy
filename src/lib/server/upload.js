export async function fileFromFormData(formData, fieldName) {
  const file = formData.get(fieldName);
  if (!file || typeof file === "string" || file.size === 0) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    buffer,
    originalname: file.name,
    mimetype: file.type,
  };
}
