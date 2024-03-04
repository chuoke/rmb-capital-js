import { RmbCapitalConverterConfig, RmbCapitalConverterOptions } from "./types";

const defaultRmbCapitalConverterConfig: RmbCapitalConverterConfig = {
    capital_numbers: ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖',],
    integer_units: ['', '拾', '佰', '仟'],
    place_units: ['', '万', '亿'],
    decimal_units: ['角', '分', '厘', '毫'],
    prefix: '人民币',
}

/**
 * 转换
 * @param amount 
 * @param options 
 * @returns 
 */
export function rmbCapital(amount: string | number, options?: RmbCapitalConverterOptions): string {
    const config = { ...defaultRmbCapitalConverterConfig, ...(options || {}) } as RmbCapitalConverterConfig;

    // 转换整数部分
    let integerResult = convertInteger(amount, config);

    // 转换小数位
    let decimalResult = convertDecimal(amount, config);

    // 没有则为 零元
    // 注意，类似：0.07元，应为 人民币柒分
    if (!integerResult && !decimalResult) {
        integerResult += config.capital_numbers[0];
    }

    // 整数位后要跟元
    if (integerResult) {
        integerResult += '元';
    }

    if (!decimalResult) {
        integerResult += '整';
    }

    if ((amount + '').trim().startsWith('-')) {
        integerResult = '负' + integerResult;
    }

    return config.prefix + integerResult + decimalResult;
}

/**
 * 转换整数部分
 * 
 * @param amount 
 * @param options 
 * @returns 
 */
function convertInteger(amount: string | number, options?: RmbCapitalConverterOptions): string {
    const config = { ...defaultRmbCapitalConverterConfig, ...(options || {}) } as RmbCapitalConverterConfig;

    const parts = (amount + '').trim().split('.');
    const integer = (parts[0] || '').replace('-', '');

    let result: string[] = [];

    // 反着按日常习惯，从个位开始转换
    const integerNumbers = parseInt(integer) ? integer.split('').reverse() : [];

    // 阿拉伯金额数字中间有“0”时，汉字大写金额要写“零”字；
    // 数字中间连续有几个“0”，汉字大写金额可以只写一个“零”字

    let last: number | null = null;
    for (let i = 0; i < integerNumbers.length; i += 4) {
        const chunk = integerNumbers.slice(i, i + 4);
        const chunkKey = i / 4;

        const chunkInt = parseInt(chunk.join(''));
        if (chunkInt === 0 || isNaN(chunkInt)) {
            // 全是 0 则直接跳过
            continue;
        }

        result.unshift((config.place_units[chunkKey]) || '');

        for (const key in chunk) {
            const number = parseInt(chunk[key]);
            // 去除重复 零，以及第一位的 零，类似：1002、110，应为 壹仟零贰元整、壹佰壹拾元整
            if (!number && (!last || key === '0')) {
                last = number;

                continue;
            }
            last = number;

            // 类似 1022，应为 壹仟零贰拾贰元整，中间的 0 是不需要 佰 的
            if (number) {
                result.unshift(config.integer_units[key] || '');
            }

            result.unshift(config.capital_numbers[number] || '');
        }
    }

    return result.join('');
}

/**
 * 转换小数部分
 * @param amount 
 * @param options 
 * @returns 
 */
function convertDecimal(amount: string | number, options?: RmbCapitalConverterOptions): string {
    const config = { ...defaultRmbCapitalConverterConfig, ...(options || {}) } as RmbCapitalConverterConfig;
    const result: string[] = [];

    const parts = (amount + '').trim().split('.');
    const integer = parseInt((parts[0] || '').replace('-', ''));

    let decimal = parts[1] || '';
    const decimalIntval = parseInt(decimal);
    if (decimalIntval === 0 || isNaN(decimalIntval)) {
        decimal = '';
    }

    const decimalNumbers = decimal.split('');

    const jiao = parseInt(decimalNumbers.shift() || ''); // 角比较特殊

    if (jiao) {
        result.push(...[config.capital_numbers[jiao], config.decimal_units[0]]);

        if (decimalNumbers.filter((n) => !!n).length === 0) {
            result.push('整');
        }
    } else {
        // 如：0.07元，应为 人民币柒分
        // 而类似 23.05 应为 贰拾叁元零伍分
        if (decimalNumbers.filter((n) => !!n).length > 0 && integer) {
            result.push(config.capital_numbers[0]);
        }
    }

    for (const key in decimalNumbers) {
        const number = decimalNumbers[key];

        if (number) {
            result.push(...[config.capital_numbers[parseInt(number)], config.decimal_units[parseInt(key) + 1]]);
        }
    }

    return result.join('');
}

export default rmbCapital;