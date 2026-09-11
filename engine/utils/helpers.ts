export function capitalizeFirstLetter(str:string) {
  if (!str) return str; 
  return str.charAt(0).toUpperCase() + str.slice(1);
}
interface FormatMoneyOptions {
  currency?: string; // e.g., 'USD', 'EUR', 'GBP'
  locale?: string;   // e.g., 'en-US', 'de-DE'
  displayCents?: boolean;
}

export function money(amount: number,
  options: FormatMoneyOptions = {}
): string {
  const {
    currency = "KES",
    locale = "en-US",
    displayCents = true
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: displayCents ? 2 : 0,
    maximumFractionDigits: displayCents ? 2 : 0,
  });

  return formatter.format(amount);
}
function ean13CheckDigit(data: string) {
    if (data.length !== 12)
        throw new Error("EAN13 requires exactly 12 digits.");

    let sum = 0;

    for (let i = 0; i < 12; i++) {
        const digit = Number(data[i]);
        sum += i % 2 === 0 ? digit : digit * 3;
    }

    return ((10 - (sum % 10)) % 10).toString();
}
export function generateBarcode() {
    const body = "200" + Date.now().toString().slice(-9); // 12 digits

    return body + ean13CheckDigit(body);
}