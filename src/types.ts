
export interface RmbCapitalConverterConfig {
    /**
     * @default ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖',]
     */
    capital_numbers: string[],

    /**
     * @default ['', '拾', '佰', '仟']
     */
    integer_units: string[],

    /**
     * @default ['', '万', '亿']
     */
    place_units: string[],

    /**
     * @default ['角', '分', '厘', '毫']
     */
    decimal_units: string[],

    /**
     * @default '人民币'
     */
    prefix: string,
}

export interface RmbCapitalConverterOptions extends Partial<RmbCapitalConverterConfig> { }