export const copyToClipboard = async (value) => {
  try {
    if (!navigator.clipboard) {
      throw new Error("مرورگر شما از این قابلیت پشتیبانی نمیکند!");
    }

    if (!value) {
      throw new Error("مقدار نامعتبر!");
    }

    await navigator.clipboard.writeText(value);
    return "Copied";
  } catch (error) {
    return error.toString();
  }
};
