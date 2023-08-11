/*
 * @Author: ZhengJie
 * @Date: 2023-08-07 00:37:45
 * @Description: utils
 */

import * as moment from 'moment';
import SnowflakeID from './snowflake';

export const getControllerName = (__dirname) => {
  return __dirname.split('/modules')[1];
};

/**
 * 时间格式化
 * @param value 时间
 * @param fmt 格式
 * @param emptyString 空值
 * @returns string
 */
export const formatDate = (
  value: any,
  fmt = 'YYYY-MM-DD HH:mm:ss',
  emptyString = '-',
) => {
  if (!value) {
    return emptyString || '';
  }
  return moment(value).format(fmt);
  // return value;
};

/**
 * 输出log
 * @param args any
 */
export const log2term = (...args: any) => {
  console.log(formatDate(+new Date()), args);
};

const options: any = {
  WorkerId: process.pid,
};
export const snowflakeID = new SnowflakeID(options);
