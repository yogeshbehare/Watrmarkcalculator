import { isAllowedImageType, UPLOAD_LIMITS } from "@/lib/constants";

export type ClientValidationInput = {
  width: number;
  height: number;
  quantity: number;
  file: File | null;
};

export function validateQuoteInput(input: ClientValidationInput) {
  if (!Number.isFinite(input.width) || input.width <= 0) {
    return "Print width must be greater than 0.";
  }

  if (!Number.isFinite(input.height) || input.height <= 0) {
    return "Print height must be greater than 0.";
  }

  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    return "Quantity must be at least 1.";
  }

  if (!input.file) {
    return "Please upload a JPG or PNG artwork file.";
  }

  if (!isAllowedImageType(input.file.type)) {
    return "Only JPG and PNG artwork files are supported.";
  }

  if (input.file.size > UPLOAD_LIMITS.maxBytes) {
    return "Artwork must be 5MB or smaller.";
  }

  return null;
}
