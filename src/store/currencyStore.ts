import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Currency {
    code: string;
    symbol: string;
    name: string;
    locale: string;
}

export const SUPPORTED_CURRENCIES: Record<string, Currency> = {
    LYD: { code: 'LYD', symbol: 'د.ل', name: 'دينار ليبي', locale: 'ar-LY' },
    SAR: { code: 'SAR', symbol: 'ر.س', name: 'ريال سعودي', locale: 'ar-SA' },
    USD: { code: 'USD', symbol: '$', name: 'دولار أمريكي', locale: 'en-US' },
};

interface CurrencyState {
    currentCurrency: Currency;
    setCurrency: (code: string) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set) => ({
            currentCurrency: SUPPORTED_CURRENCIES['LYD'],
            setCurrency: (code) => {
                if (SUPPORTED_CURRENCIES[code]) {
                    set({ currentCurrency: SUPPORTED_CURRENCIES[code] });
                }
            },
        }),
        {
            name: 'currency-storage',
        }
    )
);

/**
 * Utility to format amount with current currency
 * Usage: const { formatAmount } = useCurrency();
 */
export const useCurrency = () => {
    const { currentCurrency } = useCurrencyStore();

    const formatAmount = (amount: number | string, options: { showSymbol?: boolean; precision?: number } = {}) => {
        const { showSymbol = true, precision = 2 } = options;
        const value = typeof amount === 'string' ? parseFloat(amount) : amount;

        if (isNaN(value)) return `0.00 ${showSymbol ? currentCurrency.symbol : ''}`.trim();

        const formatted = value.toLocaleString(currentCurrency.locale, {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision,
        });

        return showSymbol ? `${formatted} ${currentCurrency.symbol}` : formatted;
    };

    return {
        currentCurrency,
        formatAmount,
        symbol: currentCurrency.symbol
    };
};
