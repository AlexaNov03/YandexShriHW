/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {equals, values, pipe, filter, allPass, prop, anyPass, complement} from 'ramda'

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({star, square, triangle, circle}) => {
    if (triangle !== 'white' || circle !== 'white') {
        return false;
    }

    return star === 'red' && square === 'green';
};



// 2. Как минимум две фигуры зеленые.
// export const validateFieldN2 = () => false;

const more2 = val => val.length >= 2;

export const validateFieldN2 = pipe(
    values, 
    filter(equals('green')),
    more2,
)

// 3. Количество красных фигур равно кол-ву синих.



// export const validateFieldN3 = () => false;

const redEqualsBlue = (mas) => mas.filter(equals('red')).length === mas.filter(equals('blue')).length

export const validateFieldN3 = pipe(
    values, 
    redEqualsBlue
)

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
// export const validateFieldN4 = () => false;

export const validateFieldN4 = allPass([
    pipe(prop('circle'), equals('blue')),
    pipe(prop('star'), equals('red')),
    pipe(prop('square'), equals('orange')),
])



// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).

const moreThanThreeOneColor = (color) => pipe(values, filter(equals(color)), mas => mas.length >= 3)

const fourOneColor = (color) => pipe(values, filter(equals(color)), mas => mas.length === 4)

export const validateFieldN5 = anyPass([
    moreThanThreeOneColor('blue'),
    moreThanThreeOneColor('orange'),
    moreThanThreeOneColor('red'),
    moreThanThreeOneColor('green'),
    fourOneColor('white')
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
// export const validateFieldN6 = () => false;
export const validateFieldN6 = allPass([
  pipe(values, filter(equals('green')), arr => arr.length === 2),
  pipe(prop('triangle'), equals('green')),
  pipe(values, filter(equals('red')), arr => arr.length === 1)
]);

// 7. Все фигуры оранжевые.
const allFiguresOneColor = (color) => pipe(values, filter(equals(color)), mas => mas.length === 4)
// export const validateFieldN7 = () => false;

export const validateFieldN7 = allFiguresOneColor('orange');



// 8. Не красная и не белая звезда, остальные – любого цвета.
// export const validateFieldN8 = () => false;
export const validateFieldN8 = allPass([
    pipe(prop('star'), complement(equals('red'))),
    pipe(prop('star'), complement(equals('white'))),
]);

// 9. Все фигуры зеленые.
// export const validateFieldN9 = () => false;
export const validateFieldN9 = allFiguresOneColor('green');

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
// export const validateFieldN10 = () => false;
export const validateFieldN10 = allPass([
  pipe(({triangle, square}) => triangle === square),
  pipe(prop('triangle'), complement(equals('white')))
]);
