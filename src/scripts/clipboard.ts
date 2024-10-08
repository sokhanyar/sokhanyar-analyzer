export const copyToClipboard = async (value) => {
  try {
    //let copyValue = "";

    if (!navigator.clipboard) {
      throw new Error("مرورگر شما از این قابلیت پشتیبانی نمیکند!");
    }

    if (!value) {
      throw new Error("مقدار نامعتبر!");
    }

    // if (target) {
    //   const node = document.querySelector(target);
    //
    //   if (!node || !node.textContent) {
    //     throw new Error("Element not found");
    //   }
    //
    //   value = node.textContent;
    // }
    //copyValue = value;

    await navigator.clipboard.writeText(value);
    return "Copied";
  } catch (error) {
    return error.toString();
  }
};
