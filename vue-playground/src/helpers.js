import chroma from 'chroma-js';
import * as util from '@arturbaybulatov/util-js';


const { ensure } = util;

export const buildCssGradientPoints = colorStrings => {
  ensure(Array.isArray(colorStrings) && colorStrings.length >= 1, 'Array with at least one item expected');
  ensure(colorStrings.every(colorString => typeof colorString === 'string' && chroma.valid(colorString)), 'Valid color strings expected');

  if (colorStrings.length === 1) {
    const colorString = colorStrings[0];
    return `${colorString} 0%, ${colorString} 100%`;
  }

  const items = colorStrings.map((colorString, i) => ({
    colorString,
    percent: i / colorStrings.length * 100,
  }));

  colorStrings.forEach((colorString, i) => {
    items.push({
      colorString,
      percent: ((i + 1) / colorStrings.length * 100) - 0.01,
    });
  });

  items.sort((a, b) => a.percent - b.percent);

  return items.map((item, i) => `${item.colorString} ${item.percent}%`).join(', ');
};
