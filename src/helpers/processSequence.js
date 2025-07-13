/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
//  import Api from '../tools/api';

//  const api = new Api();

//  /**
//   * Я – пример, удали меня
//   */
//  const wait = time => new Promise(resolve => {
//      setTimeout(resolve, time);
//  })

//  const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
//      /**
//       * Я – пример, удали меня
//       */
//      writeLog(value);

//      api.get('https://api.tech/numbers/base', {from: 2, to: 10, number: '01011010101'}).then(({result}) => {
//          writeLog(result);
//      });

//      wait(2500).then(() => {
//          writeLog('SecondLog')

//          return wait(1500);
//      }).then(() => {
//          writeLog('ThirdLog');

//          return wait(400);
//      }).then(() => {
//          handleSuccess('Done');
//      });
//  }

// export default processSequence;


import { allPass, match, not, pipe, tap } from 'ramda';
import Api from '../tools/api';
import { isEmpty} from 'lodash';

const api = new Api();

const moreThenTwoSym = (value) => value.length >= 3;
const lessThenTenSym = (value) => value.length <= 9;
const isNum = (value) => Number(value) > 0;
const matchRegex = pipe(
    match(/^[0-9.]+$/),
    isEmpty,
    not
)

const roundNum = (value) => Math.round(Number(value));
const roundNumWithLog = (writeLog) => pipe(
    roundNum,
    tap(writeLog),
);

const getLen = (value) => value.length;
const getLenWithLog = (writeLog) => pipe(
    getLen,
    tap(writeLog),
)
const getSquare = (value) => value ** 2;
const getSquareWithLog = (writeLog) => pipe(
    getSquare,
    tap(writeLog),
)
const getMod3 = (value) => value % 3;
const getMod3WithLog = (writeLog) => pipe(
    getMod3,
    tap(writeLog),
)

const processBinary = (writeLog) => pipe(
    tap(writeLog),
    getLenWithLog(writeLog),
    getSquareWithLog(writeLog),
    getMod3WithLog(writeLog),
);



const checkCorrect = allPass([
    moreThenTwoSym, lessThenTenSym, isNum, matchRegex
])

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
  writeLog(value);

  if (!checkCorrect(value)) {
    handleError('ValidationError');
    return;
  }

  const num = roundNumWithLog(writeLog)(value);

  api.get('https://api.tech/numbers/base', {from: 10, to: 2, number: num})
    .then(({result}) => {
      if (!result) throw new Error('Empty conversion result');
      return processBinary(writeLog)(result);
    })
    .catch((error) => {
        writeLog('error while converting number');
        handleError('Number conversion error');
    })
    .then((mod) => api.get(`https://animals.tech/`, {id: mod}))
    .then(({result}) => {
          if (!result) throw new Error('Animal not found');
          handleSuccess(result);
    })
    .catch((error) => {
       writeLog('error while getting animal');
    });
};

export default processSequence;
