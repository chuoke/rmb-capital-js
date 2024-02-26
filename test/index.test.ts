import { expect, it } from 'vitest'
import { rmbCapital } from '../src'

const cases = {
    '人民币零元整': 0,
    '人民币柒分': 0.07,
    '人民币伍角柒分': 0.57,
    '人民币肆角整': 0.40,
    '人民币壹元整': 1,
    '人民币壹元贰角整': 1.2,
    '人民币壹佰元整': 100,
    '人民币壹佰零壹元整': 101,
    '人民币壹佰壹拾元整': 110,
    '人民币叁佰壹拾元零捌分': 310.08,
    '人民币贰拾万陆仟元柒角伍分': 206000.75,
    '人民币陆万柒仟捌佰零玖元零贰分': 67809.02,
};

for (let key in cases) {
    it(key, () => {
        const res = rmbCapital(cases[key])
        expect(res).toBe(key)
    })
}
